import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditableFieldProps {
  label: string;
  value: string;
  field: string;
  onSave: (field: string, newValue: string) => void;
  maxLength?: number;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, field, onSave, maxLength }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value); 
  const handleSave = () => {
    onSave(field, editedValue);
    setIsEditing(false);
  }; 
  
  useEffect(()=>{
    setEditedValue(value)
  },[value])
  
  return (
    <>
      <div 
        className=" bg-gray-800  rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors duration-200 "
        onClick={() => setIsEditing(true)}
      >
            <p className="text-sm text-red-500 mb-1">{label}</p>
            <p className="text-white">{value}</p>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2"
            onClick={() => setIsEditing(false)}
          >
             <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"></div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Edit {label}</h2>
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 rounded mb-2"
                maxLength={maxLength}
                autoFocus
              />
              {maxLength && (
                <p className="text-sm text-gray-400 mb-4">
                  {editedValue.length}/{maxLength} characters
                </p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditableField;