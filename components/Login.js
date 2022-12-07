import { signIn } from "next-auth/react";
import Image from "next/legacy/image";
import Link from "next/link";
function Login({ providers }) {
  return (
    <div className='intro'>
      <div className='intro__container'>
        <h1 className='intro__title'>Locations have memories.</h1>
        <h2>Tell the world.</h2>

        <p className='intro__hero--text'>
          Create a note, mark a memory, plant a flag at{" "}
          <span className='text-gradient'>real life</span> coordinates. Warn of
          a bad place to lock a bike, tell others about a beautiful magnolia,
          post a photo of the last place you saw your dog before he ran off -
          inscribe your memories upon the landscape.
        </p>
        <div className='button-ctn'>
          {/*    <Link className='intro__link' href='/notes'>
            Explore notes
          </Link> */}
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              {/* https://devdojo.com/tailwindcss/buttons#_ */}
              <button
                className='intro__link group relative overflow-hidden'
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              >
                <span className='w-48 h-48 rounded rotate-[-40deg] bg-[#6516527d] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0'></span>
                <span className='relative w-full text-left text-white transition-colors duration-300 ease-in-out group-hover:text-white'>
                  Sign in with {provider.name}
                </span>
              </button>
            </div>
          ))}
          <div className='flex flex-col items-center '>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
