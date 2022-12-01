import React, { useEffect, useState } from "react";
import { Map, Overlay, Marker } from "pigeon-maps";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { locationState } from "../atoms/modalAtom";
import Marker2 from "./Marker2";
import { useRouter } from "next/router";
export default function Pigeon({ notes, posts, id, key }) {
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
    return `https://api.maptiler.com/maps/streets-v2-dark/${z}/${x}/${y}.png?key=AodQuZmi32MyjzguIUO1`;
  };
  return (
    <div className=' '>
      <div className='mycontainer bg-black relative shadow-[0_0px_5px_rgba(240,_46,_170,_0.7)]'>
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
                offset={[24, 15]}
              >
                <span onClick={() => router.push(`${marker.key}`)}>❌</span>
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
