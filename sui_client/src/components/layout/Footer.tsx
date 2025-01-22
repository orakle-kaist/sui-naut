import React from "react";
const suiLogo = "https://github.com/orakle-kaist/sui-naut-cdn/blob/main/images/sui_logo.png?raw=true";

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-white py-1 relative" id="footer">
      <p className="text-center font-semibold">
        © 2024 Suinaut | Powered by KAIST Blockchain Research Society ORAKLE
      </p>
      <div className="absolute bottom-0 right-0 m-1">
        <img src={suiLogo} alt="sui_logo" className="w-8 h-8" />
      </div>
    </footer>
  );
};

export default Footer;
