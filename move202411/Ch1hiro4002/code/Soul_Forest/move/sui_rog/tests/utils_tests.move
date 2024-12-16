#[test_only]
module sui_rog::utils_tests{

    const ENotImplemented: u64 = 0;

    #[test]
    fun test_utils() {

    }

    #[test, expected_failure(abort_code = ::sui_rog::utils_tests::ENotImplemented)]
    fun test_utils_fail() {
        abort ENotImplemented
    }


}