import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Heading, Button, Flex } from "@radix-ui/themes";
import { buttonBaseStyle, buttonHoverStyle, buttonDefaultStyle } from "../styles/buttonStyles";
import { ConnectButton } from "@mysten/dapp-kit"; // DAppProvider 추가


function Home() {
  const navigate = useNavigate();

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
      <ConnectButton /> {/* 상단에 지갑 연결 UI 추가 */}
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
        <Button
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
        </Button>

        <Button
          style={buttonBaseStyle}
          onMouseOver={(e) => {
            Object.assign(e.currentTarget.style, buttonHoverStyle);
          }}
          onMouseOut={(e) => {
            Object.assign(e.currentTarget.style, buttonDefaultStyle);
          }}
          onClick={() => navigate("/challenge-2")}
        >
          🧮 Challenge 2: babyMath
        </Button>

        <Button
          style={buttonBaseStyle}
          onMouseOver={(e) => {
            Object.assign(e.currentTarget.style, buttonHoverStyle);
          }}
          onMouseOut={(e) => {
            Object.assign(e.currentTarget.style, buttonDefaultStyle);
          }}
          onClick={() => navigate("/challenge-3")}
        >
          📈 Challenge 3: flashLoan
        </Button>

        <Button
          style={buttonBaseStyle}
          onMouseOver={(e) => {
            Object.assign(e.currentTarget.style, buttonHoverStyle);
          }}
          onMouseOut={(e) => {
            Object.assign(e.currentTarget.style, buttonDefaultStyle);
          }}
          onClick={() => navigate("/challenge-4")}
        >
          🧨 Challenge 4: Bomb
        </Button>
      </Flex>
    </Container>
  );
}

export default Home;

