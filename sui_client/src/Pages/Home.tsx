import { useNavigate } from "react-router-dom";
import { Container, Heading, Flex } from "@radix-ui/themes";
import {
  buttonBaseStyle,
  buttonHoverStyle,
  buttonDefaultStyle,
} from "../styles/buttonStyles";
import { ConnectButton } from "@mysten/dapp-kit"; // DAppProvider 추가
import { useAtom } from "jotai";
import { packageIdAtom } from "../atom";

function Home() {
  const navigate = useNavigate();
  const [packageId, setPackageId] = useAtom(packageIdAtom);

  return (
    <Container
      style={{
        backgroundColor: "#1E1E2F",
        color: "#FFFFFF",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Heading
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        The Suinaut 🚀
      </Heading>
      <div
        style={{
          margin: "2rem 0",
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <ConnectButton /> {/* TODO: 상단에 지갑 연결 UI 추가 */}
        <input
          type="text"
          placeholder="Enter the published package ID"
          style={{ marginLeft: "1rem" }}
          onChange={(e) => setPackageId(e.target.value)}
          value={packageId}
        />
      </div>
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "1.25rem",
          marginBottom: "2rem",
          lineHeight: "1.6",
        }}
      >
        A Sui-based dApp challenge game inspired by Ethernaut.
        <br />
        Test your skills in Sui Move with fun and engaging challenges.
      </p>
      <Flex
        style={{
          gap: "1.5rem",
        }}
      >
        <button
          style={buttonBaseStyle}
          onMouseOver={(e) => {
            Object.assign(e.currentTarget.style, buttonHoverStyle);
          }}
          onMouseOut={(e) => {
            Object.assign(e.currentTarget.style, buttonDefaultStyle);
          }}
          onClick={() => navigate("/challenge-1")}
        >
          🔢 Challenge 1: Counter
        </button>

        <button
          style={buttonBaseStyle}
          onMouseOver={(e) => {
            Object.assign(e.currentTarget.style, buttonHoverStyle);
          }}
          onMouseOut={(e) => {
            Object.assign(e.currentTarget.style, buttonDefaultStyle);
          }}
          onClick={() => navigate("/challenge-2")}
        >
          💸 Challenge 2: FlashLoan
        </button>

        <div style={buttonBaseStyle}>Coming Soon...</div>
      </Flex>
    </Container>
  );
}

export default Home;
