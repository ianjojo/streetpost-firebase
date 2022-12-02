import React, { useEffect, useState } from "react";
import { Map, Overlay, Marker } from "pigeon-maps";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { locationState } from "../atoms/modalAtom";
import Marker2 from "./Marker2";
import { useRouter } from "next/router";
export default function MiniPigeon({ notes, posts, id, key, post }) {
  let mapId = "4fb841be-1983-4093-b576-32caf8d3b89e";
  const router = useRouter();

  const [location, setLocation] = useRecoilState(locationState);

  /*   const onMarkerClick = (props, marker, e) => {}; */

  //   allMarkers = displayMarkers(notes);

  const mapTilerProvider = (x, y, z, dpr) => {
    return `https://api.maptiler.com/maps/jp-mierune-dark/${z}/${x}/${y}.png?key=AodQuZmi32MyjzguIUO1`;
  };

  console.log(post);
  return (
    <div className=' '>
      <div className='mycontainermini bg-black  shadow-[0_0px_5px_rgba(240,_46,_170,_0.7)]'>
        {/*   <div className='overlay'>
          <img src='/vintage-paper-texture-3.jpeg' alt='' />
        </div> */}

        <Map
          provider={mapTilerProvider}
          center={[Number(post?.lat), Number(post?.long)]}
          defaultZoom={15}
          minZoom={12}
          maxZoom={18}
          mouseEvents={false}
        >
          <Overlay
            key={post?.key}
            anchor={[Number(post?.lat), Number(post?.long)]}
            className='group relative'
          >
            <span
              className='cursor-pointer xmarker'
              /* onClick={() => router.push(`${marker.key}`)} */
            >
              ❌
            </span>
          </Overlay>
        </Map>
      </div>
    </div>
  );
}
