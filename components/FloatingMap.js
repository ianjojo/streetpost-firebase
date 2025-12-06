import { MagnifyingGlassCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Pigeon from "./Pigeon";

function FloatingMap({ notes, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden'
                onClick={onClose}
            />

            {/* Floating Map Panel */}
            <div className={`fixed top-0 right-0 h-full w-full lg:w-[500px] xl:w-[600px] z-50 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className='h-full glass-panel border-l border-white/10 flex flex-col'>
                    {/* Header */}
                    <div className='flex items-center justify-between p-6 border-b border-white/10'>
                        <div>
                            <h3 className='text-xl font-bold text-white'>Nearby Posts</h3>
                            <p className='text-sm text-gray-400'>Explore posts on the map</p>
                        </div>
                        <button
                            onClick={onClose}
                            className='p-2 rounded-xl hover:bg-white/10 transition-colors group'
                        >
                            <XMarkIcon className='h-6 w-6 text-gray-400 group-hover:text-white transition-colors' />
                        </button>
                    </div>

                    {/* Map Container */}
                    <div className='flex-1 relative overflow-hidden'>
                        <Pigeon notes={notes} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default FloatingMap;
