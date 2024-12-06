import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useSignAndExecuteTransaction,
  useAccounts,
  useSuiClient,
  ConnectButton,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Confetti from "react-confetti";
import { useAtomValue } from "jotai";
import { packageIdAtom } from "../atom";

function Challenge_1() {
  const accounts = useAccounts();
  const navigate = useNavigate();
  const client = useSuiClient();
  const packageId = useAtomValue(packageIdAtom);

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showRawEffects: true,
            showObjectChanges: true,
          },
        }),
    });

  const [message, setMessage] = useState<string | null>(null);
  const [counterId, setCounterId] = useState<string | null>(null); // Counter ID 저장
  const [showConfetti, setShowConfetti] = useState(false); // 폭죽 효과 상태

  const goHome = () => {
    navigate("/");
  };

  const createCounter = async () => {
    if (!accounts || accounts.length === 0) {
      setMessage("Please connect your wallet.");
      return;
    }

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::Counter::create_object`,
        arguments: [],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx as any,
        chain: "sui:localnet",
      });

      console.log(result);

      const newCounterId = result.objectChanges?.find(
        (change) => change.type === "created",
      )?.objectId;

      if (newCounterId) {
        setCounterId(newCounterId);
        setMessage(`Counter created successfully! ID: ${newCounterId}`);
      } else {
        setMessage("Failed to create Counter.");
      }
    } catch (error) {
      setMessage("Transaction failed.");
      console.error(error);
    }
  };

  const validateObject = async () => {
    if (!accounts || accounts.length === 0) {
      setMessage("Please connect your wallet.");
      return;
    }

    if (!counterId) {
      setMessage("No Counter ID available to validate.");
      return;
    }

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::Counter::validate_object`,
        arguments: [tx.object(counterId)], // Counter ID를 인자로 전달
      });

      await signAndExecuteTransaction({
        transaction: tx as any,
        chain: "sui:localnet",
      });

      setMessage("Validation complete!"); // 성공 메시지
      setShowConfetti(true); // 폭죽 효과 시작
      setTimeout(() => setShowConfetti(false), 3000); // 3초 후 폭죽 제거
    } catch (error) {
      setMessage("Validation failed.");
      console.error(error);
    }
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
        position: "relative",
      }}
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          gravity={1}
        />
      )}
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
        🔢 Challenge 1: Counter Management
      </h1>
      <ConnectButton />
      <h3 style={{ marginTop: "1rem", color: "#A3E635" }}>
        Try to count more than 2 times.
      </h3>
      <div
        style={{
          backgroundColor: "#1E1E2F",
          padding: "1.5rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "800px",
          fontFamily: "'Fira Code', monospace",
        }}
      >
        <SyntaxHighlighter language="rust" style={tomorrow}>
          {`module 0x0::Counter {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;

    struct Counter has key {
        id: UID,
        count: u64,
    }

    struct CountEvent has copy, drop {
        value: u64,
    }

    entry fun increment(counter: &mut Counter) {
        counter.count = counter.count + 1;
    }

    entry fun get_count(counter: &Counter, _ctx: &TxContext) {
        event::emit(CountEvent { value: counter.count });
    }

    entry fun create_object(ctx: &mut TxContext) {
        let counter = Counter {
            id: object::new(ctx),
            count: 0,
        };
        transfer::transfer(counter, tx_context::sender(ctx));
    }

    entry fun validate_object(counter: &Counter, _ctx: &TxContext) {
        if (counter.count > 2) {
            event::emit(CountEvent { value: counter.count });
        }
    }
}`}
        </SyntaxHighlighter>
      </div>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={createCounter}
          style={{
            backgroundColor: "#6C63FF",
            color: "#FFF",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "600",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          Create Counter
        </button>
        <button
          onClick={validateObject}
          style={{
            backgroundColor: "#FF6347",
            color: "#FFF",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "600",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          Submit Challenge
        </button>
      </div>
      {message && (
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "#1E1E2F",
            color: message === "Validation complete!" ? "#A3E635" : "#F7768E",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "500",
            maxWidth: "800px",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default Challenge_1;
