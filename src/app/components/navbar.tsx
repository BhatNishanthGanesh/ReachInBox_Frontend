import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      {/* Left side - Logo or Brand Name */}
      <div className="text-lg font-bold">
        Onebox
      </div>

      {/* Right side - API workspace dropdown */}
      <div className="relative">
        <button className="text-sm bg-gray-700 py-2 px-4 rounded-lg hover:bg-gray-600">
          Workspace
        </button>
        {/* Dropdown content (can be implemented with more functionality later) */}
        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg hidden">
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">Workspace 1</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">Workspace 2</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">Workspace 3</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
