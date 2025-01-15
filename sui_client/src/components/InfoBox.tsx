import React from "react";

interface InfoBoxProps {
  text: string;
  type?: "success" | "error";
}

const InfoBox: React.FC<InfoBoxProps> = ({ text, type }) => {
  return (
    <div
      className={`mb-8 p-4 rounded-lg text-center font-medium max-w-2xl ${type === "success" ? "bg-[#1E1E2F] text-[#22C55E]" : "bg-[#1E1E2F] text-[#EF4444]"}`}
    >
      {text}
    </div>
  );
};

export default InfoBox;
