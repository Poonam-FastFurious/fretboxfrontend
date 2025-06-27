import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { Loader } from "lucide-react";
import { Baseurl } from "../confige";

function AutoLogin() {
  const navigate = useNavigate();
  const { loginByPayload } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lockRef = useRef(false);

  useEffect(() => {
    if (lockRef.current) return;
    lockRef.current = true;

    const autoLogin = async () => {
      const communityId = searchParams.get("communityId");
      const encodedToken = searchParams.get("authToken");

      if (!communityId || !encodedToken) {
        setError("Missing communityId or encoded authToken in URL.");
        setLoading(false);
        return;
      }

      let authToken;
      try {
        authToken = atob(encodedToken); // Base64 decode
      } catch (e) {
        setError("Invalid encoded authToken.", e.message);
        setLoading(false);
        return;
      }

      let community;
      try {
        const res = await axios.get(
          "https://www.fretbox.in/internal/socialpoc/fretboxuser/public/accountsV5?country=IN"
        );
        const list = res.data?.data?.communities || {};
        for (const city in list) {
          const match = list[city]?.find(
            (item) => item.customer_id === communityId
          );
          if (match) community = match;
        }
        if (!community)
          throw new Error(`Community not found for ID: ${communityId}`);
        console.log("✅ Community found:", community);
      } catch (err) {
        setError(`Failed to fetch community list: ${err.message}`);
        setLoading(false);
        return;
      }

      const apiUrl = community.api_url;
      let user;
      try {
        const res = await axios.get(`${apiUrl}oauthUser`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        user = res.data?.data;
        if (!user) throw new Error("Invalid user response");
        console.log("✅ User fetched:", user);
      } catch (err) {
        const apiMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message;

        setError(` ${apiMessage}`);
        setLoading(false);
        return;
      }

      const { name: fullName, email, role_name: role } = user;
      const password = "123456"; // dummy password used for unified login

      try {
        const res = await axios.post(`${Baseurl}/api/v1/user/login-new`, {
          fullName,
          email,
          password,
          communityId,
          role,
        });

        const userData = res.data;
        console.log("🎉 Unified Login Success:", userData);

        loginByPayload(userData);

        navigate("/");
      } catch (err) {
        console.error("LoginNew API error:", err);
        const message =
          err?.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        setError(`Auto-login failed: ${message}`);
        setLoading(false);
      }
    };

    autoLogin();
  }, [navigate, searchParams, loginByPayload]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-red-600 text-center px-4">
      <h2 className="text-xl font-bold mb-2">❌ Login Failed</h2>
      <p className="text-sm max-w-md whitespace-pre-wrap">{error}</p>
    </div>
  );
}

export default AutoLogin;
