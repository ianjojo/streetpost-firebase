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
import { useSession } from "next-auth/react";
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
  return (
    <div
      className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll ${
        loading && "opacity-60"
      }`}
    >
      <img
        className='h-11 w-11 rounded-full cursor-pointer'
        src={session.user.image}
        alt='profile pic'
        referrerPolicy='no-referrer'
      />
      <div className='w-full divide-y divide-gray-700'>
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows='3'
            placeholder='Post something here...'
            className='bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px] resize-none'
          />
          {selectedFile && (
            <div className='relative'>
              <div
                className='absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer'
                onClick={setSelectedFileToNull}
              >
                <XMarkIcon className='text-white h-5' />
              </div>
              <img
                src={selectedFile}
                alt=''
                className='rounded-2xl max-h-80 object-contain'
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className='flex items-center justify-between pt-2.5 '>
            <div className='flex items-center justify-between w-full mr-2 '>
              <div
                className='icon'
                onClick={() => filePickerRef.current.click()}
              >
                <PhotoIcon className='h-[22px]  text-[#1d9bf0]' />
                <input
                  type='file'
                  onChange={addImageToPost}
                  ref={filePickerRef}
                  className='hidden'
                />
              </div>

              <MobileGetUserLocation getUserLocation={getUserLocation} />
            </div>
            <button
              className='bg-[#763d83] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#702989] disabled:hover:bg-[#4c2956] disabled:opacity-50 disabled:cursor-default'
              disabled={(!input.trim() && !selectedFile) || !location.length}
              onClick={sendPost}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
