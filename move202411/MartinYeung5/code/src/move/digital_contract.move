module digital_contract::digital_contract_20241215 {

    //==============================================================================================
    // Dependencies
    //==============================================================================================
    use sui::event;
    use sui::sui::SUI;
    use std::string::{Self, String};
    use sui::{coin, balance::{Self, Balance}};
    use sui::table::{Table, Self};
    use sui::tx_context::{TxContext};

    //==============================================================================================
    // Error codes 
    //==============================================================================================
    // error code for not contract owner
    const ENotContractOwner: u64 = 1;
    // error code for invalid withdrawal amount
    const EInvalidWithdrawalAmount: u64 = 2;
    // error code for insufficient payment
    const EInsufficientPayment: u64 = 3;
    // error code for invalid task id
    const EInvalidTaskId: u64 = 4;
    // error code for invalid budget amount
    const EInvalidBudget: u64 = 5;
    // error code for invalid task status
    const EInvalidTaskStatus: u64 = 6;
    
    //==============================================================================================
    // Structs 
    //==============================================================================================

    /*
        The contract struct represents a digital contract in the contract hub. 
        A contract is a global shared object that is managed by the contract owner. 
        The contract owner is designated by the ownership of the contract owner capability. 
        * anyone can create a new contract.
        @param id - The object id of the contract object.
        @param contract_owner_cap - The object id of the contract owner capability.
        @param balance - The balance of SUI coins in the contract.
        @param tasks - The tasks in the contract.
        @param task_count - The number of tasks in the contract.
    */
	public struct Contract has key {
		id: UID,
        contract_owner_cap: ID,
        contract_hash: String, // use the hashed data for the contract content and will update when the contract data is updated
	}

    /*
        The contract owner capability struct represents the ownership of a contract. 
        The contract owner capability is a object that is owned by the contract owner 
        and is used to manage the contract.
        @param id - The object id of the contract owner capability object.
        @param contract - The object id of the contract object.
    */
    /*  contract owner can sell/transfer their contract to other serivce providers/owners
        therefore, we need to set the cap for the owner to transfer their cap to others
    */
    public struct ContractOwnerCapability has key {
        id: UID,
        contract: ID,
    }

    //==============================================================================================
    // Event structs
    //==============================================================================================

    /*
        Event to be emitted when a contract is created.
        @param contract_id - The id of the contract object.
        @param contract_owner_cap_id - The id of the contract owner capability object.
    */
    public struct ContractCreatedEvent has copy, drop {
        contract_id: ID,
        contract_owner_cap_id: ID,
    }

    //==============================================================================================
    // Functions
    //==============================================================================================

	/*
        Creates a new contract for the owner and emits a ContractCreatedEvent event.
        @param owner - The address of the owner of the contract.
        @param ctx - The transaction context.
	*/
	public entry fun create_contract(owner: address, contract_hash: String, ctx: &mut TxContext) {
        let contract_uid = object::new(ctx); 
        let contract_owner_cap_uid = object::new(ctx); 

        let contract_id = object::uid_to_inner(&contract_uid);
        let contract_owner_cap_id = object::uid_to_inner(&contract_owner_cap_uid);

        transfer::transfer(ContractOwnerCapability {
            id: contract_owner_cap_uid,
            contract: contract_id
         }, owner);

        transfer::share_object(Contract {
            id: contract_uid,
            contract_owner_cap: contract_owner_cap_id,
            contract_hash: contract_hash
        });

        event::emit(ContractCreatedEvent{
           contract_id, 
           contract_owner_cap_id
        })
	}

    //==============================================================================================
    // Getters
    //==============================================================================================

    // getters for the contract struct
    public fun get_contract_uid(contract: &Contract): &UID {
        &contract.id
    }

    public fun get_contract_owner_cap(contract: &Contract): ID {
        contract.contract_owner_cap
    }

    // getters for the contract owner capability struct
    public fun get_contract_owner_cap_uid(contract_owner_cap: &ContractOwnerCapability): &UID {
        &contract_owner_cap.id
    }

    public fun get_contract_owner_cap_contract(contract_owner_cap: &ContractOwnerCapability): ID {
        contract_owner_cap.contract
    }

}