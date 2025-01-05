import React from 'react';
import suiLogo from "../../assets/images/sui_logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-white py-4 relative">
      <p className="text-center font-semibold">© 2024 Suinaut | Powered by KAIST Blockchain Research Society ORAKLE</p>
      <div className="absolute bottom-0 right-0 m-1">
        <img src={suiLogo} alt="sui_logo" className="w-8 h-8" />
      </div>
    </footer>
  );
};

export default Footer;