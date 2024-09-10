"use client"
import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const Dashboard = () => {
  // Use the useSearchParams hook to access query parameters
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  

  return (
    <div className="flex flex-col items-center justify-center mt-20 bg-black dark:bg-white text-white p-6">
      <div className="mb-6">
        <Image
          src="/assets/emptyMail.png"
          height={300} 
          width={300} 
          alt="empty"
          className="object-contain"
        />
      </div>
      <div className="text-center">
        <h1 className="text-3xl dark:text-black font-bold mb-2">
          It’s the beginning of a legendary sales pipeline
        </h1>
        <h3 className="text-xl dark:text-black">
          When you have inbound e-mails, you’ll see them here
        </h3>
        {/* {token ? (
          <p className="mt-4">Access Token: <span className="font-bold">{token}</span></p>
        ) : (
          <p className="mt-4">Access Token not available</p>
        )} */}

      </div>
    </div>
  );
};

export default Dashboard;
