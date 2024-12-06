import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Confetti from "react-confetti";
import { useAtomValue } from "jotai";
import { packageIdAtom } from "../atom";

function FlashLoanChallenge() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const packageId = useAtomValue(packageIdAtom);
  const [solutionPkgId, setSolutionPkgId] = useState("");
  const [module, setModule] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const goHome = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    const url = "http://127.0.0.1:9000";
    const payload = {
      jsonrpc: "2.0",
      id: 1,
      method: "suix_queryEvents",
      params: [
        {
          MoveModule: {
            package: solutionPkgId,
            module: module,
            type: `${packageId}::flash::Flag`,
          },
        },
        null,
        3,
        false,
      ],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data?.result?.data?.[0]?.parsedJson?.flag) {
        setMessage("Your solution is correct!");
        setShowConfetti(true);
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 100);
      } else {
        setMessage("Solution is not correct.");
      }
    } catch (error) {
      setMessage("Solution is not correct.");
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
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={document.body.offsetHeight}
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
        }}
      >
        🏠 Home
      </button>

      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#FFF" }}>
        💸 Flash Loan Challenge
      </h1>
      <ConnectButton />
      <h3 style={{ marginTop: "1rem", color: "#A3E635" }}>
        Try to emit the flag while the balance of FlashLender is 0.
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
          {`module Suinaut::flash{

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

    // get the balance of FlashLender
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
        } 
        else {
            vec_map::insert(&mut self.lender, sender, coin::value(&coin));
        };
        coin::put(&mut self.to_lend, coin);
    }

    // withdraw you token from FlashLender
    public entry fun withdraw(
        self: &mut FlashLender,
        amount: u64,
        ctx: &mut TxContext
    ) {
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

  `}
        </SyntaxHighlighter>
      </div>
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Solution package id"
          style={{ padding: "0.75rem", borderRadius: "8px" }}
          value={solutionPkgId}
          onChange={(e) => setSolutionPkgId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Solution module name"
          style={{ padding: "0.75rem", borderRadius: "8px" }}
          value={module}
          onChange={(e) => setModule(e.target.value)}
        />
        <button
          onClick={handleSubmit}
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
            color: message.includes("is correct") ? "#A3E635" : "#F7768E",
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

export default FlashLoanChallenge;
