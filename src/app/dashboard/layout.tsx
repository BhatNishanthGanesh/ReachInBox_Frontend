import React from 'react';
import Navbar from '@/app/components/navbar';
import Sidebar from '@/app/components/sidebar';
import ChatBotButton from '../components/chatbot';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-black dark:bg-white dark:text-black">
      {/* Sidebar should take priority */}
      <Sidebar />

      {/* Main content wrapper */}
      <div className="flex-grow flex flex-col">
        {/* Navbar inside main content, but below sidebar */}
        <Navbar />

        {/* Main content area */}
        <main>
          {children}
          <ChatBotButton/>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
