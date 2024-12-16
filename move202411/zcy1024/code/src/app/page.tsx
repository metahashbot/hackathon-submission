'use client'

import {Problems} from "@/components"
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";
import {useEffect} from "react";
import {setTab, refreshData} from "@/store/modules/oj";
import {useCurrentAccount} from "@mysten/dapp-kit";

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const account = useCurrentAccount();
    useEffect(() => {
        dispatch(setTab(0));
        dispatch(refreshData(account?.address));
    }, [dispatch, account]);
    return (
        <div className="min-h-screen bg-[#f1f2f5] xl:px-32 2xl:px-96 pt-20 pb-10 font-[family-name:var(--font-geist-sans)] text-black">
            <Problems />
        </div>
    );
}
