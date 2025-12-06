import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import {
  CalendarIcon,
  ChartBarIcon,
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Moment from "react-moment";

function Modal() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);


  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState();
  const [comment, setComment] = useState("");
  const router = useRouter();

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", postId), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );

  const sendComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: comment,
      username: session.user.name,
      tag: session.user.tag,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    setIsOpen(false);
    setComment("");

    router.push(`/${postId}`);
  };
  if (!session) return null;
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='fixed z-50 inset-0 pt-8' onClose={setIsOpen}>
        <div className='flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-[#5b7083]/40 transition-opacity' />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='inline-block align-bottom glass-magical rounded-[32px] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-white/10'>
              {/* Header with Floating Close Button */}
              <div className='relative flex items-center justify-center px-6 py-4 border-b border-white/5'>
                <h3 className='text-lg font-semibold text-white'>Reply to Post</h3>
                <button
                  className='absolute right-4 p-2 rounded-full hover:bg-white/10 transition-colors group'
                  onClick={() => setIsOpen(false)}
                >
                  <XMarkIcon className='h-5 w-5 text-gray-400 group-hover:text-white transition-colors' />
                </button>
              </div>

              {/* Original Post */}
              <div className='px-6 pt-6 pb-4'>
                <div className='flex gap-4 relative'>
                  {/* Connection Line */}
                  <div className='absolute left-5 top-14 w-0.5 h-full bg-gradient-to-b from-pink-500/20 to-transparent'></div>

                  <img
                    src={post?.userImg}
                    alt='profile pic'
                    referrerPolicy='no-referrer'
                    className='h-11 w-11 rounded-full ring-2 ring-pink-500/20'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <h4 className='font-bold text-white text-base'>
                        {post?.username}
                      </h4>
                      <span className='text-gray-400 text-sm'>·</span>
                      <span className='text-gray-400 text-sm hover:underline'>
                        <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                      </span>
                    </div>
                    <p className='text-gray-200 text-base mt-2 leading-relaxed'>
                      {post?.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reply Input */}
              <div className='px-6 pb-6'>
                <div className='flex gap-4'>
                  <img
                    src={session.user.image}
                    alt=''
                    className='h-11 w-11 rounded-full ring-2 ring-purple-500/20'
                  />
                  <div className='flex-1'>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder='Post your reply...'
                      rows='3'
                      className='bg-transparent outline-none text-white text-base placeholder-gray-500 tracking-wide w-full min-h-[80px] resize-none'
                    />
                    <div className='flex items-center justify-between pt-4 border-t border-white/5 mt-4'>
                      <div className='flex items-center gap-2 text-gray-500 text-sm'>
                        <span>{comment.length}</span>
                      </div>
                      <button
                        className='bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl px-6 py-2.5 font-semibold shadow-lg hover:shadow-pink-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200'
                        type='submit'
                        onClick={sendComment}
                        disabled={!comment.trim()}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;
