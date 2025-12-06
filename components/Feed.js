import React, { useState, useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Input from "./Input";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../firebase";
import Post from "./Post";
import { useRecoilState } from "recoil";
import { locationState } from "../atoms/modalAtom";
import { postsState } from "../atoms/modalAtom";
import { useSession } from "next-auth/react";
import GetUserLocation from "./GetUserLocation";
import { useRouter } from "next/router";
import Loading from "./Loading";
import Link from "next/link";
function Feed({ getUserLocation, storeNotes, location, toggleMap, hideMap, mapIsOpen }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [gotLocation, setGotLocation] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sortedNotes, setSortedNotes] = useState([]);
  const [sortedNotesGlobal, setSortedNotesGlobal] = useRecoilState(postsState);
  const [queryDistance, setQueryDistance] = useState(5);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);

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
          setLoading(true);
          setPosts(snapshot.docs);
          storeNotes(snapshot.docs);
          setSortBy("distance");
          setLoading(false);
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

  const sortPosts = () => {
    if (sortBy === "distance") {
      let sortedByDistance = matching;
      setLoading(true);
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
      setLoading(false);
    } else {
      setLoading(true);
      setSortedNotes(matching);
      setLoading(false);
      return;
    }
  };

  // sort array by distance

  useEffect(() => {
    if (sortBy === "distance") {
      let sortedByDistance = matching;
      setLoading(true);
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
      setLoading(false);
    } else {
      setLoading(true);
      setSortedNotes(matching);
      setLoading(false);
      return;
    }
  }, [sortBy]);
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
      sortPosts();
    } else {
      setSortBy("date");
      console.log(sortBy);
      sortPosts();
    }
  };
  useEffect(() => {
    sortPosts();
  }, [location]);
  return (
    <div className='text-white flex-grow max-w-2xl sm:ml-[73px] xl:ml-[370px] px-4'>
      <div className='text-white flex items-center sm:justify-between py-4 sticky top-0 z-10 backdrop-blur-md bg-[#030014]/80 -mx-4 px-4 mb-4'>
        <h2 className='hidden text-2xl sm:inline font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'>
          Feed
        </h2>

        <div className='mobile-nav flex justify-between sm:hidden w-full space-x-2'>
          <h2 className='text-xl font-bold'>Streetpost</h2>
          <div className='flex justify-end space-x-3 items-center text-sm'>
            <h2 className='font-medium hover:text-pink-400 transition-colors cursor-pointer' onClick={hideMap}>
              Posts
            </h2>
            <h2 className='font-medium hover:text-pink-400 transition-colors cursor-pointer' onClick={toggleMap}>
              Map
            </h2>
            <Link href='/explore'>
              <h2 className='font-medium hover:text-pink-400 transition-colors cursor-pointer'>Explore</h2>
            </Link>
            <h2 className='font-medium hover:text-pink-400 transition-colors cursor-pointer'>
              {!session ? "Login" : "Logout"}
            </h2>
          </div>
        </div>

        <div className='hidden sm:flex items-center gap-3 xl:px-0 ml-auto'>
          <GetUserLocation getUserLocation={getUserLocation} />
        </div>
      </div>
      <Input getUserLocation={getUserLocation} location={location} />

      <div className='flex justify-center items-center mb-8'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSort}
          className='glass-panel px-6 py-2 rounded-xl text-sm font-medium hover:bg-pink-500/10 transition-all duration-200 text-gray-300 hover:text-white border border-white/5'
        >
          Sort by {sortBy === "date" ? "distance" : "date"}
        </motion.button>
      </div>

      <motion.div
        className='pb-72'
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loading />
            </motion.div>
          )}

          {!loading && sortedNotes?.map((post) => (
            <Post key={post.id} id={post.id} post={post.data()} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Feed;
