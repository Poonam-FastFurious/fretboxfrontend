import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    communityId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, communityId } = formData;
    await login(email, password, communityId); // ✅ Pass separate arguments
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col">
        <div
          className="fixed z-50 inset-0 flex items-center justify-center bg-gray-50 "
          aria-labelledby="modal-title"
          role="model"
          aria-modal="true"
        >
          <section className="w-full px-4 sm:max-w-lg">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-full lg:py-0">
              <a
                href="#"
                className="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
              >
                <img
                  className="w-8 h-8 mr-2"
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                  alt="logo"
                />
                FRETBOX
              </a>
              <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 ">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                    Sign in to your account
                  </h1>
                  <form
                    className="space-y-4 md:space-y-6"
                    onSubmit={handleSubmit}
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Your email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5      "
                        placeholder="name@company.com"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5       "
                          required=""
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-2 flex items-center px-2 text-sm text-gray-600 "
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye className=" text-black" />
                          ) : (
                            <EyeOff className=" text-black" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        communityId
                      </label>
                      <div className="relative">
                        <input
                          value={formData.communityId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              communityId: e.target.value,
                            })
                          }
                          type="text"
                          name="communityId"
                          id="communityId"
                          placeholder="F230041"
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5       "
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-gray-900 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      {isLoggingIn ? <>Loading...</> : "Sign in"}
                    </button>
                    <p className="text-sm font-light text-gray-00 0">
                      Don’t have an account yet?{" "}
                      <Link
                        to="/register"
                        className="font-medium text-primary-600 hover:underline "
                      >
                        Sign up
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Login;
