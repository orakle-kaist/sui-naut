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

    /// Event to emit the counter value
    struct CountEvent has copy, drop {
        value: u64,
    }

    /// Increment the counter
    entry fun increment(counter: &mut Counter) {
        counter.count = counter.count + 1;
    }

    /// Get the current counter value (emit an event)
    entry fun get_count(counter: &Counter, _ctx: &TxContext) {
        event::emit(CountEvent { value: counter.count });
    }

    /// Event emitted for validation success
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
    entry fun validate_object(counter: &Counter, _ctx: &TxContext) {
        if (counter.count > 2) {
            event::emit(ValidationEvent { message: b"pass" });
        } else {
            event::emit(ValidationEvent { message: b"fail, count must be greater than 5" });
            /*
            abort 1 // Validation failed
            */
        }
    }
}

