import { ChallengeProps } from "../types";

export const challengeConfig: ChallengeProps[] = [
  {
    packageId:
      "0x35dc737f9551ef8c08e2b291e0505ad717b17bebf975a0732d3bd0a137d88ec6",
    title: "Hello Sui",
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
      "0xe6df43445fd40fb27c2c8e6eefa2c2db38ea9c785d0823026b7e4468b0de2ca2",
    title: "Loan",
    description: `Try to get flag while the balance of FlashLender is 0.

Hint: If you need shared object, check the Raw JSON tab in the explorer.
Hint: You may deploy your own contract. You can use Bitslab IDE or Sui CLI.
`,
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
  {
    title: "Chef",
    packageId:
      "0x948af8e1b0484bef7d2b58b85a884483cea2852069c5503d0cbe490a82136b25",
    description: `Hey chef, please cook a bread for me.

Hint: Find out about BCS serialization.`,
    code: `module Suinaut::Chef {
    use sui::tx_context::{Self};
    use sui::object::{Self, UID};
    use sui::transfer;

    use std::bcs;
    use std::vector;

    struct Olive_oil has copy, drop, store {amount: u16}
    struct Yeast has copy, drop, store {amount: u16}
    struct Flour has copy, drop, store {amount: u16}
    struct Salt has copy, drop, store {amount: u16}

    struct Cook<T> has copy, drop, store {
        source: vector<T>
    }

    struct Pizza has copy, drop, store {
        olive_oils: Cook<Olive_oil>,
        yeast: Cook<Yeast>,
        flour: Cook<Flour>,
        salt: Cook<Salt>,
    }

    struct SuinautFlag has key {
        id: UID,
        prob: address,
        player: address,
        msg: vector<u8>
    }

    struct Status has store, drop {
        status1: bool,
        status2: bool,
        user: address
    }


    public fun get_Olive_oil (amount: u16) : Olive_oil {
        Olive_oil { amount }
    }

    public fun get_Yeast (amount: u16) : Yeast {
        Yeast { amount }
    }
    
    public fun get_Flour (amount: u16) : Flour {
        Flour { amount }
    }
    
    public fun get_Salt (amount: u16) : Salt {
        Salt { amount }
    }

    public fun cook(olive_oils: vector<Olive_oil>, yeast: vector<Yeast>, flour: vector<Flour>, salt: vector<Salt>, status: &mut Status) {
        let l1 = vector::length<Olive_oil>(&olive_oils);
        let l2 = vector::length<Yeast>(&yeast);
        let l3 = vector::length<Flour>(&flour);
        let l4 = vector::length<Salt>(&salt);

        let cook1 = Cook {source : vector::empty<Olive_oil>()};
        let cook2 = Cook {source : vector::empty<Yeast>()};
        let cook3 = Cook {source : vector::empty<Flour>()};
        let cook4 = Cook {source : vector::empty<Salt>()};

        let i = 0;
        while(i < l1) {
            vector::push_back(&mut cook1.source, *vector::borrow(&olive_oils, i));
            i = i + 1;
        };
        i = 0;
        while(i < l2) {
            vector::push_back(&mut cook2.source, *vector::borrow(&yeast, i));
            i = i + 1;
        };
        i = 0;
        while(i < l3) {
            vector::push_back(&mut cook3.source, *vector::borrow(&flour, i));
            i = i + 1;
        };
        i = 0;
        while(i < l4) {
            vector::push_back(&mut cook4.source, *vector::borrow(&salt, i));
            i = i + 1;
        };

        let p = Pizza {
            olive_oils: cook1,
            yeast: cook2,
            flour: cook3,
            salt: cook4,
        };
        assert!( bcs::to_bytes(&p) == x"0415a5b8a6f8c946bb0300bd9d997eb7038ad784faf2b802c5f122e1", 0);
        status.status1 = true;
    }

    public fun recook (out: vector<u8>, status: &mut Status) {
        let p = Pizza {
            olive_oils: Cook<Olive_oil> {
                source: vector<Olive_oil>[
                    get_Olive_oil(0xb9d9),
                    get_Olive_oil(0xeb54),
                    get_Olive_oil(0x9268),
                    get_Olive_oil(0xc5f7),
                    get_Olive_oil(0xa1ec),
                    get_Olive_oil(0xd084),
                ]
            },
            yeast: Cook<Yeast> {
                source: vector<Yeast>[
                    get_Yeast(0xbd00),
                    get_Yeast(0xfc81),
                    get_Yeast(0x999d),
                    get_Yeast(0xb77e),
                ]
            },
            flour: Cook<Flour> {
                source: vector<Flour>[
                    get_Flour(0xdcc7),
                    get_Flour(0xcc7a),
                    get_Flour(0x8f19),
                    get_Flour(0x96b1),
                    get_Flour(0x8a6d),
                ]
            },
            salt: Cook<Salt> {
                source: vector<Salt>[
                    get_Salt(0x8b01),
                    get_Salt(0xf1c5),
                    get_Salt(0xc6ec),
                ]
            },
        };

        assert!( bcs::to_bytes(&p) == out, 0);
        status.status2 = true;

    }

    public fun get_status(ctx: &mut tx_context::TxContext): Status {
        Status {
            status1: false,
            status2: false,
            user: tx_context::sender(ctx)
        }
    }

    public fun dispatch_flag(status: &Status, ctx: &mut tx_context::TxContext) {
        let user = tx_context::sender(ctx);
        assert!(status.user == user, 0);
        assert!(status.status1 && status.status2, 0);
        
        let flag = SuinautFlag {
            id: object::new(ctx),
            prob: @Suinaut,
            player: tx_context::sender(ctx),
            msg: b"Flag-1"
        };

        transfer::transfer(flag, tx_context::sender(ctx));
    }    
}`,
  },
  { title: "Simple Game", packageId: "", description: "", code: "" },
  { title: "Coming Soon", packageId: "", description: "", code: "" },
  { title: "Coming Soon", packageId: "", description: "", code: "" },
];
