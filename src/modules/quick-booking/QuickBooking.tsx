// components/QuickBooking.tsx
'use client'
import React, { useState, useEffect,useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaCalendar, FaMapMarkerAlt, FaCar, FaClock} from 'react-icons/fa';
import Image from 'next/image';
import { Playfair_Display, Roboto } from 'next/font/google';

const playfair = Playfair_Display({
    subsets: ['latin'],
    display: 'swap',
  });
  
  const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
  });
const QuickBooking: React.FC = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [sameLocation, setSameLocation] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const luxuryCarImages = [
    '/images/car.png',
    '/images/luxury.jpg',
    '/images/car.png',
    '/images/car.png',
  ]
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % luxuryCarImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', {
      pickupLocation,
      dropoffLocation: sameLocation ? pickupLocation : dropoffLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      vehicleType
    });
  };


  return (
    <section ref={sectionRef} className={`py-16 md:py-24 relative overflow-hidden ${roboto.className}`}>
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-yellow-900/30 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2  
          initial={{ y: -20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-500 to-yellow-500 mb-8 text-center ${playfair.className}`}
        >
          Elevate Your Journey
        </motion.h2>
        
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-1/2 mb-8 lg:mb-0"
          >
            <div className="relative w-full h-[300px] lg:h-[400px] rounded-lg overflow-hidden shadow-2xl">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={luxuryCarImages[currentImageIndex]}
                    alt="Luxury Car"
                    layout="fill"
                    objectFit="cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-semibold mb-2">Experience Luxury</h3>
                <p className="text-sm">Choose from our premium selection of high-end vehicles</p>
              </div>
            </div>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit}
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full lg:w-1/2   lg:m-10   bg-gradient-to-br from-gray-900 to-black p-6 md:p-8 rounded-lg shadow-2xl border border-red-900"
          >
            <div className="mb-2">
              <label className="text-white text-base  mb-2 block font-medium">Pickup and Return</label>
              <div className="flex items-center space-x-4 bg-gray-800 p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => setSameLocation(true)}
                  className={`flex-1 py-2 px-4 rounded-full text-sm md:text-base transition-all duration-300 ${sameLocation ? 'bg-gradient-to-r from-red-700 to-red-900 text-white shadow-lg' : 'text-gray-400'}`}
                >
                  Same Location
                </button>
                <button
                  type="button"
                  onClick={() => setSameLocation(false)}
                  className={`flex-1 py-2 px-4 rounded-full text-sm md:text-base transition-all duration-300 ${!sameLocation ? 'bg-gradient-to-r from-red-700 to-red-900 text-white shadow-lg' : 'text-gray-400'}`}
                >
                  Different Locations
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3">
              <InputField
                icon={<FaMapMarkerAlt />}
                id="pickup-location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter pickup location"
                label="Pickup Location"
              />
              <AnimatePresence>
                {!sameLocation && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InputField
                      icon={<FaMapMarkerAlt />}
                      id="dropoff-location"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      placeholder="Enter dropoff location"
                      label="Dropoff Location"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <InputField
                icon={<FaCalendar />}
                id="pickup-date"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                label="Pickup Date"
              />
              <InputField
                icon={<FaClock />}
                id="pickup-time"
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                label="Pickup Time"
              />
              <InputField
                icon={<FaCalendar />}
                id="return-date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                label="Return Date"
              />
              <InputField
                icon={<FaClock />}
                id="return-time"
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                label="Return Time"
              />
             
            </div>
            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(220,38,38,0.5)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white px-5 py-3 rounded-full text-sm font-semibold hover:from-red-800 hover:to-red-800 transition-all duration-300"
              >
                Reserve Your Luxury Experience
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

interface InputFieldProps {
  icon: React.ReactNode;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ icon, id, value, onChange, placeholder, label, type = "text" }) => (
  <div>
    <label htmlFor={id} className="block text-white mb-2 text-sm font-medium">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500">
        {icon}
      </div>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-800 text-white border-2 border-gray-700 rounded-md py-2 pl-9 pr-4 focus:outline-none focus:border-red-500 transition-colors duration-300"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default QuickBooking;