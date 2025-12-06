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
import { motion } from "framer-motion";

function Post({ id, post, postPage, index }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [location, setLocation] = useRecoilState(locationState);
  const router = useRouter();
  const [distance, setDistance] = useState(0);

  useEffect(
    () => {
      if (!id) return;
      return onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      );
    },
    [db, id]
  );

  useEffect(
    () => {
      if (!id) return;
      return onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      );
    },
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

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={postVariants}
      whileHover={{ y: -5, scale: 1.01 }}
      onClick={() => router.push(`${id}`)}
      className='glass-magical p-6 rounded-[24px] cursor-pointer mb-6 group relative overflow-hidden transition-colors border border-white/5 hover:border-pink-500/20'
    >
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className='flex gap-4 relative z-10'>
        {!postPage && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
            <img
              src={post?.userImg}
              alt='profile pic'
              className='h-12 w-12 rounded-full ring-2 ring-white/10 group-hover:ring-pink-400/50 transition-all object-cover relative z-10'
              referrerPolicy='no-referrer'
            />
          </div>
        )}
        <div className='flex-1 min-w-0'>
          {/* Header */}
          <div className='flex items-start justify-between mb-3'>
            <div className='flex items-center gap-3 flex-wrap'>
              {postPage && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full blur opacity-40" />
                  <img
                    src={post?.userImg}
                    alt='profile pic'
                    className='h-12 w-12 rounded-full ring-2 ring-white/20 relative z-10'
                    referrerPolicy='no-referrer'
                  />
                </div>
              )}
              <div>
                <h4 className='font-bold text-base text-white group-hover:text-pink-300 transition-colors tracking-wide'>
                  {post?.username}
                </h4>
                <div className='flex items-center gap-2 text-sm text-gray-400/80 font-light'>
                  <span className='flex items-center gap-1 group-hover:text-pink-200/70 transition-colors'>
                    <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                    </svg>
                    {distance.toFixed(2)} km away
                  </span>
                  <span className="text-gray-600">·</span>
                  <span className='hover:text-white transition-colors'>
                    <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                  </span>
                </div>
              </div>
            </div>

            {/* Like button in header */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className='flex items-center space-x-1 group/like'
              onClick={(e) => {
                e.stopPropagation();
                likePost();
              }}
            >
              <div className={`p-2 rounded-full transition-colors ${liked ? 'bg-pink-500/20' : 'hover:bg-white/10'}`}>
                {liked ? (
                  <HeartIconFilled className='h-5 w-5 text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]' />
                ) : (
                  <HeartIcon className='h-5 w-5 text-gray-400 group-hover/like:text-pink-400 transition-colors' />
                )}
              </div>
              {likes.length > 0 && (
                <span className={`text-sm font-medium ${liked ? 'text-pink-500' : 'text-gray-400'}`}>
                  {likes.length}
                </span>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <p className={`text-gray-100 text-[15px] leading-relaxed mb-4 font-light tracking-wide ${!postPage && 'line-clamp-6'}`}>
            {post?.text}
          </p>

          {/* Image */}
          {post?.image && (
            <div className="relative rounded-2xl overflow-hidden mb-4 border border-white/5">
              <img
                src={post?.image}
                className='w-full object-cover max-h-[500px] hover:scale-105 transition-transform duration-700'
                alt=''
                referrerPolicy='no-referrer'
              />
            </div>
          )}

          {/* Actions */}
          <div className='flex items-center justify-between pt-3 border-t border-white/5 mt-2'>
            <div className='flex items-center gap-4'>
              {session?.user?.uid === post?.id ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10'
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDoc(doc(db, "posts", id));
                    router.push("/");
                  }}
                >
                  <TrashIcon className='h-4 w-4' />
                  <span className='text-xs font-medium'>Delete</span>
                </motion.button>
              ) : (
                <div />
              )}
            </div>

            <div className='flex items-center gap-2'>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                whileTap={{ scale: 0.9 }}
                className='flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all p-2 rounded-xl'
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
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.1)" }}
                whileTap={{ scale: 0.9 }}
                className='flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-all p-2 rounded-xl'
              >
                <ShareIcon className='h-5 w-5' />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Post;
