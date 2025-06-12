
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { Loader } from "lucide-react";
import { Baseurl } from "../confige";

function AutoLogin() {
  const navigate = useNavigate();
  const { login, signup } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 🆕 To store actual error message

  const findCommunityById = (list, targetId) => {
    for (const city in list) {
      const match = list[city]?.find((item) => item.customer_id === targetId);
      if (match) return match;
    }
    return null;
  };

  useEffect(() => {
    const autoLogin = async () => {
      const communityId = searchParams.get("communityId");
      const authToken = searchParams.get("authToken");

      if (!communityId || !authToken) {
        const msg = "Missing communityId or authToken in URL.";
        console.error("❌", msg);
        setError(msg);
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch community list
        console.log("📥 Fetching community list...");
        const res = await axios.get(
          "https://www.fretbox.in/internal/socialpoc/fretboxuser/public/accountsV5?country=IN"
        );
        const list = res.data?.data?.communities || {};
        console.log("✅ Community list fetched", list);

        // 2. Find matching community
        const community = findCommunityById(list, communityId);
        if (!community) {
          const msg = `Community not found for ID: ${communityId}`;
          console.error("❌", msg);
          setError(msg);
          setLoading(false);
          return;
        }

        console.log("✅ Found matching community:", community);

        const apiUrl = community.api_url;
        if (!apiUrl) {
          const msg = "API URL missing for community.";
          console.error("❌", msg);
          setError(msg);
          setLoading(false);
          return;
        }

        // 3. Fetch user profile
        console.log("📥 Fetching user profile from:", `${apiUrl}userProfile`);
        const profileRes = await axios.get(`${apiUrl}userProfile`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const user = profileRes.data?.data?.user?.[0];
        console.log("✅ User profile response:", profileRes.data);

        if (!user) {
          const msg = "User profile not found or invalid token.";
          console.error("❌", msg);
          setError(msg);
          setLoading(false);
          return;
        }

        const fullName = user.name;
        const email = user.email;
        const password = "123456"; // known default
        const role = user.role_name;

        console.log("👤 User details:", { fullName, email, role, communityId });

        // 4. Check if user exists
        console.log("🔍 Checking if user exists...");
        const check = await axios.get(Baseurl + "/api/v1/user/checkuser", {
          params: { email, communityId },
        });

        const exists = check?.data?.exists;
        console.log("✅ User exists check:", exists);

        if (exists) {
          console.log("🔑 Logging in...");
          const loginRes = await login(email, password, communityId);
          console.log("✅ Login result:", loginRes);
          if (loginRes) return navigate("/");
        } else {
          console.log("📝 Signing up user...");
          const signupRes = await signup({
            fullName,
            email,
            password,
            communityId,
            role,
          });
          console.log("✅ Signup result:", signupRes);

          if (signupRes) {
            await new Promise((r) => setTimeout(r, 800));
            console.log("🔑 Trying login after signup...");
            const loginRes = await login(email, password, communityId);
            console.log("✅ Login result after signup:", loginRes);
            if (loginRes) return navigate("/");
          }
        }

        const msg = "Login failed even after signup attempt.";
        console.error("❌", msg);
        setError(msg);
      } catch (err) {
        const msg =
          err?.response?.data ||
          err?.response?.data ||
          err.message ||
          "Unknown error occurred.";
        console.error("❌ Auto login failed:", msg);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    autoLogin();
  }, []);

  // Show loader while loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // Show error if any
  return (
    <div className="flex flex-col items-center justify-center h-screen text-red-600 text-center px-4">
      <h2 className="text-xl font-bold mb-2">❌ login Failed</h2>
      <p className="text-sm max-w-md">{error}</p>
    </div>
  );
}

export default AutoLogin;
