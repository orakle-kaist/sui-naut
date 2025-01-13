import { ChallengeProps } from "../types";

export const challengeConfig: ChallengeProps[] = [
  {
    packageId:
      "0x9cad8fc85b0d5344eb819df975bfe5eaa21b5dabb32c6fcb10fc2b8eefc28cd0",
    title: "Counter",
    description: "Try to count more than 2 times.",
    code: `module Suinaut::Counter {
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
}`,
  },
  {
    packageId:
      "0x07064071ac373096a25faf8ea7f04eb6898286fb3eacf6a4419cb56ff877ea8f",
    title: "Flash",
    description: "Try to emit the flag while the balance of FlashLender is 0.",
    code: `module Suinaut::flash{

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
`,
  },
  { title: "Simple Game", packageId: "", description: "", code: "" },
  { title: "Coming Soon", packageId: "", description: "", code: "" },
  { title: "Coming Soon", packageId: "", description: "", code: "" },
  { title: "Coming Soon", packageId: "", description: "", code: "" },
];
