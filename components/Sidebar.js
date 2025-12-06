import Image from "next/legacy/image";
import React from "react";
import SidebarLink from "./SidebarLink";
import { HomeIcon } from "@heroicons/react/24/solid";
import {
  HashtagIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className='hidden sm:flex flex-col items-center xl:items-start xl:w-[280px] p-4 fixed h-full'>
      {/* Logo Section with Ambient Glow */}
      <div className='flex items-center justify-center xl:justify-start w-full mb-8 group'>
        <div className='relative'>
          {/* Glow Effect */}
          <div className='absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500'></div>

          {/* Logo */}
          <div className='relative flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer'>
            <Image
              className='relative z-10'
              src='/glyph.png'
              width={40}
              height={40}
              alt="Streetpost logo"
            />
            <h1 className='hidden xl:inline text-white text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              Streetpost
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className='flex flex-col gap-2 w-full mb-auto'>
        <Link href='/'>
          <SidebarLink text='Home' Icon={HomeIcon} active={true} />
        </Link>
        <Link href='/explore'>
          <SidebarLink text='Explore' Icon={HashtagIcon} />
        </Link>

        {/* Auth Link */}
        {session ? (
          <div onClick={signOut} className='cursor-pointer'>
            <SidebarLink text='Sign out' Icon={ArrowRightOnRectangleIcon} />
          </div>
        ) : (
          <div onClick={() => signIn()} className='cursor-pointer'>
            <SidebarLink text='Sign in' Icon={UserIcon} />
          </div>
        )}
      </nav>

      {/* User Profile Card - Floating at Bottom */}
      {session && (
        <div
          className='w-full mt-auto glass-panel p-4 rounded-2xl cursor-pointer hover:bg-white/5 transition-all duration-300 group'
          onClick={signOut}
        >
          <div className='flex items-center gap-3'>
            {/* Avatar with Ring */}
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300'></div>
              <img
                className='relative h-10 w-10 rounded-full ring-2 ring-white/10 group-hover:ring-pink-500/50 transition-all'
                src={session.user.image}
                alt='profile pic'
                referrerPolicy='no-referrer'
              />
            </div>

            {/* User Info */}
            <div className='hidden xl:flex flex-col flex-1 min-w-0'>
              <h4 className='font-semibold text-white text-sm truncate'>
                {session.user.name}
              </h4>
              <p className='text-gray-400 text-xs group-hover:text-pink-400 transition-colors'>
                Click to sign out
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sign In CTA (when not logged in) */}
      {!session && (
        <button
          onClick={() => signIn()}
          className='w-full mt-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-2xl hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105'
        >
          <span className='hidden xl:inline'>Sign in</span>
          <UserIcon className='h-6 w-6 xl:hidden mx-auto' />
        </button>
      )}
    </div>
  );
}
