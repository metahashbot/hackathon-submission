#[test_only]
module sui_rog::role_tests{

    const ENotImplemented: u64 = 0;

    #[test]
    fun test_role() {
        // pass
    }

    #[test, expected_failure(abort_code = ::sui_rog::role_tests::ENotImplemented)]
    fun test_role_fail() {
        abort ENotImplemented
    }


}

