import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Challenge_1 from "./Pages/Challenge_1";
import Challenge_2 from "./Pages/Challenge_2";
// import Challenge_3 from "./Pages/Challenge_3";
// import Challenge_4 from "./Pages/Challenge_4";
import { ConnectButton } from "@mysten/dapp-kit"; // DAppProvider 추가

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenge-1" element={<Challenge_1 />} />
        <Route path="/challenge-2" element={<Challenge_2 />} />
        {/* <Route path="/challenge-3" element={<Challenge_3 />} />
        <Route path="/challenge-4" element={<Challenge_4 />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

