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
import { useRecoilState } from "recoil";
import { modalState, postIdState, locationState } from "../atoms/modalAtom";
import { db } from "../firebase";
import GetUserLocation from "./GetUserLocation";

function Card({ id, post, postPage, getUserLocation }) {
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
  }, [location]);

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
  const bgCode = Math.floor(Math.random() * 5) + 1;

  // Card for posts without images (text only)
  if (!post?.image)
    return (
      <div
        className='glass-panel p-6 rounded-2xl cursor-pointer group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20 overflow-hidden relative'
        onClick={() => router.push(`${id}`)}
      >
        {/* Gradient Background */}
        <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${bgCode === 1 ? 'from-pink-500 to-purple-600' :
            bgCode === 2 ? 'from-blue-500 to-cyan-600' :
              bgCode === 3 ? 'from-purple-500 to-pink-600' :
                bgCode === 4 ? 'from-orange-500 to-red-600' :
                  'from-green-500 to-emerald-600'
          }`}></div>

        {/* Content */}
        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-4'>
            <img
              src={post?.userImg}
              alt=''
              className='h-8 w-8 rounded-full ring-2 ring-white/10'
              referrerPolicy='no-referrer'
            />
            <span className='text-sm font-medium text-gray-300'>{post?.username}</span>
          </div>

          <p className='text-base text-white leading-relaxed line-clamp-4'>
            {post?.text}
          </p>

          {/* Footer */}
          <div className='flex items-center justify-between mt-4 pt-4 border-t border-white/5'>
            <span className='text-xs text-gray-400'>
              {distance ? `${distance.toFixed(1)} km away` : 'Location unknown'}
            </span>
            <div className='flex items-center gap-2 text-gray-400'>
              {likes.length > 0 && <span className='text-xs'>{likes.length} ♥</span>}
              {comments.length > 0 && <span className='text-xs'>{comments.length} 💬</span>}
            </div>
          </div>
        </div>
      </div>
    );

  // Card for posts with images
  return (
    <div
      className='glass-panel rounded-2xl overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20'
      onClick={() => router.push(`${id}`)}
    >
      {/* Image */}
      <div className='relative overflow-hidden'>
        <img
          src={post?.image}
          className='w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500'
          alt=''
          referrerPolicy='no-referrer'
        />
        {/* Overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='absolute bottom-0 left-0 right-0 p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <img
                src={post?.userImg}
                alt=''
                className='h-6 w-6 rounded-full ring-2 ring-white/30'
                referrerPolicy='no-referrer'
              />
              <span className='text-sm font-medium text-white'>{post?.username}</span>
            </div>
            {post?.text && (
              <p className='text-sm text-white/90 line-clamp-2'>{post?.text}</p>
            )}
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className='p-3 flex items-center justify-between'>
        <span className='text-xs text-gray-400'>
          {distance ? `${distance.toFixed(1)} km` : 'Unknown'}
        </span>
        <div className='flex items-center gap-3 text-gray-400'>
          {likes.length > 0 && <span className='text-xs flex items-center gap-1'>♥ {likes.length}</span>}
          {comments.length > 0 && <span className='text-xs flex items-center gap-1'>💬 {comments.length}</span>}
        </div>
      </div>
    </div>
  );
}

export default Card;
