import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const menuItems = [
  { icon: "ri-user-2-line", label: "Profile" },
  { icon: "ri-message-3-line", label: "Chats" },
  { icon: "ri-group-line", label: "Groups" },
  { icon: "ri-contacts-line", label: "Contacts" },
  { icon: "ri-settings-2-line", label: "Settings" },
];
function Aside() {
  const { activeTab, logout, setActiveTab, authUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".profile-dropdown")) {
        setIsOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (!authUser) {
      navigate("/login"); // Agar authUser null ho, toh login page par redirect karo
    }
  }, [authUser, navigate]);

  const handleLogout = async () => {
    await logout();
  };
  return (
    <>
      <div className="sidebar-menu  w-full lg:w-[75px] shadow lg:flex lg:flex-col flex flex-row justify-between items-center fixed lg:relative z-40 bottom-0 bg-[#f9fafb]">
        {/* Logo */}
        <div className="hidden lg:my-5 lg:block">
          <Link to="/" className="block">
            <img
              src="https://www.fretbox.in/assets/img/fretbox_logo.png"
              alt="Logo"
              className="h-[30px]"
            />
          </Link>
        </div>

        {/* Sidebar Menu */}
        <div className="w-full mx-auto lg:my-auto">
          <ul className="flex flex-row justify-center w-full lg:flex-col">
            {menuItems.map((item, index) => (
              <li key={index} className="flex-grow lg:flex-grow-0">
                <button
                  onClick={() => setActiveTab(item.label)}
                  className={`tab-button flex relative items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg ${
                    activeTab === item.label ? "bg-gray-200" : ""
                  }`}
                >
                  <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                    <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                    <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                      {item.label}
                    </span>
                  </div>
                  <i className={`text-2xl ${item.icon}`}></i>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile Dropdown - Fixed Position */}
        <div className="w-20 my-5 lg:w-auto profile-dropdown relative">
          <ul className="lg:block">
            <li className="relative lg:mt-4">
              <button
                className="focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              >
                <img
                  src={authUser?.profilePic}
                  alt="Profile"
                  className="w-10 h-10 p-1 mx-auto rounded-full bg-gray-50"
                />
              </button>
              <ul
                className={`absolute -left-32 sm:left-0 z-40 ${
                  isOpen ? "block" : "hidden"
                } bottom-full mb-2 w-40 py-2 mx-4 text-left list-none bg-white border border-gray-200 rounded-lg shadow-lg bg-clip-padding`}
              >
                <li>
                  <Link
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/30"
                    to="#"
                    onClick={() => setActiveTab("Profile")}
                  >
                    Profile{" "}
                    <i className="ri-profile-line float-right text-gray-500"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/30"
                    to="#"
                    onClick={() => setActiveTab("Settings")}
                  >
                    Setting{" "}
                    <i className="ri-settings-3-line float-right text-gray-500"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/30"
                    to="#"
                    onClick={handleLogout}
                  >
                    Log out{" "}
                    <i className="ri-logout-circle-r-line float-right text-gray-500"></i>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Aside;
