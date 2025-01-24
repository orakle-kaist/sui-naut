import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Challenge from "./pages/Challenge";
import { challengeConfig } from "./config/challengeConfig";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {challengeConfig
          .filter(({ packageId }) => packageId)
          .map((props) => (
            <Route
              path={`/challenge/${props.packageId}`}
              element={<Challenge {...props} />}
              key={props.packageId}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
