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
  // map only posts with an image
  //generate a different background color for each post
  const bgCode = Math.floor(Math.random() * 5) + 1;

  if (!post?.image)
    return (
      <div
        className={`mosaic-chunk specialbg${bgCode} flex justify-center items-center overflow-hidden cursor-pointer`}
        onClick={() => router.push(`${id}`)}
      >
        <h2 className='class="font-extrabold text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"'>
          {post?.text}
        </h2>
      </div>
    );
  return (
    <div className='mosaic-chunk' onClick={() => router.push(`${id}`)}>
      <img
        src={post?.image}
        className='mosaic-image'
        alt=''
        referrerPolicy='no-referrer'
      />
    </div>
  );
}

export default Card;
