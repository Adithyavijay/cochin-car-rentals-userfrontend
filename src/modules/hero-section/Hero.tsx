// components/HeroSection.tsx
'use client'
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import backgroundImage from '../../../public/images/backgroundImage.jpg'

const HeroSection = () => {
  // Animation variants for the heading
  const headingVariants = {
    hidden: { 
      x: -100, // Start from left
      opacity: 0 
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for the subheading
  const subHeadingVariants = {
    hidden: { 
      x: 100, // Start from right
      opacity: 0 
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2 // Slight delay after the heading
      }
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Luxury Car"
          fill
          priority
          className="object-cover object-top"
          quality={100}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center">
        <div className="mt-[140px] px-4 md:px-0 max-w-[800px] mx-auto text-center">
          {/* Main Heading with Gradient and Motion */}
          <motion.h1 
            className="text-4xl md:text-3xl font-bold mb-1 font-raleway italic"
            initial="hidden"
            animate="visible"
            variants={headingVariants}
          >
            <span className="bg-gradient-to-r from-[#FD6A6A] to-white text-transparent bg-clip-text">
              Luxury driven to Perfection
            </span>
          </motion.h1>

          {/* Subheading with Motion */}
          <motion.p 
            className="text-white text-lg md:text-lg max-w-[400px] mx-auto font-thin"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            initial="hidden"
            animate="visible"
            variants={subHeadingVariants}
          >
            Experience unparalleled elegance and performance with our premium rental fleet
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;