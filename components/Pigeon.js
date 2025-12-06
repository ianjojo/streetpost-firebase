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
            defaultZoom={18}
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
                <span
                  className='cursor-pointer hover:scale-125 transition-transform duration-200'
                  onClick={() => router.push(`${marker.key}`)}
                >
                  {/* Modern Marker Icon */}
                  <svg className='w-8 h-8 drop-shadow-lg' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'
                      fill='url(#gradient)'
                      stroke='white'
                      strokeWidth='1'
                    />
                    <circle cx='12' cy='9' r='2.5' fill='white' />
                    <defs>
                      <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                        <stop offset='0%' stopColor='#ec4899' />
                        <stop offset='100%' stopColor='#a855f7' />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>

                {/* Hover Card */}
                <div className='hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50'>
                  <div className='glass-panel p-4 rounded-xl w-[220px] shadow-xl'>
                    <p className='text-white text-sm line-clamp-3 mb-3'>
                      {marker.props.post.text}
                    </p>
                    <div className='flex items-center gap-2'>
                      <img
                        src={marker.props.post.userImg}
                        className='h-6 w-6 rounded-full ring-1 ring-white/20'
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
