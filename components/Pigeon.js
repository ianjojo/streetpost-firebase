import React, { useEffect, useState } from "react";
import { Map, Overlay, Marker } from "pigeon-maps";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { locationState } from "../atoms/modalAtom";
import Marker2 from "./Marker2";
import { useRouter } from "next/router";
export default function Pigeon({ notes, posts, id, key }) {
  let mapId = "4fb841be-1983-4093-b576-32caf8d3b89e";
  const router = useRouter();

  const [location, setLocation] = useRecoilState(locationState);

  useEffect(() => {
    let currentLatLng = [Number(location[0]), Number(location[1])];
  }, [location]);
  /*   const onMarkerClick = (props, marker, e) => {}; */

  let allMarkers = "";

  let displayMarkers = (notes) => {
    return notes?.map((post, index) => {
      return (
        /*  <Marker
          height={30}
          width={30}
          anchor={[Number(note.lat), Number(note.long)]}
          onClick={onMarkerClick}
        /> */
        <span key={post.id} id={post.id} post={post.data()} />
      );
    });
  };

  allMarkers = notes?.map((post, index) => {
    return (
      /*  <Marker
          height={30}
          width={30}
          anchor={[Number(note.lat), Number(note.long)]}
          onClick={onMarkerClick}
        /> */

      <Marker2 key={post.id} id={post.id} post={post.data()} />
    );
  });
  //   allMarkers = displayMarkers(notes);

  useEffect(() => {
    allMarkers = displayMarkers(notes);
  }, [notes]);

  let currentLatLng = [Number(location[0]), Number(location[1])];
  const mapTilerProvider = (x, y, z, dpr) => {
    return `https://api.maptiler.com/maps/jp-mierune-dark/${z}/${x}/${y}.png?key=AodQuZmi32MyjzguIUO1`;
  };
  return (
    <div className='w-full h-full'>
      <div className='h-full w-full rounded-2xl overflow-hidden relative'>
        {location.length > 0 ? (
          <Map
            provider={mapTilerProvider}
            center={currentLatLng}
            defaultZoom={16}
            minZoom={12}
            maxZoom={18}
            mouseEvents={true}
          >
            {/* User Location Marker */}
            <Overlay anchor={currentLatLng} offset={[25, 25]}>
              <div className='relative'>
                {/* Pulsing Ring */}
                <div className='absolute inset-0 animate-ping'>
                  <div className='w-12 h-12 rounded-full bg-pink-500/30'></div>
                </div>
                {/* Location Pin */}
                <img
                  style={{ height: "50px", width: "50px" }}
                  src='/location.png'
                  alt=''
                  className='relative z-10'
                />
              </div>
            </Overlay>

            {/* Post Markers */}
            {allMarkers.map((marker) => (
              <Overlay
                key={marker.key}
                anchor={[
                  Number(marker.props.post.lat),
                  Number(marker.props.post.long),
                ]}
                className='group relative'
              >
                <div
                  className='cursor-pointer hover:scale-110 transition-transform duration-200'
                  onClick={() => router.push(`${marker.key}`)}
                >
                  {/* Enhanced Marker Icon with Animation */}
                  <div className='relative'>
                    {/* Pulsing background */}
                    <div className='absolute inset-0 animate-pulse'>
                      <div className='w-10 h-10 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20'></div>
                    </div>

                    {/* Main Icon */}
                    <svg className='w-10 h-10 drop-shadow-xl relative z-10' viewBox='0 0 24 24' fill='none'>
                      <circle cx='12' cy='12' r='10' fill='url(#markerGradient)' stroke='white' strokeWidth='1.5' />
                      <path d='M12 8v8M8 12h8' stroke='white' strokeWidth='2' strokeLinecap='round' />
                      <defs>
                        <linearGradient id='markerGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                          <stop offset='0%' stopColor='#ec4899' />
                          <stop offset='100%' stopColor='#a855f7' />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Hover Preview Card */}
                <div className='hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 animate-in fade-in duration-200'>
                  <div className='glass-panel p-4 rounded-2xl w-[280px] shadow-2xl'>
                    {/* Post Image (if exists) */}
                    {marker.props.post.image && (
                      <div className='mb-3 rounded-xl overflow-hidden'>
                        <img
                          src={marker.props.post.image}
                          alt='post'
                          className='w-full h-32 object-cover'
                          referrerPolicy='no-referrer'
                        />
                      </div>
                    )}

                    {/* Post Text */}
                    <p className='text-white text-sm leading-relaxed line-clamp-3 mb-3'>
                      {marker.props.post.text}
                    </p>

                    {/* User Info */}
                    <div className='flex items-center gap-2 pt-3 border-t border-white/10'>
                      <img
                        src={marker.props.post.userImg}
                        className='h-6 w-6 rounded-full ring-1 ring-pink-500/30'
                        alt=''
                        referrerPolicy='no-referrer'
                      />
                      <span className='text-gray-300 text-xs font-medium'>
                        {marker.props.post.username}
                      </span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className='absolute top-full left-1/2 -translate-x-1/2 -mt-1'>
                    <div className='w-3 h-3 bg-[rgba(15,12,41,0.85)] rotate-45 border-b border-r border-white/5'></div>
                  </div>
                </div>
              </Overlay>
            ))}
          </Map>
        ) : (
          <div className='h-full flex items-center justify-center glass-panel rounded-2xl'>
            <div className='text-center p-8'>
              <svg className='w-16 h-16 text-gray-600 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              <h3 className='text-lg font-semibold text-white mb-2'>Location Required</h3>
              <p className='text-gray-400 text-sm'>Enable location access to view the map</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
