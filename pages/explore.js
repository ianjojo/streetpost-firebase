import React, { useEffect, useState } from "react";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../firebase";
import Card from "../components/Card";
import { locationState } from "../atoms/modalAtom";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { ArrowLeftIcon, MapIcon, ClockIcon, FireIcon } from "@heroicons/react/24/outline";
import Loading from "../components/Loading";

function Explore() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("recent"); // recent, popular, nearby
  const location = useRecoilValue(locationState);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
          setLoading(false);
        }
      ),
    [db]
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#030014] via-[#0a001a] to-[#030014]'>
      {/* Header */}
      <div className='sticky top-0 z-20 backdrop-blur-2xl bg-[#030014]/80 border-b border-white/5'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-6'>
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className='flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 group'
            >
              <ArrowLeftIcon className='h-5 w-5 text-gray-400 group-hover:text-white transition-colors' />
              <span className='hidden sm:inline text-gray-400 group-hover:text-white font-medium transition-colors'>
                Back
              </span>
            </button>

            {/* Title */}
            <div className='flex-1 text-center'>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent'>
                Explore
              </h1>
              <p className='text-sm text-gray-400 mt-1'>
                Discover posts from around the world
              </p>
            </div>

            {/* Filter Buttons */}
            <div className='hidden sm:flex items-center gap-2'>
              <button
                onClick={() => setSortBy("recent")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${sortBy === "recent"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30"
                    : "glass-light text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
              >
                <ClockIcon className='h-4 w-4 inline mr-1.5' />
                Recent
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${sortBy === "popular"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30"
                    : "glass-light text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
              >
                <FireIcon className='h-4 w-4 inline mr-1.5' />
                Popular
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className='flex sm:hidden items-center gap-2 pb-4'>
            <button
              onClick={() => setSortBy("recent")}
              className={`flex-1 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${sortBy === "recent"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "glass-light text-gray-400"
                }`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy("popular")}
              className={`flex-1 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${sortBy === "popular"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "glass-light text-gray-400"
                }`}
            >
              Popular
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Stats Bar */}
            <div className='glass-panel p-4 rounded-2xl mb-8'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-400'>
                  Showing <span className='text-white font-semibold'>{posts.length}</span> posts
                </span>
                <span className='text-gray-400'>
                  Sorted by <span className='text-pink-400 font-semibold'>{sortBy}</span>
                </span>
              </div>
            </div>

            {/* Masonry Grid */}
            <div className='masonry-grid'>
              {posts?.map((post) => (
                <Card key={post.id} id={post.id} post={post.data()} />
              ))}
            </div>

            {/* Empty State */}
            {posts.length === 0 && (
              <div className='glass-panel p-12 rounded-3xl text-center'>
                <MapIcon className='h-16 w-16 text-gray-600 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-white mb-2'>No posts yet</h3>
                <p className='text-gray-400'>Be the first to share something!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Explore;
