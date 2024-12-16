'use client'

import {ReactNode, useEffect} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";
import {refreshData, setTab} from "@/store/modules/oj";
import {useCurrentAccount} from "@mysten/dapp-kit";

export default function ProblemLayout({children}: {children: ReactNode}) {
    const dispatch = useDispatch<AppDispatch>();
    const account = useCurrentAccount();
    useEffect(() => {
        dispatch(setTab(0));
        dispatch(refreshData(account?.address));
    }, [dispatch, account]);
    return (
        <>
            {children}
        </>
    )
}