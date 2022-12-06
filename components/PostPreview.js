import React, { useState } from "react";

function PostPreview({ post }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div
        className={`relative ${
          showModal ? "hidden" : ""
        }h-full w-full flex justify-center items-center`}
      >
        <div
          className={`bg-blue-500 absolute ${
            showModal ? "hidden" : ""
          }h-full w-full flex justify-center items-center`}
        >
          this is a modal.
        </div>
      </div>
    </>
  );
}

export default PostPreview;
