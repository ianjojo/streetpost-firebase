import React, { useState, useRef, useEffect } from "react";
import {
  XMarkIcon,
  PhotoIcon,
  ChartBarIcon,
  FaceSmileIcon,
  CalendarIcon,
  MapPinIcon,
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
import { signIn, useSession } from "next-auth/react";
import GetUserLocation from "./GetUserLocation";
import MobileGetUserLocation from "./MobileGetUserLocation";
import { locationState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import { motion, AnimatePresence } from "framer-motion";

export default function Input({ getUserLocation }) {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useRecoilState(locationState);
  const [isFocused, setIsFocused] = useState(false);
  const filePickerRef = useRef(null);

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
    setIsFocused(false);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
      setIsFocused(true);
    };
  };

  // Login Prompt
  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='glass-magical p-8 rounded-[32px] mb-8 relative overflow-hidden group'
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <p className='text-gray-300 text-center relative z-10 font-light text-lg'>
          <span
            className='font-semibold text-white cursor-pointer hover:text-pink-400 transition-colors border-b border-pink-500/30 hover:border-pink-400'
            onClick={() => signIn()}
          >
            Connect to the portal
          </span>{" "}
          to broadcast your signal to the world.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      classNamne="mb-8"
    >
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused
            ? "0 0 50px -10px rgba(189, 11, 157, 0.2)"
            : "0 20px 40px -10px rgba(0,0,0,0.3)",
          borderColor: isFocused ? "rgba(236, 72, 153, 0.3)" : "rgba(255, 255, 255, 0.08)"
        }}
        className={`glass-magical p-6 rounded-[30px] relative transition-colors duration-300 border overflow-hidden ${loading && "opacity-80 pointer-events-none"}`}
      >
        {/* Glow Background */}
        <div className={`absolute -top-20 -left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-[80px] transition-opacity duration-700 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-purple-600/20 rounded-full blur-[80px] transition-opacity duration-700 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />

        <div className='flex gap-5 relative z-10'>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className='relative'
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full blur-md opacity-40" />
            <img
              src={session?.user?.image}
              className='h-12 w-12 rounded-full ring-2 ring-white/10 relative z-10 object-cover'
              alt='profile pic'
              referrerPolicy='no-referrer'
            />
          </motion.div>

          <div className='flex-1'>
            <div className={`${selectedFile && "pb-4"} ${input && "space-y-4"}`}>
              <textarea
                value={input}
                onFocus={() => setIsFocused(true)}
                onBlur={() => !input && !selectedFile && setIsFocused(false)}
                onChange={(e) => setInput(e.target.value)}
                rows={isFocused ? '4' : '2'}
                placeholder="Broadcast a thought..."
                className='bg-transparent outline-none text-white text-lg placeholder-gray-500/50 w-full resize-none transition-all duration-300 font-light tracking-wide'
              />

              <AnimatePresence>
                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className='relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group'
                  >
                    <div
                      className='absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full cursor-pointer z-10 transition-all hover:scale-110'
                      onClick={setSelectedFileToNull}
                    >
                      <XMarkIcon className='text-white h-5 w-5' />
                    </div>
                    <img
                      src={selectedFile}
                      alt=''
                      className='w-full max-h-[400px] object-cover'
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              animate={{
                opacity: isFocused || input || selectedFile || loading ? 1 : 0.6,
                y: isFocused || input || selectedFile || loading ? 0 : 5
              }}
              className='flex items-center justify-between pt-4 mt-2 border-t border-white/5'
            >
              {!loading && (
                <div className='flex items-center gap-2'>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(236, 72, 153, 0.1)" }}
                    whileTap={{ scale: 0.9 }}
                    className='p-2.5 rounded-xl transition-colors'
                    onClick={() => filePickerRef.current.click()}
                  >
                    <PhotoIcon className='h-6 w-6 text-pink-400' />
                    <input
                      type='file'
                      onChange={addImageToPost}
                      ref={filePickerRef}
                      className='hidden'
                      accept='image/*'
                    />
                  </motion.button>

                  {/* Location Button Wrapper */}
                  <div className="scale-90 origin-left">
                    <MobileGetUserLocation getUserLocation={getUserLocation} />
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={(!input.trim() && !selectedFile) || !location.length}
                onClick={sendPost}
                className='bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl px-8 py-2.5 font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all'
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Broadcast"
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
