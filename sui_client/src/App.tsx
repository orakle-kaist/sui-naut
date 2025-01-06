import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Challenge_1 from "./Pages/Challenge_1";
import Challenge_2 from "./Pages/Challenge_2";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenge_1" element={<Challenge_1 />} />
        <Route path="/challenge_2" element={<Challenge_2 />} />
      </Routes>
    </Router>
  );
}

export default App;
