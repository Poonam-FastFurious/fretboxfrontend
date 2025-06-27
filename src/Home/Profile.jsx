import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function Profile() {
  const { logout, authUser, setActiveTab } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    if (!authUser) {
      navigate("/login"); // Agar authUser null ho, toh login page par redirect karo
    }
  }, [authUser, navigate]);

  const handleLogout = async () => {
    await logout();
    setActiveTab("Chats");
  };
  return (
    <>
      <div className="tab-content active w-full md:w-[450px] lg:w-[380px] max-w-full shadow h-screen overflow-y-hidden mb-[80px] lg:mb-0 bg-red-50 border-x-[1px] border-gray-200">
        <div>
          <div className="px-6 pt-6">
            <div className="float-left">
              <div className="relative flex-shrink-0 dropdown">
                <button
                  className="p-0 text-gray-400 border-0 btn dropdown-toggle"
                  data-bs-toggle="dropdown"
                  id="dropdownMenuButtonA"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <i className="text-lg ri-more-2-fill"></i>
                </button>
                {isDropdownOpen && (
                  <ul className="absolute z-50 block w-40 py-2 text-left list-none bg-white border border-transparent rounded shadow-lg rtl:right-auto rtl:left-0 ltr:left-auto ltr:right-0 my-7 dropdown-menu">
                    <li>
                      <Link
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/50"
                        to="#"
                        onClick={() => setActiveTab("Settings")}
                      >
                        Edit Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/50"
                        to="#"
                        onClick={handleLogout}
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <h4 className="mb-0 text-gray-700">My Profile</h4>
          </div>

          <>
            <div className="p-6 text-center border-b border-gray-100">
              <div className="mb-4">
                <img
                  src={authUser?.profilePic}
                  className="w-24 h-24 p-1 mx-auto border border-gray-100 rounded-full"
                  alt="Profile"
                />
              </div>

              <h5 className="mb-1 text-16">{authUser?.fullName}</h5>

              <h5 className="mb-0 truncate text-14 ltr:block rtl:hidden">
                <span className="text-gray-500">
                  <i className="text-green-500 ltr:ml-1 rtl:mr-1 ri-record-circle-fill text-10 "></i>
                  {authUser?.role}
                </span>
              </h5>
            </div>

            <div className="p-6 h-[550px]" data-simplebar="">
              <p className="mb-6 text-gray-500">
                Welcome to your profile! Here you can see and manage your
                personal details.
              </p>

              <div data-tw-accordion="collapse">
                <div className="text-gray-700 accordion-item">
                  <h2>
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-3 py-2 font-medium text-left border border-gray-100 rounded-t accordion-header group active"
                    >
                      <span className="m-0 text-[14px] font-semibold">
                        <i className="mr-2 align-middle ri-user-2-line d-inline-block"></i>
                        About
                      </span>
                      <i className="mdi mdi-chevron-down text-lg group-[.active]:rotate-180"></i>
                    </button>
                  </h2>

                  <div className="block bg-white border border-t-0 border-gray-100 accordion-body">
                    <div className="p-5">
                      <div>
                        <p className="mb-1 text-gray-500">Name</p>
                        <h5 className="text-sm">{authUser?.fullName}</h5>
                      </div>
                      <div className="mt-5">
                        <p className="mb-1 text-gray-500">Email</p>
                        <h5 className="text-sm">{authUser?.email}</h5>
                      </div>
                      <div className="mt-5">
                        <p className="mb-1 text-gray-500">Role</p>
                        <h5 className="text-sm">{authUser?.role}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
}

export default Profile;
