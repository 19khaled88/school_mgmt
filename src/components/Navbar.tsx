'use client'
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  const { user, isLoaded } = useUser();


  // get role from user's public metadata 
  const role = user?.publicMetadata?.role as string;

  // show loading state while clerk is loading
  if (!isLoaded) {
    return (
      <div className='mt-4 text-sm'>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2">
            <div className="animate-pulse bg-gray-200 rounded-md w-5 h-5"></div>
            <span className="hidden lg:block bg-gray-200 rounded h-4 w-20 animate-pulse"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR*/}
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 py-2'>
        <Image src="/search.png" alt='' width={20} height={20} />
        <input type='text' placeholder='Search....' className='w-[200px] p-2 bg-transparent outline-none' />
      </div>
      {/*ICONS AND USER*/}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <Image src="/message.png" alt='' width={30} height={30} />
        </div>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
          <Image src="/announcement.png" alt='' width={30} height={30} />
          <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs'>3</div>
        </div>
        <div className='flex flex-col'>
          <span className='text-xs leading-3 font-medium'>Khaled Ahasan</span>
          <span className='text-[10px] text-gray-500 tex-right'>{role}</span>
        </div>
        {/* <Image src="/avatar.png" alt='' width={40} height={40} className='rounded-full'/> */}
        <UserButton />
      </div>
    </div>
  )
}

export default Navbar
