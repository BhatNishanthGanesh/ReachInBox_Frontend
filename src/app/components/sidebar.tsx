"use client"
import React from 'react';
import { FaHome, FaUserAlt, FaCog, FaSignOutAlt } from 'react-icons/fa'; 
import { AiTwotoneHome } from "react-icons/ai";
import { RiUserSearchFill } from "react-icons/ri";
import { IoMailSharp } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaInbox } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
    const router = useRouter();

    // Function to handle logout
    const handleLogout = () => {
      // Clear authentication token (you may need to adjust this based on your implementation)
      localStorage.removeItem('token'); // or sessionStorage.removeItem('token');
  
      // Redirect to the login page
      router.push('/');
    };
    return (
      <div className="h-screen w-20 bg-gray-800 dark:bg-white text-white flex flex-col items-center">
        {/* Sidebar header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-center">
          <Image
            src="/assets/reachinbox_ai_logo.jpg" 
            alt="Onebox Logo"
            width={40} 
            height={40} 
            className="rounded-md dark:text-black"
          />
        </div>
  
        {/* Sidebar menu */}
        <nav className="flex flex-col flex-grow mt-6 dark:text-black">
          <Link href="/dashboard/home" className="p-3 hover:bg-gray-700 flex justify-center">
            <AiTwotoneHome size={24} />
          </Link>
          <Link href="/dashboard/search" className="p-3 hover:bg-gray-700 flex justify-center">
            <RiUserSearchFill size={24} />
          </Link>
          <Link href="/dashboard/message" className="p-3 hover:bg-gray-700 flex justify-center">
            <IoMailSharp size={24} />
          </Link>
          <Link href="/dashboard/send" className="p-3 hover:bg-gray-700 flex justify-center">
            <IoIosSend size={24} />
          </Link>
          <Link href="/dashboard/menu" className="p-3 hover:bg-gray-700 flex justify-center">
            <GiHamburgerMenu size={24} />
          </Link>
          <Link href="/dashboard/Email" className="p-3 hover:bg-gray-700 flex justify-center">
            <FaInbox size={24} />
          </Link>
          <Link href="/dashboard/stats" className="p-3 hover:bg-gray-700 flex justify-center">
            <IoIosStats size={24} />
          </Link>
        </nav>
  
        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-700 w-full flex justify-center">
        <button
          onClick={handleLogout}
          className="hover:text-red-500"
          aria-label="Sign out"
        >
          <FaSignOutAlt size={24} />
        </button>
      </div>
      </div>
    );
  };
  
  export default Sidebar;
