"use client";
import React, { useEffect } from 'react';
import { FaHome, FaUserAlt, FaCog, FaSignOutAlt, FaInbox } from 'react-icons/fa'; 
import { AiTwotoneHome } from "react-icons/ai";
import { RiUserSearchFill } from "react-icons/ri";
import { IoMailSharp } from "react-icons/io5";
import { IoIosSend, IoIosStats  } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Extract token from URL and store it
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        
        if (tokenFromUrl) {
            console.log('Token extracted from URL:', tokenFromUrl);
            localStorage.setItem('token', tokenFromUrl);
        }
    }, []);

    const handleLogout = async () => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (token) {
            try {
                // Send request to logout endpoint
                const response = await fetch('https://hiring.reachinbox.xyz/api/v1/onebox/reset', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    console.log('Logout successful');
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }

            // Remove token from localStorage
            localStorage.removeItem('token');
        }

        // Redirect to home page
        router.push('/');
    };

    const isActive = (path: string) => pathname === path;
    
    const linkClassName = (path: string) => 
        `p-3 m-2 flex justify-center ${isActive(path) ? 'bg-gray-700 dark:bg-gray-200' : 'hover:bg-gray-700 hover:dark:bg-gray-200'}`;

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
            <nav className="flex flex-col flex-grow mt-6 dark:border-1 dark:text-black">
                <Link href="/dashboard/home" className={linkClassName('/dashboard/home')}>
                    <AiTwotoneHome size={24} />
                </Link>
                <Link href="/dashboard/search" className={linkClassName('/dashboard/search')}>
                    <RiUserSearchFill size={24} />
                </Link>
                <Link href="/dashboard/message" className={linkClassName('/dashboard/message')}>
                    <IoMailSharp size={24} />
                </Link>
                <Link href="/dashboard/send" className={linkClassName('/dashboard/send')}>
                    <IoIosSend size={24} />
                </Link>
                <Link href="/dashboard/menu" className={linkClassName('/dashboard/menu')}>
                    <GiHamburgerMenu size={24} />
                </Link>
                <div className="relative">
                    <Link href="/dashboard/Email" className={linkClassName('/dashboard/Email')}>
                        <FaInbox size={24} />
                        <span className="absolute top-1 right-0 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full -translate-x-1/2 -translate-y-1/2">
                            12+
                        </span>
                    </Link>
                </div>
                <Link href="/dashboard/stats" className={linkClassName('/dashboard/stats')}>
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
