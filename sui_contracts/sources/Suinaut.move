module Suinaut::suinaut {

    use sui::object;
    use sui::table;
    use sui::transfer;
    use sui::tx_context::TxContext;

    #[allow(unused_field)]
    struct Level has key, store {
        id: object::UID,
        address: address,
    }

    #[allow(unused_field)]
    struct EmittedInstanceData has key, store {
        id: object::UID,
        player: address,
        level: address,
        completed: bool,
    }

    struct Suinaut has key, store {
        id: object::UID,
        registered_levels: table::Table<address, bool>,
        emitted_instances: table::Table<address, EmittedInstanceData>,
    }

    /// Internal `init` function called during module deployment
    fun init(ctx: &mut TxContext) {
        let suinaut = Suinaut {
            id: object::new(ctx),
            registered_levels: table::new(ctx),
            emitted_instances: table::new(ctx),
        };
        transfer::public_share_object(suinaut);
    }

    /// Register a new level (admin functionality)
    public entry fun register_level(
        suinaut: &mut Suinaut,
        level: address,
        _ctx: &mut TxContext
    ) {
        table::add(&mut suinaut.registered_levels, level, true);
    }

    /// Check if a level is registered
    public fun is_level_registered(suinaut: &Suinaut, level: address): bool {
        table::contains(&suinaut.registered_levels, level)
    }
}


