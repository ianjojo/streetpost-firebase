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
import { useSession, signIn } from "next-auth/react";
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
    if (!session) {
      signIn();
      return;
    }
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
      className='glass-panel p-6 rounded-2xl cursor-pointer mb-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)] group'
      onClick={() => router.push(`${id}`)}
    >
      <div className='flex gap-4'>
        {!postPage && (
          <img
            src={post?.userImg}
            alt='profile pic'
            className='h-12 w-12 rounded-full ring-2 ring-pink-500/20 group-hover:ring-pink-500/40 transition-all'
            referrerPolicy='no-referrer'
          />
        )}
        <div className='flex-1 min-w-0'>
          {/* Header */}
          <div className='flex items-start justify-between mb-3'>
            <div className='flex items-center gap-3 flex-wrap'>
              {postPage && (
                <img
                  src={post?.userImg}
                  alt='profile pic'
                  className='h-12 w-12 rounded-full ring-2 ring-pink-500/20'
                  referrerPolicy='no-referrer'
                />
              )}
              <div>
                <h4 className='font-bold text-base text-white group-hover:text-pink-400 transition-colors'>
                  {post?.username}
                </h4>
                <div className='flex items-center gap-2 text-sm text-gray-400'>
                  <span className='flex items-center gap-1'>
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                    </svg>
                    {distance.toFixed(2)} km away
                  </span>
                  <span>·</span>
                  <span className='hover:underline'>
                    <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                  </span>
                </div>
              </div>
            </div>

            {/* Like button in header */}
            <div
              className='flex items-center space-x-1 group/like'
              onClick={(e) => {
                e.stopPropagation();
                likePost();
              }}
            >
              <div className='p-2 rounded-full hover:bg-pink-500/10 transition-colors'>
                {liked ? (
                  <HeartIconFilled className='h-5 w-5 text-pink-500' />
                ) : (
                  <HeartIcon className='h-5 w-5 text-gray-400 group-hover/like:text-pink-500 transition-colors' />
                )}
              </div>
              {likes.length > 0 && (
                <span className={`text-sm font-medium ${liked ? 'text-pink-500' : 'text-gray-400'}`}>
                  {likes.length}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          {!postPage && (
            <p className='text-gray-200 text-base leading-relaxed mb-4'>
              {post?.text}
            </p>
          )}
          {postPage && (
            <p className='text-gray-200 text-base leading-relaxed mb-4'>
              {post?.text}
            </p>
          )}

          {/* Image */}
          {post?.image && (
            <img
              src={post?.image}
              className='rounded-xl w-full object-cover mb-4 max-h-96'
              alt=''
              referrerPolicy='no-referrer'
            />
          )}

          {/* Actions */}
          <div className='flex items-center justify-between pt-3 border-t border-gray-700/50'>
            <div className='flex items-center gap-4'>
              {session?.user?.uid === post?.id ? (
                <button
                  className='flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10'
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDoc(doc(db, "posts", id));
                    router.push("/");
                  }}
                >
                  <TrashIcon className='h-5 w-5' />
                  <span className='text-sm font-medium'>Delete</span>
                </button>
              ) : (
                <div></div>
              )}
            </div>

            <div className='flex items-center gap-4'>
              <button
                className='flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-blue-500/10'
                onClick={(e) => {
                  e.stopPropagation();
                  if (!session) {
                    signIn();
                    return;
                  }
                  setPostId(id);
                  setIsOpen(true);
                }}
              >
                <ChatBubbleOvalLeftEllipsisIcon className='h-5 w-5' />
                {comments.length > 0 && (
                  <span className='text-sm font-medium'>{comments.length}</span>
                )}
              </button>

              <button className='flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-purple-500/10'>
                <ShareIcon className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
