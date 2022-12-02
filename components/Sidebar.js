import Image from "next/legacy/image";
import React from "react";
import SidebarLink from "./SidebarLink";
import { HomeIcon } from "@heroicons/react/24/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
export default function Sidebar() {
  const { data: session } = useSession();
  return (
    <div className='hidden sm:flex flex-col items-center xl:items-start xl:w-[280px] p-2 fixed h-full'>
      <div className='flex items-center justify-center w-34 h-24 hoverAnimation p-0  xl:ml-20'>
        <Image className='mr-4 ' src='/glyph.png' width={50} height={50} />
        <h1 className='hidden xl:inline text-white text-[30px] font-clashgrotesk'>
          Streetpost
        </h1>
      </div>
      <div className='space-y-2.5 mt-4 mb-2.5 xl:ml-20  '>
        <Link href='/'>
          <SidebarLink text='Home' Icon={HomeIcon} active />
        </Link>
        <SidebarLink text='Explore' Icon={HashtagIcon} />
        <SidebarLink text='Map' Icon={BellIcon} />
      </div>

      {/*   <button className='hidden xl:inline ml-auto bg-[#1d9bf0] text-white rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-[#1a8cd8]'>
        Tweet
      </button> */}
      <div
        className='text-[#d9d9d9] flex items-center justify-center mt-auto hoverAnimation xl:ml-auto '
        onClick={signOut}
      >
        <img
          className='h-10 w-10 rounded-full xl:mr-2.5'
          src={session.user.image}
          alt='profile pic'
          referrerPolicy='no-referrer'
        />
        <div className='hidden xl:inline leading-5'>
          <h4 className='font-bold '>{session.user.name}</h4>
          <p className='text-[#6e767d]'>(log out)</p>
        </div>
        <EllipsisHorizontalIcon className='h-5 hidden xl:inline ml-10' />
      </div>
    </div>
  );
}
