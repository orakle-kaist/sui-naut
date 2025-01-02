import React from "react";

interface InfoBoxProps {
  text: string;
  type?: "success" | "error";
}

const InfoBox: React.FC<InfoBoxProps> = ({ text, type }) => {
  const bgColor = type === "success" ? "#1E1E2F" : "#1E1E2F";
  const textColor = type === "success" ? "#22C55E" : "#EF4444";

  return (
    <div
      style={{
        marginTop: "2rem",
        backgroundColor: bgColor,
        color: textColor,
        padding: "1rem",
        borderRadius: "8px",
        textAlign: "center",
        fontWeight: "500",
        maxWidth: "800px",
      }}
    >
      {text}
    </div>
  );
};

export default InfoBox;
