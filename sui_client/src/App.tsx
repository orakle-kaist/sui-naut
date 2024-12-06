import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Challenge_1 from "./Pages/Challenge_1";
import Challenge_2 from "./Pages/Challenge_2";
<<<<<<< HEAD
import { ConnectButton } from "@mysten/dapp-kit"; // DAppProvider 추가
=======
>>>>>>> 41279e88fe766338df7c0a0ac7ec13181352a135

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenge-1" element={<Challenge_1 />} />
        <Route path="/challenge-2" element={<Challenge_2 />} />
      </Routes>
    </Router>
  );
}

export default App;
