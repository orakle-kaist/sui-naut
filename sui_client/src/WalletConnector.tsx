import React from "react";
import { useWallet } from "@mysten/dapp-kit";

function WalletConnector() {
  const { connect, disconnect, accounts } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
      console.log("Wallet connected:", accounts);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    console.log("Wallet disconnected");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      {accounts && accounts.length > 0 ? (
        <>
          <span
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.875rem",
            }}
          >
            Connected: {accounts[0]}
          </span>
          <button
            onClick={handleDisconnect}
            style={{
              backgroundColor: "#FF5C5C",
              color: "#FFFFFF",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={handleConnect}
          style={{
            backgroundColor: "#6C63FF",
            color: "#FFFFFF",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default WalletConnector;

