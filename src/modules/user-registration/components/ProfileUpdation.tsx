
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

interface ProfilePictureUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

const buttonStyles = `px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out ${montserrat.className}`;

const ErrorMessage = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-center text-red-500 text-xs mt-1"
  >
    <span>{message}</span>
  </motion.div>
);

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ value, onChange, error }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-4">
      <label className={`block text-sm font-medium text-gray-200 ${montserrat.className}`}>
        Profile Picture
      </label>
      <div className="mt-1 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={value ? 'image' : 'placeholder'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {value ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <Image
                  src={URL.createObjectURL(value)}
                  alt="Profile preview"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                <FaUser className="text-gray-600 text-4xl" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={handleClick}
          className={`${buttonStyles} ml-4 bg-gray-600 hover:bg-gray-700 focus:ring-gray-500`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {value ? 'Change' : 'Upload'}
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <AnimatePresence>
        {error && <ErrorMessage message={error} />}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePictureUpload;