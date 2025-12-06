import React, { useState, useRef, useEffect } from "react";
import {
  XMarkIcon,
  PhotoIcon,
  ChartBarIcon,
  FaceSmileIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { signIn, useSession } from "next-auth/react";
import GetUserLocation from "./GetUserLocation";
import MobileGetUserLocation from "./MobileGetUserLocation";
import { locationState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
export default function Input({ getUserLocation }) {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const filePickerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useRecoilState(locationState);

  const setSelectedFileToNull = () => {
    setSelectedFile(null);
  };
  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
      timestamp: serverTimestamp(),
      lat: location[0],
      lng: location[1],
      long: location[1],
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setLoading(false);
    setInput("");
    setSelectedFile(null);
    setShowEmojis(false);

    // Scroll to top to see the new post
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const addEmoji = (e) => {
    setInput(input + e.native);
  };
  if (!session) {
    return (
      <div className='glass-panel p-6 rounded-2xl mb-6'>
        <p className='text-gray-300 text-center'>
          <span
            className='text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 font-bold cursor-pointer hover:from-pink-300 hover:to-purple-400 transition-all'
            onClick={() => signIn()}
          >
            Sign in
          </span>{" "}
          to share your location-based memories with the world
        </p>
      </div>
    );
  }

  return (
    <div
      className={`glass-panel p-6 rounded-2xl mb-6 transition-all duration-300 ${loading && "opacity-60"
        }`}
    >
      <div className='flex gap-4'>
        <img
          src={session?.user?.image}
          className='h-12 w-12 rounded-full ring-2 ring-pink-500/30'
          alt='profile pic'
          referrerPolicy='no-referrer'
        />
        <div className='flex-1'>
          <div className={`${selectedFile && "pb-4"} ${input && "space-y-3"}`}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows='3'
              placeholder="What's on your mind? Share a memory from this location..."
              className='bg-transparent outline-none text-white text-base placeholder-gray-500 tracking-wide w-full min-h-[80px] resize-none'
            />
            {selectedFile && (
              <div className='relative rounded-xl overflow-hidden'>
                <div
                  className='absolute w-8 h-8 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center top-2 right-2 cursor-pointer z-10 transition-colors'
                  onClick={setSelectedFileToNull}
                >
                  <XMarkIcon className='text-white h-5' />
                </div>
                <img
                  src={selectedFile}
                  alt=''
                  className='rounded-xl max-h-96 w-full object-cover'
                />
              </div>
            )}
          </div>
          {!loading && (
            <div className='flex items-center justify-between pt-4 border-t border-gray-700/30'>
              <div className='flex items-center gap-2'>
                <button
                  className='p-2 rounded-lg hover:bg-pink-500/10 transition-colors group'
                  onClick={() => filePickerRef.current.click()}
                >
                  <PhotoIcon className='h-6 w-6 text-gray-400 group-hover:text-pink-400 transition-colors' />
                  <input
                    type='file'
                    onChange={addImageToPost}
                    ref={filePickerRef}
                    className='hidden'
                    accept='image/*'
                  />
                </button>
                <MobileGetUserLocation getUserLocation={getUserLocation} />
              </div>
              <button
                className='bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl px-6 py-2.5 font-semibold shadow-lg hover:shadow-pink-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200'
                disabled={(!input.trim() && !selectedFile) || !location.length}
                onClick={sendPost}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
