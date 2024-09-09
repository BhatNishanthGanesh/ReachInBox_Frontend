import React from 'react';
import Image from 'next/image';
import Login from '@/app/login/page';
import Footer from '@/app/components/footer';

export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="flex-grow items-center justify-items-center font-bold p-3">
        <Login />
      </div>
      <Footer />
    </div>
  );
}
