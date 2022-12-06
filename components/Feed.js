import React, { useState, useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Input from "./Input";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../firebase";
import Post from "./Post";
import { useRecoilState } from "recoil";
import { locationState } from "../atoms/modalAtom";
import { useSession } from "next-auth/react";
import GetUserLocation from "./GetUserLocation";
import { useRouter } from "next/router";
import Loading from "./Loading";
import Link from "next/link";
function Feed({ getUserLocation, storeNotes, location, toggleMap, hideMap }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [gotLocation, setGotLocation] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sortedNotes, setSortedNotes] = useState([]);
  const [queryDistance, setQueryDistance] = useState(5);
  const [sortBy, setSortBy] = useState("");

  const goHome = () => {
    hideMap();
    router.push("/");
  };
  let distance = function (lat1, lon1, lat2, lon2) {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;

    return dist;
  };
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);

          storeNotes(snapshot.docs);
          setSortBy("distance");
        }
      ),
    [db]
  );
  let nearNotes = [];

  let matching = posts.filter((note) => {
    // return distance(coord.lat, coord.long, origin.lat, origin.long);
    return (
      distance(
        Number(location[0]),
        Number(location[1]),
        Number(note._document.data.value.mapValue.fields.lat.stringValue),
        Number(note._document.data.value.mapValue.fields.lng.stringValue)
      ) < 100
    );
  });

  // sort array by distance

  useEffect(() => {
    if (sortBy === "distance") {
      let sortedByDistance = matching;
      sortedByDistance.sort((a, b) => {
        return (
          distance(
            Number(location[0]),
            Number(location[1]),
            Number(a._document.data.value.mapValue.fields.lat.stringValue),
            Number(a._document.data.value.mapValue.fields.lng.stringValue)
          ) -
          distance(
            Number(location[0]),
            Number(location[1]),
            Number(b._document.data.value.mapValue.fields.lat.stringValue),
            Number(b._document.data.value.mapValue.fields.lng.stringValue)
          )
        );
      });
      setSortedNotes(sortedByDistance);
    } else {
      setSortedNotes(matching);
      return;
    }
  }, [sortBy, matching]);
  /* useEffect(() => {
    posts?.map((post) => {
      let distanceBetween = distance(
        Number(location[0]),

        Number(location[1]),
        Number(post._document.data.value.mapValue.fields.lat.stringValue),
        Number(post._document.data.value.mapValue.fields.lng.stringValue)
      );
      console.log(distanceBetween);
      if (distanceBetween < 0.5) {
        matching.push(post);
      }
    });
  }, [location, posts]); */

  const toggleSort = () => {
    if (sortBy === "date") {
      setSortBy("distance");
      console.log(sortBy);
    } else {
      setSortBy("date");
      console.log(sortBy);
    }
  };
  return (
    <div className='text-white flex-grow  max-w-2xl sm:ml-[73px] xl:ml-[370px]      '>
      <div className='text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-accent-color'>
        <h2 className='hidden text-lg sm:text-xl sm:inline font-bold'>Posts</h2>
        <span onClick={toggleSort}>
          Sort by {sortBy === "date" ? "distance" : "date"}
        </span>
        <div className='mobile-nav flex justify-between sm:hidden w-full space-x-2 bg-black z-50'>
          <h2 className='text-lg sm:text-xl font-bold z-50'>Streetpost</h2>
          <div className='flex justify-end space-x-3 items-center'>
            <h2 className='text-md sm:text-xl font-bold' onClick={hideMap}>
              Posts
            </h2>
            {/*    <Link
              href={{
                pathname: "/map",
                query: { location: location, posts: posts },
              }}
            >
              <h2 className='text-md sm:text-xl   font-bold'>Map</h2>
            </Link> */}
            <h2 className='text-md sm:text-xl   font-bold' onClick={toggleMap}>
              Map
            </h2>
            <h2 className='text-md sm:text-xl   font-bold'>
              {!session ? "Login" : "Logout"}
            </h2>
          </div>
        </div>

        <div className='  flex items-center  xl:px-0 ml-auto'>
          <GetUserLocation getUserLocation={getUserLocation} />

          {/*  {location.length > 0 && (
            <div onClick={() => getUserLocation}>
              <span className='text-white text-[10px] font-bold mr-2'>
                your location:{"   "}
              </span>
              <span className='text-white text-[10px]'>{` ${location[0]}, ${location[1]}`}</span>
            </div>
          )} */}
        </div>
      </div>
      <Input getUserLocation={getUserLocation} location={location} />
      <div className='pb-72'>
        {sortedNotes.length < 1 && <Loading />}
        {sortedNotes?.map((post) => (
          <Post key={post.id} id={post.id} post={post.data()} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
