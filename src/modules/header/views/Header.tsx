// Header.tsx
'use client' 
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import NavItem from '../components/NavItem';
import UserMenu from '../components/UserMenu'
import NotificationComponent from '../components/Notification';
import { Notification } from '../types/types'; 
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../../../../public/logo/logos.png';
import { usePathname } from 'next/navigation';


const Header = () => { 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]); // State to store notifications
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null); 
  const router = useRouter();
  const pathname = usePathname();

  const isHomePage= pathname ==='/';
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }; 
    

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuVariants = {
    closed: { 
      opacity: 0,
      y: "-100%",
      transition: {
        y: { stiffness: 1000 }
      }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };


  const handleLogoClick=()=>{
    router.push('/')
  }

   return (
    <header className={`fixed w-full z-50 bg-black ${isHomePage ? 'bg-opacity-50' : ''} backdrop-blur-md`}>
      <div className="px-4 sm:px-6 lg:px-5 py-[7px]">
        {/* Main container with three sections */}
        <div className="flex justify-between items-center">
          {/* Left section - Logo */}
          <div className="relative w-[200px] hover:cursor-pointer"> {/* Fixed width for logo section */}
            <Image 
              src={logo}
              height={40}
              alt="Company Logo"
              onClick={handleLogoClick}
              priority
            />
          </div>

          {/* Center section - Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8 flex-1 justify-center">
            <NavItem href="fleet">Our Fleet</NavItem>
            <NavItem href="services">Services</NavItem>
            <NavItem href="about">About</NavItem>
            <NavItem href="contact">Contact</NavItem>
          </nav>

          {/* Right section - Book Now button and Icons */}
          <div className="flex items-center justify-end space-x-6 w-[200px]"> {/* Fixed width to match logo section */}
            <button className="hidden sm:block  text-white font-raleway italic hover:text-red-600 transition-colors duration-300">
              Book Now
            </button>
            
            <div className="flex items-center space-x-4">
              <NotificationComponent 
                notifications={notifications}
                isOpen={isNotificationOpen}
                setIsOpen={setIsNotificationOpen}
                markAsRead={markAsRead}
                ref={notificationRef}
              />

              <UserMenu 
                isOpen={isUserMenuOpen}
                setIsOpen={setIsUserMenuOpen}
              />

              <div className="lg:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                  {isMenuOpen ? (
                    <FaTimes className="text-white text-2xl cursor-pointer" />
                  ) : (
                    <FaBars className="text-white text-2xl cursor-pointer" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - AnimatePresence remains the same */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="lg:hidden bg-black bg-opacity-95 absolute top-full left-0 w-full overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              <NavItem href="#fleet" mobile>Our Fleet</NavItem>
              <NavItem href="#services" mobile>Services</NavItem>
              <NavItem href="#about" mobile>About</NavItem>
              <NavItem href="#contact" mobile>Contact</NavItem>
              <button className="sm:hidden bg-white text-sm font-medium hover:bg-red-600 hover:text-white transition-colors duration-300 w-full" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Book Now
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;