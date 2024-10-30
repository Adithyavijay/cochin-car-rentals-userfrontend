// NavItem.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItemProps } from '../types/types';

const NavItem: React.FC<NavItemProps> = ({ href, children, mobile = false }) => {
  const pathname = usePathname();
  const MotionLink = motion(Link);

  // Check if the link is active
  const isActive = pathname === href;

  // For handling anchor links
  const isActiveAnchor = pathname === '/' + href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <MotionLink
      href={href}
      onClick={handleClick}
      className={`
        relative 
        text-white 
        hover:text-red-600 
        transition-colors 
        duration-300 
        group
        ${mobile ? 'text-lg' : ''}
        ${isActive ? 'text-red-600' : ''}

      `}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      {/* Underline element */}
      <span
        className={`
          absolute 
          -bottom-1 
          left-0 
          w-full 
          h-0.5 
          bg-red-600
          transform 
          origin-left
          transition-transform 
          duration-300
          ${(isActive || isActiveAnchor) ? 'scale-x-100' : 'scale-x-0'}
          group-hover:scale-x-100
        `}
      />
    </MotionLink>
  );
};

export default NavItem;