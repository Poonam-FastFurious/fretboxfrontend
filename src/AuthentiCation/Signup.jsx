import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore"; // Import auth store
import { useChatStore } from "../store/useChatStore"; // Import chat store
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuthStore(); // Signup function
  const { fetchUsers, userList } = useChatStore(); // Fetch users for admin/super admin

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("User");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    admin: "",
    superAdmin: "",
  });

  useEffect(() => {
    fetchUsers(); // Fetch users when component mounts
  }, []);

  // Filter admins & super admins
  const admins = userList.filter((user) => user.role === "Admin");
  const superAdmins = userList.filter((user) => user.role === "SuperAdmin");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Signup Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (!formData.fullName || !formData.email || !formData.password) {
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
        role: selectedRole,
        admin: selectedRole === "User" ? formData.admin : null,
        superAdmin: selectedRole === "Admin" ? formData.superAdmin : null,
      });

      if (response) {
        fetchUsers(); // ✅ Successful signup ke baad user list update karo
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
              <div>
                <label className="block text-sm font-medium">Role</label>
                <div className="flex gap-4">
                  {["User", "Admin", "SuperAdmin"].map((role) => (
                    <label key={role} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={selectedRole === role}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Admin Dropdown (Only for Users) */}
              {selectedRole === "User" && (
                <div>
                  <label className="block text-sm font-medium">
                    Select Admin
                  </label>
                  <select
                    name="admin"
                    value={formData.admin}
                    onChange={handleChange}
                    className="w-full p-2.5 border rounded-lg"
                    required
                  >
                    <option value="">Select Admin</option>
                    {admins.map((admin) => (
                      <option key={admin._id} value={admin._id}>
                        {admin.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Super Admin Dropdown (Only for Admins) */}
              {selectedRole === "Admin" && (
                <div>
                  <label className="block text-sm font-medium">
                    Select Super Admin
                  </label>
                  <select
                    name="superAdmin"
                    value={formData.superAdmin}
                    onChange={handleChange}
                    className="w-full p-2.5 border rounded-lg"
                    required
                  >
                    <option value="">Select Super Admin</option>
                    {superAdmins.map((superAdmin) => (
                      <option key={superAdmin._id} value={superAdmin._id}>
                        {superAdmin.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
