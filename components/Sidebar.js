import Image from "next/image";
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
import { motion } from "framer-motion";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className='hidden sm:flex flex-col items-end xl:items-start fixed h-full xl:w-[320px]'>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
        className="glass-magical m-4 h-[calc(100vh-32px)] w-[80px] xl:w-[280px] rounded-[32px] flex flex-col items-center xl:items-stretch py-8 xl:px-6 relative overflow-hidden"
      >
        {/* Ambient top glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />

        {/* Logo Section */}
        <div className='flex items-center justify-center xl:justify-start w-full mb-10 relative z-10'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='relative group cursor-pointer'
          >
            <div className='absolute inset-0 bg-pink-500/30 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500' />
            <div className="relative flex items-center gap-4">
              <div className="relative w-12 h-12">
                <Image
                  src='/glyph.png'
                  layout="fill"
                  objectFit="contain"
                  alt="Streetpost logo"
                  className="drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                />
              </div>
              <h1 className='hidden xl:block text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent drop-shadow-sm'>
                Streetpost
              </h1>
            </div>
          </motion.div>
        </div>

        {/* Navigation Links */}
        <nav className='flex flex-col gap-3 w-full mb-auto relative z-10 px-2 xl:px-0'>
          <Link href='/' passHref>
            <SidebarLink text='Home' Icon={HomeIcon} active={true} />
          </Link>
          <Link href='/explore' passHref>
            <SidebarLink text='Explore' Icon={HashtagIcon} />
          </Link>

          {/* Auth Link - Desktop Only */}
          {session ? (
            <div onClick={signOut}>
              <SidebarLink text='Sign out' Icon={ArrowRightOnRectangleIcon} />
            </div>
          ) : (
            <div onClick={() => signIn()}>
              <SidebarLink text='Sign in' Icon={UserIcon} />
            </div>
          )}
        </nav>

        {/* User Profile Card */}
        {session && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className='relative z-10 mt-auto w-full group'
            onClick={signOut}
          >
            <div className='glass-light p-3 xl:p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-pink-500/30 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]'>
              <div className='flex items-center justify-center xl:justify-start gap-4'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-70 transition-opacity duration-300' />
                  <img
                    className='relative h-10 w-10 rounded-full ring-2 ring-white/10 group-hover:ring-pink-400 transition-all object-cover'
                    src={session.user.image}
                    alt=''
                    referrerPolicy='no-referrer'
                  />
                </div>
                <div className='hidden xl:block min-w-0'>
                  <h4 className='font-bold text-white text-sm truncate leading-tight'>
                    {session.user.name}
                  </h4>
                  <p className='text-pink-200/60 text-xs mt-0.5 truncate group-hover:text-pink-300 transition-colors'>
                    @{session.user.tag || session.user.name.split(" ")[0].toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sign In CTA */}
        {!session && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn()}
            className='relative z-10 mt-auto w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-purple-900/40 hover:shadow-pink-500/25 transition-all duration-300'
          >
            <span className='hidden xl:inline tracking-wide'>Connect Wallet</span>
            <UserIcon className='h-6 w-6 xl:hidden mx-auto' />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
