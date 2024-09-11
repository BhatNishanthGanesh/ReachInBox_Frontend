"use client"
import React, { useState } from 'react';
import { ModeToggle } from './modeToggle';
import { FaChevronDown } from 'react-icons/fa'; // Import the dropdown icon

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="flex items-center justify-between border-b-2 p-4 bg-gray-800 shadow-lg dark:bg-white  dark:text-black text-white">
      {/* Left side - Logo or Brand Name */}
      <div className="text-lg font-bold">
        Onebox
      </div>

      {/* Right side - ModeToggle and Dropdown */}
      <div className="flex items-center space-x-4 relative">
        <ModeToggle />
        <button
          className="text-sm dark:text-white bg-gray-700 py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center space-x-2"
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
        >
          <span>Workspace</span>
          <FaChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {/* Dropdown content */}
        <div
          className={`absolute right-0 mt-2 w-48 bg-white text-gray-800 dark:bg-gray-800 dark:text-white rounded-lg shadow-lg transition-opacity duration-300 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
          {/* <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Workspace 1</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Workspace 2</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Workspace 3</a> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
