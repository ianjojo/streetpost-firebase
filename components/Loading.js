import React from "react";

export default function Loading() {
  return (
    <div className='w-full space-y-6 py-8'>
      {/* Skeleton Cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className='glass-magical p-6 rounded-[24px] animate-pulse relative overflow-hidden'>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          <div className='flex gap-4'>
            {/* Avatar Skeleton */}
            <div className='h-12 w-12 rounded-full bg-gray-700/50'></div>

            <div className='flex-1 space-y-3'>
              {/* Header Skeleton */}
              <div className='flex items-center gap-3'>
                <div className='h-4 w-32 bg-gray-700/50 rounded'></div>
                <div className='h-3 w-24 bg-gray-700/30 rounded'></div>
              </div>

              {/* Content Skeleton */}
              <div className='space-y-2'>
                <div className='h-3 w-full bg-gray-700/50 rounded'></div>
                <div className='h-3 w-4/5 bg-gray-700/40 rounded'></div>
                <div className='h-3 w-3/5 bg-gray-700/30 rounded'></div>
              </div>

              {/* Image Skeleton */}
              <div className='h-48 w-full bg-gray-700/30 rounded-xl'></div>

              {/* Actions Skeleton */}
              <div className='flex items-center justify-between pt-3 border-t border-gray-700/30'>
                <div className='flex gap-4'>
                  <div className='h-8 w-20 bg-gray-700/30 rounded-lg'></div>
                </div>
                <div className='flex gap-4'>
                  <div className='h-8 w-8 bg-gray-700/30 rounded-lg'></div>
                  <div className='h-8 w-8 bg-gray-700/30 rounded-lg'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Loading Text */}
      <div className='text-center'>
        <p className='text-gray-400 text-sm'>Loading nearby posts...</p>
      </div>
    </div>
  );
}
