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
import { useRouter,usePathname } from 'next/navigation';

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const handleLogout = () => {
      localStorage.removeItem('token'); 
      router.push('/');
    };
    const isActive = (path:any) => pathname === path;
    
    return (
      <div className="min-h-screen w-20 bg-gray-800 shadow-lg dark:bg-white text-white flex flex-col items-center">
        {/* Sidebar header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-center">
          <Image
            src="/assets/reachinbox_ai_logo.jpg" 
            alt="Onebox Logo"
            width={40} 
            height={40} 
            className="rounded-md dark:text-black shadow-lg"
          />
        </div>
  
        {/* Sidebar menu */}
        <nav className="flex flex-col  flex-grow mt-6 dark:border-1 dark:text-black">
        <Link href="/dashboard/home" className={`p-3 m-2 flex justify-center ${isActive('/dashboard/home') ? 'bg-gray-700 dark:bg-gray-200' : 'hover:bg-gray-700 hover:dark:bg-gray-200'}`}>
          <AiTwotoneHome size={24} />
        </Link>
        <Link href="/dashboard/search" className={`p-3 m-2 flex justify-center ${isActive('/dashboard/search') ? 'bg-gray-700 dark:bg-gray-200' : 'hover:bg-gray-700 hover:dark:bg-gray-200'}`}>
          <RiUserSearchFill size={24} />
        </Link>
        <Link href="/dashboard/message" className={`p-3 m-2 flex justify-center ${isActive('/dashboard/message') ? 'bg-gray-700 dark:bg-gray-200' : 'hover:bg-gray-700 hover:dark:bg-gray-200'}`}>
          <IoMailSharp size={24} />
        </Link>
        <Link href="/dashboard/send" className={`p-3 flex m-2 justify-center ${isActive('/dashboard/send') ? 'bg-gray-700 dark:bg-gray-200' : 'hover:bg-gray-700 hover:dark:bg-gray-200'}`}>
          <IoIosSend size={24} />
        </Link>
        <Link href="/dashboard/menu" className={`p-3 flex m-2 justify-center ${isActive('/dashboard/menu') ? 'bg-gray-700 dark:bg-gray-200' : 'hover:bg-gray-700 hover:dark:bg-gray-200'}`}>
          <GiHamburgerMenu size={24} />
        </Link>
        <div className="relative">
      <Link
        href="/dashboard/Email"
        className={`p-3 flex m-2 justify-center items-center ${isActive('/dashboard/Email') ? 'bg-gray-700 dark:bg-gray-200' : 'hover:bg-gray-700 hover:dark:bg-gray-200'}`}
      >
        <FaInbox size={24} />
        <span className="absolute top-2 right-0 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full -translate-x-1/2 -translate-y-1/2">
          12+
        </span>
      </Link>
    </div>
        <Link href="/dashboard/stats" className={`p-3 flex m-2 justify-center ${isActive('/dashboard/stats') ? 'bg-gray-700 dark:bg-gray-200' : 'hover:bg-gray-700 hover:dark:bg-gray-200'}`}>
          <IoIosStats size={24} />
        </Link>
      </nav>
  
        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-700 w-full flex justify-center">
        <button
          onClick={handleLogout}
          className="hover:text-red-500 dark:text-black"
          aria-label="Sign out"
        >
          <FaSignOutAlt size={24} />
        </button>
      </div>
      </div>
    );
  };
  
  export default Sidebar;
