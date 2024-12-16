import {UseMutateAsyncFunction} from "@tanstack/react-query";
import {SuiSignAndExecuteTransactionInput, SuiSignAndExecuteTransactionOutput} from '@mysten/wallet-standard';
import {
    WalletFeatureNotSupportedError,
    WalletNoAccountSelectedError,
    WalletNotConnectedError
} from "@mysten/dapp-kit/dist/cjs/errors/walletErrors";
import { PartialBy } from "@mysten/dapp-kit/dist/cjs/types/utilityTypes";
import {Transaction} from "@mysten/sui/transactions";

type UseSignAndExecuteTransactionError =
    WalletFeatureNotSupportedError
    | WalletNoAccountSelectedError
    | WalletNotConnectedError
    | Error;

type UseSignAndExecuteTransactionArgs =
    PartialBy<Omit<SuiSignAndExecuteTransactionInput, 'transaction'>, 'account' | 'chain'>
    & {
    transaction: Transaction | string;
};

export type {
    UseMutateAsyncFunction,
    SuiSignAndExecuteTransactionOutput,
    UseSignAndExecuteTransactionError,
    UseSignAndExecuteTransactionArgs
}