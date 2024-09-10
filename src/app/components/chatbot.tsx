"use client"
import React, { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const ChatBotButton: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleButtonClick = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <div className="fixed bottom-8 right-8">
      {/* Circle button with toggleable icon */}
      <button
        className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none transition-colors duration-200 ease-in-out"
        onClick={handleButtonClick}
        aria-label={showInstructions ? 'Close instructions' : 'Open instructions'}
      >
        {showInstructions ? (
          <MdClose size={24} />
        ) : (
          <FaQuestionCircle size={24} />
        )}
      </button>

      {/* Instructions chat */}
      {showInstructions && (
        <div className="absolute bottom-16 right-0 mt-2 w-64 bg-white text-gray-800 dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-4 border border-gray-300 dark:border-gray-700">
          <h4 className="font-semibold mb-2">Quick Instructions:</h4>
          <p className="text-sm mb-1">Press <strong>R</strong> to open the reply box.</p>
          <p className="text-sm">Press <strong>D</strong> to delete the item.</p>
        </div>
      )}
    </div>
  );
};

export default ChatBotButton;
