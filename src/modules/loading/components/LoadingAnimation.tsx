
import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-1000">
      <div className="relative w-64 h-32">
        {/* Road */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Car body */}
        <motion.svg
          viewBox="0 0 100 50"
          className="w-full h-full"
          initial={{ x: -100 }}
          animate={{ x: 100 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <motion.path
            d="M15,30 Q20,10 30,10 L70,10 Q80,10 85,30 L90,40 Q90,50 80,50 L20,50 Q10,50 10,40 Z"
            fill="#DC2626"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          {/* Windows */}
          <path d="M30,15 L70,15 L65,30 L35,30 Z" fill="#1F2937" />
          {/* Wheels */}
          <circle cx="25" cy="45" r="8" fill="#1F2937" />
          <circle cx="75" cy="45" r="8" fill="#1F2937" />
        </motion.svg>

        {/* Particle effects */}
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute bottom-1 left-0 w-1 h-1 bg-red-600 rounded-full"
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: -100, opacity: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "linear",
            }}
          />
        ))}

        {/* Loading text */}
        <motion.div
          className="absolute top-full left-0 right-0 text-center mt-4 text-white font-bold text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading...
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingAnimation;