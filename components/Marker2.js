import React from "react";
import Link from "next/link";
import { Overlay, Marker } from "pigeon-maps";
function Marker2({ id, post, postPage, getUserLocation }) {
  return (
    /*   <Overlay anchor={[post.lat, post.long]} offset={[24, 15]}>
      <div className='popup'>
        <Link href={`/notes/${post.id}`}>
         
          <span className='text-black z-55'>{post.text}</span>
          <span className='text-black z-55'>{post.lat}</span>
        </Link>
      </div>
    </Overlay> */
    <Marker
      width={50}
      anchor={[Number(post.lat), Number(post.long)]}
      onClick={() => setHue(hue + 20)}
    />
  );
}

export default Marker2;
