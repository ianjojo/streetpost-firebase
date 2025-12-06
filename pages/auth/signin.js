import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";

export default function SignIn({ providers }) {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#030014] via-[#0a001a] to-[#030014]'>
            <div className='glass-panel p-12 max-w-md w-full mx-4 rounded-3xl'>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-clash font-bold text-white mb-3'>
                        Welcome to Streetpost
                    </h1>
                    <p className='text-gray-400 text-sm'>
                        Sign in to share your location-based memories
                    </p>
                </div>

                {Object.values(providers).map((provider) => (
                    <div key={provider.name} className='mt-6'>
                        <button
                            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                            className='w-full group relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-[1.02]'
                        >
                            <span className='relative z-10 flex items-center justify-center gap-3'>
                                <svg className='w-5 h-5' viewBox='0 0 24 24'>
                                    <path
                                        fill='currentColor'
                                        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                    />
                                    <path
                                        fill='currentColor'
                                        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                    />
                                    <path
                                        fill='currentColor'
                                        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                    />
                                    <path
                                        fill='currentColor'
                                        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                    />
                                </svg>
                                Sign in with {provider.name}
                            </span>
                        </button>
                    </div>
                ))}

                <p className='text-gray-500 text-xs text-center mt-8'>
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res);

    // If the user is already logged in, redirect to home
    if (session) {
        return { redirect: { destination: "/" } };
    }

    const providers = await getProviders();

    return {
        props: { providers: providers ?? [] },
    };
}
