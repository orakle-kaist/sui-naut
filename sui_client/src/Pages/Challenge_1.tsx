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
    <div className="bg-[#121212] 
                    text-white 
                    min-h-screen 
                    flex flex-col 
                    items-center 
                    justify-center 
                    p-8 relative 
                    font-inter">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          gravity={1}
        />
      )}
      <button
        onClick={goHome}
        className="absolute 
                    top-2.5 
                    left-2.5 
                    px-4 
                    py-2 
                    text-lg 
                    bg-green-500
                    text-white 
                    rounded 
                    cursor-pointer 
                    shadow-md 
                    transition-transform 
                    transform 
                    hover:scale-105 
                    hover:shadow-lg"
      >
        🏠 Home
      </button>
      <h1 className="text-4xl mb-4 font-bold">🔢 Challenge 1: Counter Management</h1>
      <ConnectButton />
      <h3 className="text-2xl mt-4 font-bold text-green-400">
        Try to count more than 2 times.
      </h3>
      <div className="bg-[#1E1E2F] p-6 rounded-lg w-full max-w-4xl font-firaCode">
        <SyntaxHighlighter language="rust" style={tomorrow}>
          {`module Suinaut::Counter {
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
      <div className="mt-8 flex gap-4">
        <button
          onClick={createCounter}
          className="bg-purple-600 
                      text-white 
                      px-6 py-3 
                      rounded-lg 
                      font-semibold 
                      shadow-md 
                      border-2 border-white
                      transition-transform 
                      transform hover:scale-105 hover:shadow-lg"
        >
          Create Counter
        </button>
        <button
          onClick={validateObject}
          className="bg-red-500 
                      text-white 
                      px-6 py-3 
                      rounded-lg 
                      font-semibold 
                      shadow-md 
                      border-2 border-white
                      transition-transform 
                      transform hover:scale-105 hover:shadow-lg"
        >
          Submit Challenge
        </button>
      </div>
      {message && (
        <div
          className={`mt-8 bg-[#1E1E2F] text-center ${message === "Validation complete!" ? "text-green-400" : "text-red-500"
            } p-4 rounded-lg font-medium max-w-2xl`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default Challenge_1;
