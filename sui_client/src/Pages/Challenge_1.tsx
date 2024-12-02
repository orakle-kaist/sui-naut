import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignAndExecuteTransaction, useAccounts } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { parseTransactionEffects } from "../utils";
import { ConnectButton } from "@mysten/dapp-kit"; // DAppProvider 추가

function Challenge_1() {
  const accounts = useAccounts();
  const navigate = useNavigate();

  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [message, setMessage] = useState<string | null>(null);

  const goHome = () => {
    navigate("/");
  };

  const PACKAGE = "0x53fb0bdca605ba3883d72f012ffd07022501c9db0f58376829918a7317c12f1b";

  const createCounter = async () => {
    if (!accounts || accounts.length === 0) {
      setMessage("Please connect your wallet.");
      return;
    }

    // Step 4: 테스트 및 결과 확인
    const sampleBase64 =
      "AQD2AAAAAAAAAEBCDwAAAAAAcNUjAAAAAADI7A4AAAAAAJgmAAAAAAAAIEnTgvn0NQv9Q/r5wS7CRxY4z6S1gSwn3cx6b2a9TkxxAQAAAAAAAiAwn3PXoslObtFFsBYxY4PO8VH/PmtRkEm0DvaBx4iJZCCELzYturLfVALfO7w6gmRapm3Ic+KAP8c1dluhWf71giwAAAAAAAAAAgf0uSCJorZZ+oCYNwZSaGKHd0LCM1JSKPCBfihPLFjbASsAAAAAAAAAID9NJ6Ram8OcsQCmNTuIV3d2nmaaQHIHdDvwCCnnrvr2ALMIeYehdp+oU/XSvd6tZBTKSw9/F8H4kyk373QQ3LvFASA7whNFu06hRmhIyvlQtJmq+a4/xMsDwBUqMwoyNKAX3wCzCHmHoXafqFP10r3erWQUyksPfxfB+JMpN+90ENy7xQBYJN3UQejHe5atEjVswgobtABYW843qs37CE+/uwCo7QABIMcuElcLnHYCVbk0FVs2DaXBJ/hVydNpJjLxBwaGXxKcALMIeYehdp+oU/XSvd6tZBTKSw9/F8H4kyk373QQ3LvFAQAA";
    const result = parseTransactionEffects(sampleBase64);
    console.log(result);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE}::Counter::create_object`,
        arguments: [],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
        chain: "sui:localnet",
      });

      console.log(result);

      const newCounterId = result.effects?.created?.[0]?.reference?.objectId;

      setMessage(
        newCounterId
          ? `Counter created successfully! ID: ${newCounterId} `
          : "Failed to create Counter."
      );
    } catch (error) {
      setMessage("Transaction failed.");
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
        🔢 Challenge 1: Counter Management
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
          fontSize: "12px"
        }}
      >
        {
          `
    module 0x0::Counter {
    use sui:: object:: { Self, UID };
    use sui:: tx_context:: { Self, TxContext };
    use sui:: transfer;
    use sui:: event;

    /// Counter Struct
    struct Counter has key {
        id: UID,
          count: u64,
    }

    /// Event to emit the counter value
    struct CountEvent has copy, drop {
        value: u64,
    }

    /// Increment the counter
    entry fun increment(counter: & mut Counter) {
        counter.count = counter.count + 1;
      }

    /// Get the current counter value (emit an event)
    entry fun get_count(counter: & Counter, _ctx: & TxContext) {
        event:: emit(CountEvent { value: counter.count });
      }

    /// Event emitted for validation success
    struct ValidationEvent has copy, drop {
        message: vector<u8>, // Example message like "pass"
    }

    /// Create a new Counter object and transfer ownership to the sender
    entry fun create_object(ctx: & mut TxContext) {
        let counter = Counter {
          id: object:: new(ctx),
            count: 0,
        };
      transfer:: transfer(counter, tx_context:: sender(ctx));
    }

    /// Validate the Counter object
    entry fun validate_object(counter: & Counter, _ctx: & TxContext) {
      if (counter.count > 5) {
        event:: emit(ValidationEvent { message: b"pass" });
      } else {
        event:: emit(ValidationEvent { message: b"fail, count must be greater than 5" });
        /*
        abort 1 // Validation failed
        */
      }
    }
  }
  `
        }
      </pre>

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
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          Create Counter
        </button>
      </div>

      {message && (
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "#1E1E2F",
            color: message.includes("successfully") ? "#A3E635" : "#F7768E",
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
