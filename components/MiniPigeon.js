import React from "react";
import { Map, Overlay } from "pigeon-maps";
import { motion } from "framer-motion";

export default function MiniPigeon({ post }) {
  const mapTilerProvider = (x, y, z, dpr) => {
    return `https://api.maptiler.com/maps/jp-mierune-dark/${z}/${x}/${y}.png?key=AodQuZmi32MyjzguIUO1`;
  };

  if (!post?.lat || !post?.long) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className='mt-6 mb-8'
    >
      <h3 className="text-xl font-bold text-white mb-4 px-2">Location</h3>
      <div className='glass-magical rounded-[24px] overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/10 relative h-[300px]'>
        {/* Map Overlay Gradient */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/40" />

        <Map
          provider={mapTilerProvider}
          center={[Number(post.lat), Number(post.long)]}
          defaultZoom={15}
          minZoom={12}
          maxZoom={18}
          height={300}
          mouseEvents={false}
        >
          <Overlay
            anchor={[Number(post.lat), Number(post.long)]}
            className='relative'
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-pink-500/30 rounded-full blur-xl opacity-60 animate-pulse" />
              <div className="text-3xl filter drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] transform -translate-x-1/2 -translate-y-1/2">
                📍
              </div>
            </div>
          </Overlay>
        </Map>
      </div>
    </motion.div>
  );
}
