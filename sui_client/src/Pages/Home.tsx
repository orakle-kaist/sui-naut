import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit"; // DAppProvider 추가
import { useAtom } from "jotai";
import { packageIdAtom } from "../atom";

function Home() {
  const navigate = useNavigate();
  const [packageId, setPackageId] = useAtom(packageIdAtom);

  return (
    <div className="bg-[#1E1E2F] text-white min-h-screen flex flex-col justify-center items-center text-center p-8">
      <h1 className="font-inter text-6xl font-bold mb-4">The Suinaut 🚀</h1>
      <div className="my-8 flex justify-center items-center flex-row">
        <ConnectButton /> 
        <input
          type="text"
          placeholder="Enter the published package ID"
          className="ml-4 p-2 text-black rounded"
          onChange={(e) => setPackageId(e.target.value)}
          value={packageId}
        />
      </div>
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
  );
}

export default Home;
