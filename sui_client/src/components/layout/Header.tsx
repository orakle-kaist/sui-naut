import React from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { ConnectButton } from "@mysten/dapp-kit";
import orakleLogo from "../../assets/images/orakle_logo.png";
import homeIcon from "../../assets/images/home.png";
import networkIcon from "../../assets/images/network.png";
import helpIcon from "../../assets/images/help.png";
import medalIcon from "../../assets/images/medal.png";

interface HeaderProps {
  showConfetti?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showConfetti }) => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const goKasist = () => {
    window.open(
      "https://www.orakle-kaist.xyz/en",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <header
      className="text-white w-full p-6 flex justify-between items-center relative"
      style={{ minHeight: "10vh" }}
      id="header"
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={document.documentElement.scrollHeight}
        />
      )}
      <div className="flex items-center gap-2">
        <img
          src={orakleLogo}
          alt="orakle_logo"
          className="w-11 h-11 cursor-pointer"
          onClick={goHome}
        />
        <span
          onClick={goKasist}
          className="text-white font-bold text-3xl cursor-pointer"
        >
          ORAKLE
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={goHome} className="text-white hover:text-white/80">
          <img src={homeIcon} alt="home_icon" className="w-6 h-6" />
        </button>
        {/* TODO: 네트워크 선택 기능 추가 */}
        <button className="text-white hover:text-white/80">
          <img src={networkIcon} alt="network_icon" className="w-6 h-6" />
        </button>
        {/* TODO: 도움말 페이지 연결 */}
        <button className="text-white hover:text-white/80">
          <img src={helpIcon} alt="help_icon" className="w-6 h-6" />
        </button>
        {/* TODO: 메달 페이지 또는 랭킹 구현 */}
        <button className="text-white hover:text-white/80">
          <img src={medalIcon} alt="medal_icon" className="w-6 h-6" />
        </button>
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
