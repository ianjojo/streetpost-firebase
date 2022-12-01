import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import Trending from "./Trending";
import Image from "next/image";

import Pigeon from "./Pigeon";
function Widgets({ notes, posts, id, key }) {
  return (
    <div className='hidden lg:inline ml-8 lg:w-[450px] mr-8 py-1 h-full w-full sticky top-0 z-50 '>
      <div className=' text-[#d9d9d9] h-full  rounded-xl w-full '>
        <h2 className='text-lg sm:text-xl font-bold'></h2>
        <Pigeon notes={notes} />
      </div>
    </div>
  );
}

export default Widgets;
