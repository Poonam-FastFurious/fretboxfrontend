import { SquarePlus } from "lucide-react";
import React from "react";

function Header() {
  return (
    <>
      <div className="px-6 pt-6 bg-white z-10">
        <div className="w-full flex justify-between items-center mx-auto">
          <h4 className="mb-0 text-gray-700">Group</h4>
          <button>
            <SquarePlus />
          </button>
        </div>

        {/* Search Bar */}
        <div className="py-1 mt-5 mb-5 bg-gray-100 flex items-center rounded-lg">
          <span className="bg-gray-100 pe-1 ps-3">
            <i className="text-lg text-gray-400 ri-search-line"></i>
          </span>
          <input
            type="text"
            className="border-0 bg-gray-100 placeholder:text-[14px] focus:ring-0 focus:outline-none placeholder:text-gray-400 flex-grow px-2"
            placeholder="Search groups"
          />
        </div>
      </div>
    </>
  );
}

export default Header;
