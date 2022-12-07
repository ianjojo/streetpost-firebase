import React, { useEffect, useState } from "react";
import { Map, Overlay, Marker } from "pigeon-maps";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { locationState } from "../atoms/modalAtom";
import Marker2 from "./Marker2";
import { useRouter } from "next/router";
import PostPreview from "./PostPreview";
export default function Pigeon({ notes, posts, id, key, hideMap }) {
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
  console.log(allMarkers);
  let currentLatLng = [Number(location[0]), Number(location[1])];
  const mapTilerProvider = (x, y, z, dpr) => {
    return `https://api.maptiler.com/maps/jp-mierune-dark/${z}/${x}/${y}.png?key=AodQuZmi32MyjzguIUO1`;
  };
  return (
    <div className='relative'>
      <span
        onClick={hideMap}
        className='absolute top-[50px] left-4 text-[30px] px-2 text-black bg-white rounded-full z-50 cursor-pointer'
      >
        Ｘ
      </span>
      <div className='mobilemycontainer z-2 bg-black absolute  h-full  w-screen shadow-[0_0px_5px_rgba(240,_46,_170,_0.7)]'>
        {/*   <div className='overlay'>
          <img src='/vintage-paper-texture-3.jpeg' alt='' />
        </div> */}
        {location.length > 0 ? (
          <Map
            provider={mapTilerProvider}
            center={currentLatLng}
            defaultZoom={18}
            minZoom={18}
            maxZoom={18}
            mouseEvents={true}
          >
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
                  className='cursor-pointer xmarker'
                  onClick={() => router.push(`${marker.key}`)}
                >
                  ❌
                </span>
                {/* <PostPreview post={marker.props.post} /> */}
                <div className='p-8 w-[200px] rounded-2xl hidden group-hover:inline bg-violet-800/20 absolute t-24 z-100 ml-4 mb-4'>
                  <span className='z-100'>{marker.props.post.text}</span>
                  <div className='flex justify-between items-center w-full pt-8'>
                    <img
                      src={marker.props.post.userImg}
                      className='h-8 w-8 rounded-full'
                      alt=''
                    />
                    <span className='z-100 text-[8px]'>
                      {marker.props.post.username}
                    </span>
                  </div>
                </div>
              </Overlay>
            ))}
          </Map>
        ) : (
          "no location"
        )}
      </div>
    </div>
  );
}
