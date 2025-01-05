import { useState } from "react";
import {
  useSignAndExecuteTransaction,
  useAccounts,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAtomValue } from "jotai";
import { packageIdAtom } from "../atom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ChallengeDescription from "../components/ChallengeDescription";
import PurpleButton from "../components/PurpleButton";
import RedButton from "../components/RedButton";
import InfoBox from "../components/InfoBox";

function Challenge_1() {
  const accounts = useAccounts();
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

  const code = `module Suinaut::Counter {
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
}`;

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
        (change) => change.type === "created"
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
        arguments: [tx.object(counterId)],
      });

      await signAndExecuteTransaction({
        transaction: tx as any,
        chain: "sui:localnet",
      });

      setMessage("Validation complete!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      setMessage("Validation failed.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#62A1F8] to-[#103870]">
      <Header showConfetti={showConfetti} />
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <ChallengeDescription
          title="Challenge 1: Counter"
          text="Try to count more than 2 times."
        />
        <div className="w-full max-w-4xl">
          <SyntaxHighlighter language="rust" style={tomorrow}>
            {code}
          </SyntaxHighlighter>
        </div>
        <div className="mt-8 flex gap-4 mb-14">
          <PurpleButton onClick={createCounter} text="Create Counter" />
          <RedButton onClick={validateObject} text="Submit Challenge" />
        </div>
        {message && (
          <InfoBox
            text={message}
            type={message === "Validation complete!" ? "success" : "error"}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Challenge_1;
