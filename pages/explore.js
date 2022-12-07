import React, { useEffect, useState } from "react";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../firebase";
import Card from "../components/Card";
import { locationState } from "../atoms/modalAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
function explore() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const location = useRecoilValue(locationState);
  console.log(location, "from explore page");
  // function to go back to the previous page
  const goBack = () => {
    router.back();
  };

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setLoading(true);
          setPosts(snapshot.docs);

          setLoading(false);
        }
      ),
    [db]
  );

  return (
    <div className='parent relative'>
      <span
        onClick={goBack}
        className='absolute top-8 left-8 text-[50px] z-50  drop-shadow-lg  rounded-full
        bg-gray-300 border-2
        border-violet-700 h-50 px-8 cursor-pointer hover:bg-gray-100'
      >
        👈
      </span>
      {!posts && <h1>Loading...</h1>}
      {posts?.map((post) => (
        <Card key={post.id} id={post.id} post={post.data()} />
      ))}
    </div>
  );
}

export default explore;
