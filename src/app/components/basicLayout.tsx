import React from 'react'
import Image from 'next/image'
const basicLayout = () => {
  return (
    <div>
       <div className="flex flex-col items-center justify-center min-h-screen dark:bg-white text-white p-6">
      <div>
        <Image
          src="/assets/gg.svg"
          height={500} 
          width={500} 
          alt="empty"
          className="w-[100px] h-[100px] sm:w-[100px] sm:h-[100px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] object-contain"
        />
      </div>
      <div className="dark:text-black flex flex-col items-center text-center space-y-2">
        <div className="text-xl md:text-2xl lg:text-3xl font-bold">
          It’s the beginning of a legendary sales pipeline
        </div>
        <div className="text-sm md:text-base lg:text-lg">
          When you have inbound E-mails you’ll see them here
        </div>
      </div>
    </div>
    </div>
  )
}

export default basicLayout
