'use client'

import {ConnectButton, useCurrentAccount} from "@mysten/dapp-kit";
import {AppDispatch, useAppSelector} from "@/store";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {isPermitted} from "@/lib/contracts";
import {useDispatch} from "react-redux";
import {refreshScore} from "@/store/modules/oj";
import {awardNFT, awardSui, checkEnoughScore} from "@/lib/contracts/nft";

const buttons = [
    {
        str: "题库",
        link: "/"
    },
    {
        str: "分享",
        link: "/share"
    },
    {
        str: "出题",
        link: "/question"
    }
]

export default function Navigation() {
    const account = useCurrentAccount();
    const [permitted, setPermitted] = useState<boolean>(false);
    const tab = useAppSelector(state => state.oj.tab);
    const dispatch = useDispatch<AppDispatch>();
    const score = useAppSelector(state => state.oj.score);
    const [award, setAward] = useState<string>("");

    useEffect(() => {
        if (!account) {
            setPermitted(false);
        } else {
            isPermitted(account.address).then(permission => setPermitted(permission));
            dispatch(refreshScore(account.address));
        }
    }, [account, dispatch]);

    const showAward = (str: string) => {
        setAward(str);
        const sleep = (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        sleep(5000).then(() => {
            setAward("");
        })
    }

    useEffect(() => {
        if (!account)
            return
        if (score === 3) {
            checkEnoughScore(account.address, 3).then(isEnough => {
                if (isEnough) {
                    awardNFT(account.address).then((success) => showAward(success ? "NFT Award!" : ""));
                }
            })
        } else if (score === 8) {
            checkEnoughScore(account.address, 8).then(isEnough => {
                if (isEnough) {
                    awardSui(account.address).then((success) => showAward(success ? "Sui Award!" : ""));
                }
            })
        }
    }, [score, account]);

    return (
        <div
            className="fixed flex justify-between items-center w-screen h-16 bg-[#222] xl:px-32 2xl:px-96 text-[#9d9d9d] z-50 opacity-[.97]">
            <div className="flex gap-10 items-center">
                <Link href="/">
                    <h1 className="hidden">LetsMoveOJ</h1>
                    <Image src="/logo/logo.jpeg" alt="HOH Logo" width={60} height={60} priority={true}/>
                </Link>
                {buttons.map((button, idx) =>
                    (permitted || button.str !== "出题") && <Link
                        href={button.link}
                        className={(idx === tab ? "px-4 h-16 bg-[#080808] text-white" : "") + " leading-[4rem] hover:text-white transition-all"}
                        key={idx}>{button.str}</Link>
                )}
            </div>
            <div className="flex gap-10 items-center">
                <div className="flex flex-col items-center gap-1">
                    <div className="animate-rotate">
                        <Image src="/nft/NFT.png" alt="NFT" width={20} height={20} priority={true}/>
                    </div>
                    <span className="text-xs">积分：{score}</span>
                </div>
                <ConnectButton/>
            </div>
            {
                award &&
                <div className="fixed top-0 left-0 w-screen h-screen">
                    <div
                        className="absolute flex gap-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-8xl whitespace-pre">
                        {Array.from(award).map((char, index) => {
                            const num = Math.random();
                            const color = num <= 0.33 ? "text-red-600" : (num <= 0.66 ? "text-green-600" : "text-blue-600");
                            return (
                                <span key={index} className={color}>
                                    <div className="animate-bounce">
                                        <div className="opacity-0 animate-fadeIn">
                                            <span className="animate-fadeOut">{char}</span>
                                        </div>
                                    </div>
                                </span>
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    )
}