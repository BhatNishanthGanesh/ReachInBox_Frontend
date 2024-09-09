import React from 'react';
import Navbar from '@/app/components/navbar'; 

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
