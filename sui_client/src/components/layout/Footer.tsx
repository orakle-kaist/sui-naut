import React from 'react';
import suiLogo from "../../assets/images/sui_logo.png";

const Footer: React.FC = () => {
    return (
        <footer className="container mx-auto px-4 py-2 text-center text-white  font-semibold relative font-sans">
            <p>© 2024 Suinaut | Powered by KAIST Blockchain Research Society ORAKLE</p>
            <div className="fixed bottom-0 right-0 m-3">
                <img src={suiLogo} alt="sui_logo" className="w-8 h-8" />
            </div>
        </footer>
    );
};

export default Footer;

