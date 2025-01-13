import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Challenge from "./pages/Challenge";
import { challengeConfig } from "./config/challengeConfig";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {challengeConfig.map((props) => (
          <Route
            path={`/challenge/${props.packageId}`}
            element={<Challenge {...props} />}
            key={props.packageId}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
