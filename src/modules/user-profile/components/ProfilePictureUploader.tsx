import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { UPLOAD_PROFILE_IMAGE } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/atoms/userAtom';
import { UserDetails } from '../types/types';
import { FiEdit2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfilePictureUploaderProps {
  name: string;
  currentPicture: string;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({ currentPicture, name }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadProfilePicture] = useMutation(UPLOAD_PROFILE_IMAGE);
  const [user, setUser] = useRecoilState<UserDetails>(userAtom);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl) return;

    try {
      const file = await fetch(previewUrl).then(r => r.blob());
      const { data } = await uploadProfilePicture({ variables: { file } });
      if (data?.uploadProfilePicture?.profilePicture) {
        setUser((prev) => ({ ...prev, profilePicture: data.uploadProfilePicture.profilePicture }));
        toast.success('Profile picture updated successfully');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-32 h-32">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-red-600 shadow-lg">
          {currentPicture ? (
            <Image
              src={currentPicture}
              alt="Profile Picture"
              layout="fill"
              objectFit="cover"
              
            />
          ) : (
            <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-4xl font-bold">
              {/* {getInitials(name)} */}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full shadow-md hover:bg-red-700 transition-colors duration-200"
          style={{ transform: 'translate(25%, 25%)' }}
        >
          <FiEdit2 className="text-white" size={16} />
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 p-6 rounded-lg max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 text-white">Update Profile Picture</h2>
              <div className="mb-4">
                <div className="w-40 h-40 mx-auto relative rounded-full overflow-hidden border-4 border-red-600">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : currentPicture ? (
                    <Image
                      src={currentPicture}
                      alt="Current Profile Picture"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-4xl font-bold">
                      {getInitials(name)}
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="mb-4 text-white"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!previewUrl}
                  className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 ${
                    !previewUrl && 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Upload
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePictureUploader;