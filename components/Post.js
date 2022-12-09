import React from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import {
  EllipsisHorizontalIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  TrashIcon,
  ArrowsRightLeftIcon,
  HeartIcon,
  ShareIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatBubbleOvalLeftEllipsisIcon as ChatIconFilled,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState, postIdState, locationState } from "../atoms/modalAtom";
import { db } from "../firebase";
import GetUserLocation from "./GetUserLocation";

function Post({ id, post, postPage, getUserLocation }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [location, setLocation] = useRecoilState(locationState);
  const router = useRouter();
  const [distance, setDistance] = useState(0);
  const myLocation = useRecoilValue(locationState);
  console.log(myLocation);
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );
  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );
  useEffect(
    () =>
      setLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  );

  useEffect(() => {
    setDistance(getDistance(location[0], location[1], post?.lat, post?.long));
    console.log(
      "location[0]: " + location[0],
      "location[1]: " + location[1],
      "post.lat: " + post?.lat,
      "post.long: " + post?.long,
      "distance: " + distance.toFixed(2) + " km"
    );
  }, [location, post]);

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.name,
      });
    }
  };
  // get the distance in kilometers between two points
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <div
      className='p-3 flex rounded-xl cursor-pointer btn-gradient-border btn-glow mb-8 transition ease-in-out'
      onClick={() => router.push(`${id}`)}
    >
      {!postPage && (
        <img
          src={post?.userImg}
          alt='profile pic'
          className='h-11 w-11 rounded-full mr-4'
          referrerPolicy='no-referrer'
        />
      )}
      <div className='flex flex-col space-y-2 w-full'>
        <div className={`flex ${!postPage && "justify-between"}`}>
          {postPage && (
            <img
              src={post?.userImg}
              alt='profile pic'
              className='h-11 w-11 rounded-full mr-4'
              referrerPolicy='no-referrer'
            />
          )}
          <div className='text-[#6e767d] '>
            <div className='inline-block group'>
              <h4
                className={`font-bold text-[15px] font-chillax sm:text-base text-[#d9d9d9] group-hover:underline ${
                  !postPage && "inline-block"
                }`}
              >
                {post?.username}
              </h4>
              <span
                className={`text-sm sm:text-[15px] font-clashgrotesk ${
                  !postPage && "ml-1.5"
                }`}
              >
                {`· ${distance.toFixed(2)} km away`}
              </span>
            </div>{" "}
            ·{" "}
            <span className='hover:underline text-sm font-clashgrotesk sm:text-[15px]'>
              <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
            </span>
            {!postPage && (
              <p className='text-[#d9d9d9] text-[15px] font-clashgrotesk sm:text-base mt-0.5'>
                {post?.text}
              </p>
            )}
          </div>
          <div className='icon group flex-shrink-0 ml-auto'>
            <div
              className='flex items-center space-x-1 group'
              onClick={(e) => {
                e.stopPropagation();
                likePost();
              }}
            >
              <div className='icon group-hover:bg-pink-600/10'>
                {liked ? (
                  <HeartIconFilled className='h-5 text-pink-600' />
                ) : (
                  <HeartIcon className='h-5 group-hover:text-pink-600' />
                )}
              </div>
              {likes.length > 0 && (
                <span
                  className={`group-hover:text-pink-600 text-sm ${
                    liked && "text-pink-600"
                  }`}
                >
                  {likes.length}
                </span>
              )}
            </div>
          </div>
        </div>
        {postPage && (
          <p className='text-[#d9d9d9] text-[15px] sm:text-base mt-0.5'>
            {post?.text}
          </p>
        )}
        <img
          src={post?.image}
          className='rounded-2xl max-h-[700px] object-cover mr-2'
          alt=''
          referrerPolicy='no-referrer'
        />
        <div
          className={`text-[#6e767d] flex justify-between w-full ${
            postPage && "mx-auto"
          }`}
        >
          {session.user.uid === post?.id ? (
            <div
              className='flex items-center space-x-1 group'
              onClick={(e) => {
                e.stopPropagation();
                deleteDoc(doc(db, "posts", id));
                router.push("/");
              }}
            >
              <div className='icon group-hover:bg-red-600/10'>
                <TrashIcon className='h-5 group-hover:text-red-600' />
              </div>
            </div>
          ) : (
            <div className='flex items-center space-x-1 group'></div>
          )}

          <div className='icon group'>
            <ShareIcon className='h-5 group-hover:text-[#1d9bf0]' />
          </div>
          <div
            className='flex items-center space-x-1 group'
            onClick={(e) => {
              e.stopPropagation();
              setPostId(id);
              setIsOpen(true);
            }}
          >
            <div className='icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10'>
              <ChatBubbleOvalLeftEllipsisIcon className='h-5 group-hover:text-[#1d9bf0]' />
            </div>
            {comments.length > 0 && (
              <span className='group-hover:text-[#1d9bf0] text-sm'>
                {comments.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
