import { useState } from "react";
import {
  useSignAndExecuteTransaction,
  useAccounts,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { challengeConfig } from "../config/challengeConfig";

export function useCreateCounter() {
  const accounts = useAccounts();
  const client = useSuiClient();

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
  const [counterId, setCounterId] = useState<string | null>(null);

  const packageId = challengeConfig.find(
    ({ title }) => title === "Counter",
  )?.packageId;

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

  return { createCounter, message, counterId };
}
