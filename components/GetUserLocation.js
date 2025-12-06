import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { locationState } from "../atoms/modalAtom";
import { MapPinIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

function GetUserLocation({ getUserLocation }) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useRecoilState(locationState);

  const handleGetLocation = () => {
    setLoading(true);
    getUserLocation();
    // Set loading to false after a delay since we don't have a callback
    setTimeout(() => setLoading(false), 1000);
  };

  const regetUserLocation = () => {
    setLoading(true);
    getUserLocation();
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className='hidden sm:flex items-center h-full z-50'>
      {!location.length ? (
        <button
          className='glass-light px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2'
          onClick={handleGetLocation}
        >
          <MapPinIcon className='h-4 w-4' />
          {loading ? "Getting location..." : "Get Location"}
        </button>
      ) : (
        <div
          className='glass-light px-4 py-2 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all duration-200 group'
          onClick={regetUserLocation}
        >
          <MapPinIcon className='h-4 w-4 text-pink-400' />
          <div className='flex flex-col'>
            <span className='text-xs text-gray-400'>Your Location</span>
            <span className='text-xs font-mono text-white'>{location[0]}, {location[1]}</span>
          </div>
          <ArrowPathIcon className={`h-4 w-4 text-gray-400 group-hover:text-pink-400 transition-colors ${loading ? 'animate-spin' : ''}`} />
        </div>
      )}
    </div>
  );
}

export default GetUserLocation;

