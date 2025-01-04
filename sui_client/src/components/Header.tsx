import React from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

interface HeaderProps {
  title: string;
  showConfetti?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showConfetti }) => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div
      className="bg-[#121212] text-white w-full p-6 flex flex-col items-center relative"
      style={{ minHeight: "10vh" }}
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          gravity={1}
        />
      )}
      <button
        onClick={goHome}
        className="absolute top-2.5 left-2.5 px-4 py-2 text-lg bg-green-500 text-white rounded cursor-pointer shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
      >
        🏠 Home
      </button>
      <h1 className="text-4xl font-bold text-center mt-4">{title}</h1>
    </div>
  );
};

export default Header;