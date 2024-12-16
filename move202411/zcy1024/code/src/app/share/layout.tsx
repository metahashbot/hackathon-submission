'use client'

import {ReactNode, useEffect} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";
import {refreshData, setTab} from "@/store/modules/oj";
import {useCurrentAccount} from "@mysten/dapp-kit";

export default function ShareLayout({children}: {children: ReactNode}) {
    const dispatch = useDispatch<AppDispatch>();
    const account = useCurrentAccount();
    useEffect(() => {
        dispatch(setTab(1));
        dispatch(refreshData(account?.address));
    }, [dispatch, account]);
    return (
        <>
            {children}
        </>
    )
}