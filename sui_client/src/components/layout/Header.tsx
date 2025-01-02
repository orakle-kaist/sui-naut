import React from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
//import images
import orakleLogo   from "../../assets/images/orakle_logo.png";
import homeIcon     from "../../assets/images/home.png";
import networkIcon  from "../../assets/images/network.png";
import helpIcon     from "../../assets/images/help.png";
import medalIcon    from "../../assets/images/medal.png";

interface HeaderProps {
  showConfetti?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showConfetti }) => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <header className="bg-[#121212] text-white w-full p-6 flex justify-between items-center relative" style={{ minHeight: "10vh" }}>
      {showConfetti && ( 
        <Confetti 
        width={window.innerWidth} 
        height={window.innerHeight} 
        gravity={1} /> )}
      <div className="flex items-center gap-2">
        <img src={orakleLogo} alt="orakle_logo" className="w-9 h-9" />
        <a
        onClick={goHome}
        className="text-white font-bold text-2xl"
        >
        ORAKLE
        </a>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-white hover:text-white/80">
          <img src={homeIcon} alt="home_icon" className="w-6 h-6" />
        </button>
        <button className="text-white hover:text-white/80">
          <img src={networkIcon} alt="network_icon" className="w-6 h-6" />
        </button>
        <button className="text-white hover:text-white/80">
          <img src={helpIcon} alt="help_icon" className="w-6 h-6" />
        </button>
        <button className="text-white hover:text-white/80">
          <img src={medalIcon} alt="medal_icon" className="w-6 h-6" />
        </button>
        <button className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-md">
          Connect Wallet
        </button>
      </div>
    </header>
  );
};

export default Header;