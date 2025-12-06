import Pigeon from "./Pigeon";

function MapSidebar({ notes }) {
    return (
        <div className='hidden lg:flex ml-8 w-[500px] xl:w-[600px] py-4 sticky top-0 h-screen'>
            <div className='glass-panel rounded-3xl p-6 w-full flex flex-col overflow-hidden shadow-xl shadow-pink-500/10'>
                {/* Header */}
                <div className='mb-4'>
                    <h3 className='text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent mb-1'>
                        Nearby Posts
                    </h3>
                    <p className='text-sm text-gray-400'>Explore posts on the map</p>
                </div>

                {/* Map Container */}
                <div className='flex-1 rounded-2xl overflow-hidden'>
                    <Pigeon notes={notes} />
                </div>
            </div>
        </div>
    );
}

export default MapSidebar;
