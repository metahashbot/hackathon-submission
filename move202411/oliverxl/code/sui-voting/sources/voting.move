module sui_voting::voting {
    // use sui::object::{Self, UID};
    // use sui::transfer;
    // use sui::tx_context::{Self, TxContext};
    // use std::vector;
    //use sui::dynamic_object_field as ofield;
    use std::string::{Self, String};
    use sui::clock::{Self, Clock};
    use sui::event;

    // Structs for the voting system
    public struct Election has key {
        id: UID,
        name: String,
        description: String,
        start_time: u64,
        end_time: u64,
        encrypted_tally: vector<u8>, // Encrypted using Walrus
        admin: address,
    }

    public struct Ballot has key {
        id: UID,
        election_id: ID,
        encrypted_vote: vector<u8>, // Encrypted using Walrus
        voter: address,
        timestamp: u64,
    }

    // Events
    public struct ElectionCreated has copy, drop {
        election_id: ID,
        name: String,
        start_time: u64,
        end_time: u64,
    }

    public struct VoteCast has copy, drop {
        election_id: ID,
        voter: address,
        timestamp: u64,
    }

    // Create a new election
    public entry fun create_election(
        name: vector<u8>,
        description: vector<u8>,
        start_time: u64,
        end_time: u64,
        ctx: &mut TxContext
    ) {
        let election = Election {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            start_time,
            end_time,
            encrypted_tally: vector::empty(),
            admin: tx_context::sender(ctx),
        };

        let election_id = object::id(&election);
        
        // Emit creation event
        event::emit(ElectionCreated {
            election_id,
            name: election.name,
            start_time,
            end_time,
        });

        transfer::share_object(election);
    }

    // Cast a vote in an election
    public entry fun cast_vote(
        election: &mut Election,
        encrypted_vote: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        assert!(current_time >= election.start_time, 0); // Election hasn't started
        assert!(current_time <= election.end_time, 1);   // Election has ended

        let ballot = Ballot {
            id: object::new(ctx),
            election_id: object::id(election),
            encrypted_vote,
            voter: tx_context::sender(ctx),
            timestamp: current_time,
        };

        // Emit vote cast event
        event::emit(VoteCast {
            election_id: object::id(election),
            voter: tx_context::sender(ctx),
            timestamp: current_time,
        });

        transfer::transfer(ballot, tx_context::sender(ctx));
    }

    // Only admin can tally votes
    public entry fun tally_votes(
        election: &mut Election,
        encrypted_tally: vector<u8>,
        ctx: &TxContext
    ) {
        assert!(tx_context::sender(ctx) == election.admin, 2); // Only admin can tally
        election.encrypted_tally = encrypted_tally;
    }

    public fun name(election: &Election) : String{
        election.name
    }
}
