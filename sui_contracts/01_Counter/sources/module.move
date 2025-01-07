module Suinaut::Counter {
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

