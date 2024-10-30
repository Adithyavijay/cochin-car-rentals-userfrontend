// UserMenu.tsx
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaUser } from 'react-icons/fa';
import { UserMenuItemProps } from '../types/types';
import { Montserrat, Poppins } from 'next/font/google';
import  { userAtom } from '@/atoms/userAtom';
import {useRecoilValue} from 'recoil';
import Image from 'next/image';
import { useState } from 'react';
import UserProfileModal from '@/modules/user-profile/views/UserProfile';

// Load fonts
const montserrat = Montserrat({ subsets: ['latin'] });
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'] });

const userMenuVariants = {
  closed: { 
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  },
  open: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2
    }
  }
};

const UserMenuItem: React.FC<UserMenuItemProps> = ({ href, icon, children ,onClick }) =>  (
  <Link href={href || '#'} onClick={onClick} className={`px-4 py-3 text-sm text-white hover:bg-white hover:bg-opacity-10 flex items-center transition-colors duration-300 ${montserrat.className}`}>
    <span className="mr-3 text-red-500">{icon}</span>
    {children}
  </Link>
);

interface UserMenuProps {
 
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const UserMenu: React.FC<UserMenuProps> = ({  isOpen, setIsOpen }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const user= useRecoilValue(userAtom)
  const [isProfileModalOpen,setIsProfileModalOpen]=useState<boolean>(false)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

  const handleProfileClick=()=>{
    setIsOpen(false)
    setIsProfileModalOpen(true)
  }

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }} 
        className="text-white text-xl sm:text-2xl cursor-pointer hover:text-red-600 transition-colors duration-300 mr-4 sm:mr-0"
      >
         {user && user.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
         <FaUserCircle style={{ width: '23px', height: '23px' }}   />
        )}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={userMenuVariants}

            className={`absolute right-0 mt-2 w-64 rounded-lg shadow-2xl overflow-hidden ${poppins.className}`}
            style={{
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="px-4 py-3 border-b border-white border-opacity-20">
              <p className="text-white text-sm font-semibold">
                  {user ? `Welcome, ${user.name}!` : 'Hello, Guest!'}
              </p>
            </div>
            {user ? (
              <>
                <UserMenuItem href="#" icon={<FaUser />} onClick={handleProfileClick} >Profile</UserMenuItem>
                <UserMenuItem href="/logout" icon={<FaSignInAlt />}>Logout</UserMenuItem>
              </>
            ) : (
              <>
                <UserMenuItem href="/login" icon={<FaSignInAlt />}>Login</UserMenuItem>
                <UserMenuItem href="/register" icon={<FaUserPlus />}>Register</UserMenuItem>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
        { isProfileModalOpen && <UserProfileModal isOpen={isProfileModalOpen} onClose={()=>setIsProfileModalOpen(false)}/>}
    </div>
  );
};

export default UserMenu;