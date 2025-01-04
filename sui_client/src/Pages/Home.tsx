import { useNavigate } from "react-router-dom";
import Header  from "../components/layout/Header";
import Footer  from "../components/layout/Footer";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#62A1F8] to-[#103870]">
      <Header showConfetti={false} />
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="font-inter text-6xl font-bold mb-4">The Suinaut 🚀</h1>
        <p className="font-inter text-xl mb-8 leading-relaxed">
          A Sui-based dApp challenge game inspired by Ethernaut.
          <br />
          Test your skills in Sui Move with fun and engaging challenges.
        </p>
        <div className="flex gap-6">
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md font-semibold transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg"
            onClick={() => navigate("/challenge-1")}
          >
            🔢 Challenge 1: Counter
          </button>

          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md font-semibold transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg"
            onClick={() => navigate("/challenge-2")}
          >
            💸 Challenge 2: FlashLoan
          </button>

          <div className="bg-gray-500 text-white px-4 py-2 rounded-md font-semibold">
            Coming Soon...
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
