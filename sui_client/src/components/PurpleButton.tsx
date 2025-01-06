import React from "react";

interface PurpleButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  text?: string;
}

const PurpleButton: React.FC<PurpleButtonProps> = ({ onClick, children, text }) => {
  return (
    <button
      onClick={onClick}
      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md border-2 border-white transition-transform transform hover:scale-105 hover:shadow-lg">
      {text || children}
    </button>
  );
};

export default PurpleButton;
