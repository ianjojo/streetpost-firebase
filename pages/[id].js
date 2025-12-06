import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
/* import Widgets from "../components/Widgets"; */
import MiniPigeon from "../components/MiniPigeon";
import Post from "../components/Post";
import { db } from "../firebase";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Comment from "../components/Comment";
import Head from "next/head";

function PostPage({ trendingResults, followResults, providers }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(
    () => {
      if (!id) return;
      return onSnapshot(doc(db, "posts", id), (snapshot) => {
        setPost(snapshot.data());
      });
    },
    [db, id]
  );

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

  return (
    <div>
      <Head>
        <title>
          {post?.username} posted: "{post?.text}" - Streetpost
        </title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='min-h-screen flex max-w-[1500px] mx-auto'>
        <Sidebar />

        <div className='flex-grow max-w-2xl sm:ml-[73px] xl:ml-[370px] px-4 pb-20'>
          {/* Magical Floating Header */}
          <div className='sticky top-4 z-50 mb-6'>
            <div className="glass-magical rounded-2xl flex items-center justify-between px-4 py-3">
              <div
                className='p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer group'
                onClick={() => router.push("/")}
              >
                <ArrowLeftIcon className='h-5 w-5 text-white group-hover:scale-110 transition-transform' />
              </div>
              <h2 className='text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                Nearby Post
              </h2>
              <div className="w-9" /> {/* Spacer for balance */}
            </div>
          </div>

          <Post id={id} post={post} postPage />

          {post && <MiniPigeon post={post} />}

          {/* Comments Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4 px-2">Comments</h3>
            {comments.length > 0 ? (
              <div className='space-y-4'>
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    id={comment.id}
                    comment={comment.data()}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-light rounded-2xl p-8 text-center">
                <p className="text-gray-400">No comments yet. Be the first to reply!</p>
              </div>
            )}
          </div>
        </div>

        {isOpen && <Modal />}
      </main>
    </div>
  );
}

export default PostPage;

export async function getServerSideProps(context) {
  /*   const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  ); */
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      /*    trendingResults,
      followResults, */
      providers,
      session,
    },
  };
}
