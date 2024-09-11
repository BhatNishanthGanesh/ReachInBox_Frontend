import React from 'react';
import BasicLayout from '@/app/components/basicLayout';

const HomePage = () => {
  return (
    <div className=" max-h-screen flex flex-col items-center justify-center dark:bg-white bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-full  ">
        <BasicLayout />
      </div>
    </div>
  );
};

export default HomePage;
