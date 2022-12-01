import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { locationState } from "../atoms/modalAtom";

function GetUserLocation({}) {
  const [loading, setLoading] = useState(false);
  const getUserLocation = () => {
    const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      let trimLat = latitude.toFixed(4);
      let trimLong = longitude.toFixed(4);

      let numLat = Number(trimLat);
      let numLng = Number(trimLong);

      setLocation([trimLat, trimLong]);
      setLoading(false);
    };
    const error = () => {
      console.log("Unable to retrieve your location");
    };
    setLoading(true);
    console.log("gettng location");
    navigator.geolocation.getCurrentPosition(success, error);
  };
  const regetUserLocation = () => {
    const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      let trimLat = latitude.toFixed(4);
      let trimLong = longitude.toFixed(4);

      let numLat = Number(trimLat);
      let numLng = Number(trimLong);

      setLocation([trimLat, trimLong]);
      setLoading(false);
    };
    const error = () => {
      console.log("Unable to retrieve your location");
    };
    setLocation([]);
    setLoading(true);
    console.log("gettng location");
    navigator.geolocation.getCurrentPosition(success, error);
  };
  const [location, setLocation] = useRecoilState(locationState);
  return (
    <div className='flex  h-full z-50 hidden sm:inline'>
      {!location.length ? (
        <button className='text-white text-sm' onClick={getUserLocation}>
          {loading ? "loading..." : "Get Location"}
        </button>
      ) : (
        <div
          className='flex items-center h-full z-100 pr-4'
          onClick={regetUserLocation}
        >
          <span className='text-white text-[10px] font-bold pr-4 '>
            your location:{"   "}
          </span>
          <span className='text-white text-[10px] '>{` ${location[0]}, ${location[1]}`}</span>
          <span className='text-white text-[10px] font-bold ml-2 '>
            refresh
          </span>
        </div>
      )}
    </div>
  );
}

export default GetUserLocation;
