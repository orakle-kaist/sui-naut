//import { useNavigate } from "react-router-dom";
import Header  from "../components/layout/Header";
import Footer  from "../components/layout/Footer";

import arrowIcon  from "../assets/images/arrow.png"
import astronautFloat  from "../assets/images/astronautFloat.png"

function Home() {
  //const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#62A1F8] to-[#103870]">
      <Header showConfetti={false} />

      <div className="flex-grow flex flex-col items-center justify-start pt-10">
        <h1 className="font-rajdhani text-white text-center text-9xl font-bold mb-12">The Suinaut</h1>
        <p className="font-rajdhani  text-white text-center text-[25.5px] font-bold mb-10 leading-relaxed">
          A Sui-based dApp challenge game inspired by Ethernaut.
          <br />
          Test your skills in Sui Move with fun and engaging challenges.
        </p>
        <div className="absolute -right-0 top-75">
          <img src={astronautFloat} alt="Floating Astronaut" className="w-[380px] h-[350px]  2xl:w-[450px] 2xl:h-[450px]"/>
        </div>
        <img src={arrowIcon} alt="arrow" className="w-8 h-5" />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
