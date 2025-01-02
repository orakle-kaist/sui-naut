import React from "react";

interface ChallengeDescriptionProps {
  text: string;
}

const ChallengeDescription: React.FC<ChallengeDescriptionProps> = ({ text }) => {
  return (
    <h3 className="text-2xl mt-4 font-bold text-green-400 text-center">
      {text}
    </h3>
  );
};

export default ChallengeDescription;