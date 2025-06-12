import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore"; // Import auth store
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuthStore(); // Signup function

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    communityId: "",
  });

  // Filter admins & super admins

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Signup Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.communityId
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        communityId: formData.communityId,
      });

      if (response) {
        navigate("/login"); // ✅ Sirf success hone par redirect karo
      }
    } catch (error) {
      console.error("Signup failed:", error);
      // ❌ Error hone par redirect nahi hoga
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold">
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          FRETBOX
        </a>
        <div className="w-full bg-white rounded-lg shadow border sm:max-w-md">
          <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold text-gray-900">
              Register a new account
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full p-2.5 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="youremail@gmail.com"
                  className="w-full p-2.5 border rounded-lg"
                  required
                />
              </div>
               <div>
                <label className="block text-sm font-medium">CommunityId</label>
                <input
                  type="text"
                  name="communityId"
                  value={formData.communityId}
                  onChange={handleChange}
                  placeholder="F2500"
                  className="w-full p-2.5 border rounded-lg"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full p-2.5 border rounded-lg"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 top-6 flex items-center text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>

              {/* Role Selection */}

              <button
                type="submit"
                className="w-full bg-gray-900 text-white p-2.5 rounded-lg"
              >
                Sign Up
              </button>
              <p className="text-sm font-light text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
