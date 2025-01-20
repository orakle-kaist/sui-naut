import { ChallengeProps } from "../types";

export const challengeConfig: ChallengeProps[] = [
  {
    packageId:
      "0x35dc737f9551ef8c08e2b291e0505ad717b17bebf975a0732d3bd0a137d88ec6",
    title: "Counter",
    description: `Try to count more than 2 times.

Hint: Use Sui Explorer (testnet). Package ID is in the url.
`,
    code: `module Suinaut::Counter {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::{event, transfer};

    /// Counter Struct
    struct Counter has key, store {
        id: UID,
        count: u64,
    }

    /// Flag Struct
    struct SuinautFlag has key {
        id: UID,
        prob: address,
        player: address,
        msg: vector<u8>
    }

    /// Event to emit the counter value
    struct CountEvent has copy, drop {
        value: u64,
    }

    /// Increment the counter
    entry fun increment(counter: &mut Counter, ctx: &mut TxContext) {
        counter.count = counter.count + 1;

        if (counter.count == 3) {
            dispatch_flag(ctx);
        }
    }

    /// Get the current counter value (emit an event)
    entry fun get_count(counter: &Counter, _ctx: &TxContext) {
        event::emit(CountEvent { value: counter.count });
    }

    /// Create a new Counter object and transfer ownership to the sender
    entry fun create_object(ctx: &mut TxContext) {
        let counter = Counter {
            id: object::new(ctx),
            count: 0,
        };

        let owner = tx_context::sender(ctx);

        transfer::public_transfer(counter, owner);
    }

    /// Create new flag object
    fun dispatch_flag(ctx: &mut TxContext) {
        let flag = SuinautFlag {
            id: object::new(ctx),
            prob: @Suinaut,
            player: tx_context::sender(ctx),
            msg: b"Flag-1"
        };

        transfer::transfer(flag, tx_context::sender(ctx));
    }
}
`,
  },
  {
    packageId:
      "0x7aa4ebb0cd7ab96ad341f1e7eb0067dcb8788ba720e9e29ce979f91fadfadbac",
    title: "Flash",
    description: `Try to get flag while the balance of FlashLender is 0.

Hint: You may deploy your own contract. You can use Bitslab IDE or Sui CLI.`,
    code: `module Suinaut::flash{

    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, ID, UID};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::vec_map::{Self, VecMap};
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

    /// Flag Struct
    struct SuinautFlag has key {
        id: UID,
        prob: address,
        player: address,
        msg: vector<u8>
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
            dispatch_flag(ctx);
        }
    }

    /// Create new flag object
    fun dispatch_flag(ctx: &mut TxContext) {
        let flag = SuinautFlag {
            id: object::new(ctx),
            prob: @Suinaut,
            player: tx_context::sender(ctx),
            msg: b"Flag-2"
        };

        transfer::transfer(flag, tx_context::sender(ctx));
    }
}
`,
  },
  { title: "Simple Game", packageId: "", description: "", code: "" },
  { title: "Coming Soon", packageId: "", description: "", code: "" },
  { title: "Coming Soon", packageId: "", description: "", code: "" },
  { title: "Coming Soon", packageId: "", description: "", code: "" },
];
