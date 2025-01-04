import React from "react";

interface ChallengeDescriptionProps {
  title?: string;
  text: string;
}

const ChallengeDescription: React.FC<ChallengeDescriptionProps> = ({ title, text }) => {
  return (
    <div className="text-center mb-4">
      {title && <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>}
      <h3 className="text-2xl mt-4 font-bold text-[#1E1E2F]">{text}</h3>
    </div>
  );
};

export default ChallengeDescription;