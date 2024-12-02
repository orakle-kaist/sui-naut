import React from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit"; // DAppProvider 추가

function Challenge_4() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#FFFFFF",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <button
        onClick={goHome}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "10px 15px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.15)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)";
        }}
      >
        🏠 Home
      </button>

      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#FFF" }}>
        📝 Challenge_4 Page
      </h1>
      <ConnectButton /> {/* 상단에 지갑 연결 UI 추가 */}

      <pre
        style={{
          backgroundColor: "#1E1E2F",
          padding: "1.5rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "800px",
          lineHeight: "1.6",
          overflowX: "auto",
          fontFamily: "'Fira Code', monospace",
          color: "#AAB2D0",
          fontSize: "12px",
        }}
      >
        {
          `
    module 0x0::Challenge_4 {
    use sui:: object:: { Self, UID };
    use sui:: tx_context:: { Self, TxContext };
    use sui:: transfer;

    /// Challenge_4 Struct
    struct Challenge_4 has key {
        id: UID,
        value: u64,
    }

    /// No-op function
    entry fun do_nothing() {
        // No operation performed
    }
  }
  `
        }
      </pre>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button
          disabled
          style={{
            backgroundColor: "#6C63FF",
            color: "#FFF",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "600",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "not-allowed",
            opacity: 0.6,
          }}
        >
          Challenge_4 Button 1
        </button>
        <button
          disabled
          style={{
            backgroundColor: "#6C63FF",
            color: "#FFF",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "600",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "not-allowed",
            opacity: 0.6,
          }}
        >
          Challenge_4 Button 2
        </button>
      </div>

      <div
        style={{
          marginTop: "2rem",
          backgroundColor: "#1E1E2F",
          color: "#AAB2D0",
          padding: "1rem",
          borderRadius: "8px",
          textAlign: "center",
          fontWeight: "500",
          maxWidth: "800px",
        }}
      >
        This is a dummy page. No functionality here.
      </div>
    </div>
  );
}

export default Challenge_4;
