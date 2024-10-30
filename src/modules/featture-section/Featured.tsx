// components/FeaturedVehicles.tsx
'use client'
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { FaCar, FaCogs, FaTachometerAlt, FaArrowRight } from 'react-icons/fa';

interface Car {
  id: number;
  name: string;
  image: string;
  type: string;
  transmission: string;
  topSpeed: string;
}

const featuredCars: Car[] = [
  {
    id: 1,
    name: "Lamborghini Aventador",
    image: "/images/car.png",
    type: "Sports Car",
    transmission: "Automatic",
    topSpeed: "350 km/h",
  },
  {
    id: 2,
    name: "Rolls-Royce Phantom",
    image: "/images/car.png",
    type: "Luxury Sedan",
    transmission: "Automatic",
    topSpeed: "250 km/h",
  },
  {
    id: 3,
    name: "Tesla Model S Plaid",
    image: "/images/car.png",
    type: "Electric Sedan",
    transmission: "Automatic",
    topSpeed: "322 km/h",
  },
];

const FeaturedVehicles: React.FC = () => {
 
  const [hoveredCar, setHoveredCar] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    controls.start({ y: scrollY * 0.5 });
  }, [scrollY, controls]);

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Experience Luxury on Wheels
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car, index) => (
            <motion.div 
              key={car.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-2xl flex flex-col"
              style={{ height: '100%' }}
              onMouseEnter={() => setHoveredCar(car.id)}
              onMouseLeave={() => setHoveredCar(null)}
            >
              <div className="relative h-48 md:h-60">
                <Image 
                  src={car.image} 
                  alt={car.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-125"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 hover:opacity-0" />
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{car.name}</h3>
                  <div className="flex items-center text-gray-300 mb-2">
                    <FaCar className="mr-2" />
                    <span>{car.type}</span>
                  </div>
                  <div className="flex items-center text-gray-300 mb-2">
                    <FaCogs className="mr-2" />
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <FaTachometerAlt className="mr-2" />
                    <span>{car.topSpeed}</span>
                  </div>
                </div>
                <div className="mt-2 h-10"> {/* Fixed height container for the button */}
                  <AnimatePresence>
                    {hoveredCar === car.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <button className="text-red-500 hover:text-white transition-colors duration-300 flex items-center">
                          Learn More <FaArrowRight className="ml-2" />
                        </button> 
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button 
            className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-white hover:text-red-600 transition-all duration-300 ease-in-out"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Our Full Fleet
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;