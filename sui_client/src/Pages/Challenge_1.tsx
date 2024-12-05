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

  const PACKAGE = "0x0c2e26b341c3e98162e9f05da304f2f313d5c9acbd696f9eda68c2102671bb86";

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
          module 0x0::flash{

    // use sui::object::{Self, UID};
    // use std::vector;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, ID, UID};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::vec_map::{Self, VecMap};
    use sui::event;
    use std::option;


    struct FLASH has drop {}

    struct FlashLender has key {
        id: UID,
        to_lend: Balance<FLASH>,
        last: u64,
        lender: VecMap<address, u64>
    }

    struct Receipt {
        flash_lender_id: ID,
        amount: u64
    }
    #[allow(unused_field)]
    struct AdminCap has key, store {
        id: UID,
        flash_lender_id: ID,
    }

    struct Flag has copy, drop {
        user: address,
        flag: bool
    }

    // creat a FlashLender
    public fun create_lend(lend_coin: Coin<FLASH>, ctx: &mut TxContext) {
        let to_lend = coin::into_balance(lend_coin);
        let id = object::new(ctx);
        let lender = vec_map::empty<address, u64>();
        let balance = balance::value(&to_lend);
        vec_map::insert(&mut lender ,tx_context::sender(ctx), balance);
        let flash_lender = FlashLender { id, to_lend, last: balance, lender};
        transfer::share_object(flash_lender);
    }

    // get the loan
    public fun loan(
        self: &mut FlashLender, amount: u64, ctx: &mut TxContext
    ): (Coin<FLASH>, Receipt) {
        let to_lend = &mut self.to_lend;
        assert!(balance::value(to_lend) >= amount, 0);
        let loan = coin::take(to_lend, amount, ctx);
        let receipt = Receipt { flash_lender_id: object::id(self), amount };

        (loan, receipt)
    }

    // repay coion to FlashLender
    public fun repay(self: &mut FlashLender, payment: Coin<FLASH>) {
        coin::put(&mut self.to_lend, payment)
    }

    // check the amount in FlashLender is correct 
    public fun check(self: &mut FlashLender, receipt: Receipt) {
        let Receipt { flash_lender_id, amount: _ } = receipt;
        assert!(object::id(self) == flash_lender_id, 0);
        assert!(balance::value(&self.to_lend) >= self.last, 0);
    }

    // init Flash
    fun init(witness: FLASH, ctx: &mut TxContext) {
        let (cap, metadata) = coin::create_currency(
            witness, 
            2, 
            b"MY_COIN",
			b"",
			b"",
            option::none(),
            ctx
        );
        transfer::public_freeze_object(metadata);
        let owner = tx_context::sender(ctx);

        let flash_coin = coin::mint(&mut cap, 1000, ctx);

        create_lend(flash_coin, ctx);
        transfer::public_transfer(cap, owner);
    }

    // get  the balance of FlashLender
    public fun balance(self: &mut FlashLender, ctx: &mut TxContext) :u64 {
        *vec_map::get(&self.lender, &tx_context::sender(ctx))
    }

    // deposit token to FlashLender
    public entry fun deposit(
        self: &mut FlashLender, coin: Coin<FLASH>, ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        if (vec_map::contains(&self.lender, &sender)) {
            let balance = vec_map::get_mut(&mut self.lender, &sender);
            *balance = *balance + coin::value(&coin);
        }else {
            vec_map::insert(&mut self.lender, sender, coin::value(&coin));
        };
        coin::put(&mut self.to_lend, coin);
    }

    // withdraw you token from FlashLender
    public entry fun withdraw(
        self: &mut FlashLender,
        amount: u64,
        ctx: &mut TxContext
    ){
        let owner = tx_context::sender(ctx);
        let balance = vec_map::get_mut(&mut self.lender, &owner);
        assert!(*balance >= amount, 0);
        *balance = *balance - amount;

        let to_lend = &mut self.to_lend;
        transfer::public_transfer(coin::take(to_lend, amount, ctx), owner);
    }

    // check whether you can get the flag
    public entry fun get_flag(self: &mut FlashLender, ctx: &mut TxContext) {
        if (balance::value(&self.to_lend) == 0) {
            event::emit(Flag { user: tx_context::sender(ctx), flag: true });
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
