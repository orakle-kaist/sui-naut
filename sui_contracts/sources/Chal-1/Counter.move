module Suinaut::Counter {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;

    /// Counter Struct
    struct Counter has key {
        id: UID,
        count: u64,
    }

    /// Flag Struct
    struct FlagSuinaut has key {
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
            create_flag(ctx);
        }
    }

    /// Get the current counter value (emit an event)
    entry fun get_count(counter: &Counter, _ctx: &TxContext) {
        event::emit(CountEvent { value: counter.count });
    }

    /// Event emitted for verifying flag
    struct VerifyingFlagEvent has copy, drop {
        message: vector<u8>, // Example message like "pass"
    }

    /// Event emitted for verifying flag
    struct ValidationEvent has copy, drop {
        message: vector<u8>, // Example message like "pass"
    }


    /// Create a new Counter object and transfer ownership to the sender
    entry fun create_object(ctx: &mut TxContext) {
        let counter = Counter {
            id: object::new(ctx),
            count: 0,
        };
        transfer::transfer(counter, tx_context::sender(ctx));
    }

    /// Validate the Counter object
    entry fun validate_object(counter: &Counter) {
        if (counter.count > 2) {
            event::emit(ValidationEvent { message: b"pass" });

        } else {
            event::emit(ValidationEvent { message: b"fail, count must be greater than 5" });
            /*
            abort 1 // Validation failed
            */
        }
    }

    /// Create new flag object
    fun create_flag(ctx: &mut TxContext) {
        let flag = FlagSuinaut {
            id: object::new(ctx),
            prob: @Suinaut,
            player: tx_context::sender(ctx),
            msg: b"Flag-1"
        };

        transfer::transfer(flag, tx_context::sender(ctx));
    }

    /// Verify Flag
    entry fun verify_flag(flag: &FlagSuinaut, ctx: &TxContext) {
      if (flag.prob == @Suinaut 
          && flag.player == tx_context::sender(ctx)) {
        event::emit(VerifyingFlagEvent { message: b"👍 Good Job" });
      } else {
        event::emit(VerifyingFlagEvent { message: b"Error, Invalid Flag" });
      }
    }
}

