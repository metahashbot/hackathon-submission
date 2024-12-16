#[test_only]
module sui_voting::voting_tests {
    use sui::test_scenario::{Self, Scenario};
    use sui::clock::{Self, Clock};
    use std::string;
    use sui_voting::voting::{Self, Election};

    // 测试常量
    const ADMIN: address = @0xAD;
    const VOTER1: address = @0x1;
    const VOTER2: address = @0x2;
    
    // 错误代码
    const EInvalidTimeRange: u64 = 1;
    const EElectionNotStarted: u64 = 2;
    const EElectionEnded: u64 = 3;

    // 帮助函数：设置测试场景
    // fun setup_test(scenario: &mut Scenario) {
    // fun setup_test() {
    //     // 初始化时钟
    //     scenario = test_scenario::begin(ADMIN);
    //     testclock = clock::create_for_testing(test_scenario::ctx(scenario));
    //     test_scenario::next_tx(scenario, ADMIN);
    // }

    #[test]
    fun test_create_election() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
        
        // 创建选举
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let name = b"Test Election";
            let description = b"Test Description";
            let start_time = clock::timestamp_ms(&clock) + 3600000; // 1小时后开始
            let end_time = start_time + 86400000; // 持续24小时
            
            voting::create_election(
                name,
                description,
                start_time,
                end_time,
                test_scenario::ctx(&mut scenario)
            );
        };

        // 验证选举是否创建成功
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let election = test_scenario::take_shared<Election>(&scenario);
            assert!(string::as_bytes(&voting::name(&election)) == b"Test Election", 0);
            test_scenario::return_shared(election);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = EElectionNotStarted)]
    fun test_vote_before_start() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
        
        // 创建选举（未开始）
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let current_time = clock::timestamp_ms(&clock);
            voting::create_election(
                b"Test Election",
                b"Test Description",
                current_time + 3600000, // 1小时后开始
                current_time + 86400000,
                test_scenario::ctx(&mut scenario)
            );
        };

        // 尝试在选举开始前投票（应该失败）
        test_scenario::next_tx(&mut scenario, VOTER1);
        {
            let mut election = test_scenario::take_shared<Election>(&scenario);
            let encrypted_vote = b"encrypted_vote_data";
            
            voting::cast_vote(
                &mut election,
                encrypted_vote,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(election);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_successful_vote() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
        
        // 创建选举
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let current_time = clock::timestamp_ms(&clock);
            voting::create_election(
                b"Test Election",
                b"Test Description",
                current_time, // 立即开始
                current_time + 86400000, // 持续24小时
                test_scenario::ctx(&mut scenario)
            );
        };

        // 成功投票
        test_scenario::next_tx(&mut scenario, VOTER1);
        {
            let mut election = test_scenario::take_shared<Election>(&scenario);
            let encrypted_vote = b"encrypted_vote_data";
            
            voting::cast_vote(
                &mut election,
                encrypted_vote,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(election);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = EElectionEnded)]
    fun test_vote_after_end() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
        
        // 创建已结束的选举
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let current_time = clock::timestamp_ms(&clock);
            voting::create_election(
                b"Test Election",
                b"Test Description",
                current_time - 86400000, // 24小时前开始
                current_time - 3600000,  // 1小时前结束
                test_scenario::ctx(&mut scenario)
            );
        };

        // 尝试在选举结束后投票（应该失败）
        test_scenario::next_tx(&mut scenario, VOTER1);
        {
            let mut election = test_scenario::take_shared<Election>(&scenario);
            let encrypted_vote = b"encrypted_vote_data";
            
            voting::cast_vote(
                &mut election,
                encrypted_vote,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(election);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }
}