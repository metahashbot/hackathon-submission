module letsmoveoj::problem;

use sui::vec_map::{Self, VecMap};
use std::string::String;
use letsmoveoj::admin::AdminList;

const E_NOT_ADMIN: u64 = 0;
const E_NOT_EQUAL_NUMBER_INPUT_OUTPUT: u64 = 1;
const E_NOT_CORRECT_PROBLEM: u64 = 2;

public struct Data has store, drop {
    input: String,
    output: String
}

public struct Problem has store, drop {
    title: String,
    gas: u64,
    accepted: u64,
    submitted: u64,
    detail: String,
    data: vector<Data>
}

public struct ProblemList has key {
    id: UID,
    cur_pid: u64,
    list: VecMap<u64, Problem>
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(ProblemList {
        id: object::new(ctx),
        cur_pid: 0,
        list: vec_map::empty<u64, Problem>()
    });
}

fun create_data(inputs: vector<String>, outputs: vector<String>): vector<Data> {
    let mut i = 0;
    let mut data = vector<Data>[];
    while (i < inputs.length()) {
        data.push_back(Data {
            input: inputs[i],
            output: outputs[i]
        });
        i = i + 1;
    };
    data
}

fun create_problem(
    title: String,
    gas: u64,
    detail: String,
    inputs: vector<String>,
    outputs: vector<String>
): Problem {
    Problem {
        title,
        gas,
        accepted: 0,
        submitted: 0,
        detail,
        data: create_data(inputs, outputs)
    }
}

entry fun add_problem(
    list: &mut ProblemList,
    title: String,
    gas: u64,
    detail: String,
    inputs: vector<String>,
    outputs: vector<String>,
    admin_list: &AdminList,
    ctx: &TxContext
) {
    assert!(admin_list.is_admin(ctx.sender()), E_NOT_ADMIN);
    assert!(inputs.length() == outputs.length(), E_NOT_EQUAL_NUMBER_INPUT_OUTPUT);
    let pid = list.cur_pid + 1;
    list.cur_pid = pid;
    list.list.insert(pid, create_problem(title, gas, detail, inputs, outputs));
}

entry fun remove_problem(list: &mut ProblemList, mut pids: vector<u64>, admin_list: &AdminList, ctx: &TxContext) {
    assert!(admin_list.is_admin(ctx.sender()), E_NOT_ADMIN);
    while (!pids.is_empty()) {
        let pid = pids.pop_back();
        list.list.remove(&pid);
    };
}

public fun has_problem(list: &ProblemList, pid: u64): bool {
    list.list.contains(&pid)
}

entry fun try_to_solve(pid: u64, list: &mut ProblemList, admin_list: &AdminList, ctx: &TxContext) {
    assert!(admin_list.is_admin(ctx.sender()), E_NOT_ADMIN);
    assert!(list.has_problem(pid), E_NOT_CORRECT_PROBLEM);
    let problem = list.list.get_mut(&pid);
    problem.submitted = problem.submitted + 1;
}

public fun accept_problem(list: &mut ProblemList, pid: u64) {
    let problem = list.list.get_mut(&pid);
    problem.accepted = problem.accepted + 1;
}