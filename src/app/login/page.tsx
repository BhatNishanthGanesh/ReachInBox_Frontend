"use client"
import React from 'react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

const Page = () => {
  const googleLoginBaseUrl = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_BASE_URL;
  const googleLoginUrl = `${googleLoginBaseUrl}?redirect_to=http://localhost:3000/dashboard`;

  return (
    <div>
      <div className='flex items-center justify-center'>
        <Image src='/assets/ReachInBox-logo.png' alt='logo' height={300} width={300} />
      </div>
      <hr className='border-slate-900 my-4' />
      <div className='flex items-center justify-center mt-40'>
        <div className='bg-[#4444] border-gray-700 border-2 p-10 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center justify-center'>
          <h2 className='text-1xl font-bold mb-4 text-white text-center'>Create a new account</h2>
          <button 
            onClick={() => window.location.href = googleLoginUrl}
            className='w-full py-2 px-4 flex items-center justify-center bg-[#2222] border border-gray-700 text-sm text-gray-400 font-semibold rounded-lg shadow-sm hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300'>
            <FcGoogle className='mr-2' size={20} />
            Sign Up with Google
          </button>
          <button className='w-1/2 py-2 text-sm mt-8 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900/40 focus:outline-none focus:ring-2 focus:ring-gray-600' style={{ background: 'linear-gradient(90deg, #004ff9, #000099)' }}>
            Create an Account
          </button>
          <p className='mt-5 text-center text-sm text-slate-500'>
            Already have an account?{' '}
            <a href='/sign-in' className='text-gray-500 hover:underline'>
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
