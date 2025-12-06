import Moment from "react-moment";

function Comment({ comment }) {
  return (
    <div className='glass-light p-5 rounded-xl mb-3 hover:bg-white/5 transition-all duration-300'>
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
            <span className='text-gray-400 text-xs hover:underline'>
              <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
          </div>
          <p className='text-gray-200 text-sm leading-relaxed break-words'>
            {comment?.comment}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
