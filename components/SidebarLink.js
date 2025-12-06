import Link from "next/link";
import React from "react";

export default function SidebarLink({ Icon, text, active }) {
  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${active
          ? 'bg-gradient-to-r from-pink-500/10 to-purple-600/10 text-white'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
      <Icon className={`h-6 w-6 ${active ? 'text-pink-400' : 'group-hover:text-pink-400 transition-colors'}`} />
      <span className='hidden xl:inline font-medium text-base'>{text}</span>

      {active && (
        <div className='hidden xl:block ml-auto w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full'></div>
      )}
    </div>
  );
}
