import Moment from "react-moment";
import { motion } from "framer-motion";

function Comment({ comment }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
      className='glass-light p-5 rounded-2xl mb-3 border border-white/5 transition-colors duration-300'
    >
      <div className='flex gap-4'>
        <img
          src={comment?.userImg}
          alt=''
          className='h-10 w-10 rounded-full ring-2 ring-purple-500/20'
        />
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 flex-wrap mb-2'>
            <h4 className='font-bold text-white text-sm'>
              {comment?.username}
            </h4>
            <span className='text-gray-400 text-xs'>@{comment?.tag}</span>
            <span className='text-gray-500 text-xs'>·</span>
            <span className='text-gray-400 text-xs hover:text-white transition-colors cursor-pointer'>
              <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
          </div>
          <p className='text-gray-200 text-sm leading-relaxed break-words font-light'>
            {comment?.comment}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Comment;
