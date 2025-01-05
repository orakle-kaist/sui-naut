import React from "react";

interface ChallengeDescriptionProps {
  title?: string;
  text: string;
}

const ChallengeDescription: React.FC<ChallengeDescriptionProps> = ({ title, text }) => {
  return (
    <div className="text-center mb-10">
      {title && (
        <h1 className="text-4xl font-bold text-white mb-16">{title}</h1>
      )}
      <div className="bg-white/10 border border-white/20 p-4 rounded-lg shadow-md w-[700px] mx-auto h-[120px] flex items-center justify-center">
        <h3 className="text-xl font-semibold text-black">{text}</h3>
      </div>
    </div>
  );
};

export default ChallengeDescription;