import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

export default function SidebarLink({ Icon, text, active }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden ${active
          ? "text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          : "text-gray-400 hover:text-white"
        }`}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-2xl border border-pink-500/30"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}

      <div className="relative z-10 flex items-center gap-4">
        <Icon className={`h-7 w-7 ${active ? "text-pink-400 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]" : "group-hover:text-pink-400 transition-colors"}`} />
        <span className="hidden xl:inline font-medium text-lg tracking-wide">{text}</span>
      </div>

      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="hidden xl:block absolute right-3 w-1.5 h-1.5 bg-pink-400 rounded-full shadow-[0_0_10px_#ec4899]"
        />
      )}
    </motion.div>
  );
}
