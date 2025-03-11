import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function Setting() {
  const { authUser, isUpdatingProfile, updateProfile, updateUser } =
    useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [email, setEmail] = useState(authUser?.email || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setSelectedImg(objectUrl);

    const result = await updateProfile(file);
    if (!result.success) {
      alert(result.message);
    }

    URL.revokeObjectURL(objectUrl);
  };

  const handleUpdateUser = async () => {
    const result = await updateUser({ fullName, email });
    if (result.success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="tab-content active w-full md:w-[450px] lg:w-[380px] max-w-full shadow h-screen overflow-y-hidden mb-[80px] lg:mb-0 bg-red-50 border-x-[1px] border-gray-200">
      <div className="px-6 pt-6">
        <h4 className="mb-0 text-gray-700">Settings</h4>
      </div>
      <div className="p-6 text-center border-b border-gray-100">
        <div className="relative mb-4">
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={selectedImg || authUser?.profilePic}
              className="w-24 h-24 p-1 mx-auto border border-gray-100 rounded-full"
              alt="Profile"
            />
            {isUpdatingProfile && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="profilePicInput"
            onChange={handleImageUpload}
            disabled={isUpdatingProfile}
          />
          <a
            href="#!"
            onClick={() => document.getElementById("profilePicInput").click()}
            className="absolute bottom-0 w-10 h-10 bg-gray-400 rounded-full"
          >
            <i className="leading-10 ri-pencil-fill text-16"></i>
          </a>
        </div>
        <h5 className="mb-1 text-16">
          <span>{authUser?.fullName}</span>
        </h5>
      </div>

      <div className="p-6 h-[650px] overflow-y-auto custom-scrollbar">
        <div className="text-gray-700 accordion-item border border-gray-100 rounded">
          <h2>
            <button
              type="button"
              className="flex items-center justify-between w-full px-3 py-2 font-medium text-left accordion-header group"
            >
              <span className="m-0 text-[14px] font-medium">Personal Info</span>
              <i
                className={`mdi mdi-chevron-down text-lg transition-transform duration-300 ease-in-out`}
              ></i>
            </button>
          </h2>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out`}
          >
            <div className="bg-white accordion-body p-5">
              {isEditing ? (
                <div>
                  <label className="text-gray-500 text-sm">Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                  />

                  <label className="text-gray-500 text-sm mt-4">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                  />

                  <button
                    onClick={handleUpdateUser}
                    className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 mt-4 ml-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <div className="float-right">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 bg-slate-100 border-transparent rounded hover:bg-gray-50 transition-all ease-in-out"
                    >
                      <i className="mr-1 align-middle ri-edit-fill"></i> Edit
                    </button>
                  </div>

                  <p className="mb-1 text-gray-500">Name</p>
                  <h5 className="text-sm">{authUser?.fullName}</h5>

                  <div className="mt-5">
                    <p className="mb-1 text-gray-500">Email</p>
                    <h5 className="text-sm">{authUser?.email}</h5>
                  </div>

                  <div className="mt-5">
                    <p className="mb-1 text-gray-500">Role</p>
                    <span>{authUser?.role}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
