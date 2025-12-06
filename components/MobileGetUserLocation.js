import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { locationState } from "../atoms/modalAtom";
import { MapPinIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

function MobileGetUserLocation({ getUserLocation }) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useRecoilState(locationState);

  const regetUserLocation = () => {
    const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      let trimLat = latitude.toFixed(4);
      let trimLong = longitude.toFixed(4);
      setLocation([trimLat, trimLong]);
      setLoading(false);
    };
    const error = () => {
      console.log("Unable to retrieve your location");
      setLoading(false);
    };
    setLoading(true);
    navigator.geolocation.getCurrentPosition(success, error);
  };

  return (
    <div className='flex items-center sm:hidden'>
      {!location.length ? (
        <button
          className='p-2 rounded-lg hover:bg-pink-500/10 transition-colors'
          onClick={getUserLocation}
        >
          <MapPinIcon className='h-5 w-5 text-gray-400 hover:text-pink-400 transition-colors' />
        </button>
      ) : (
        <button
          className='p-2 rounded-lg hover:bg-pink-500/10 transition-colors'
          onClick={regetUserLocation}
        >
          <ArrowPathIcon className={`h-5 w-5 text-pink-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}

export default MobileGetUserLocation;
