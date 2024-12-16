'use client'

import Link from "next/link";
import {problemType, shareType, stringToMap} from "@/store/modules/oj";
import {useAppSelector} from "@/store";
import {useCurrentAccount} from "@mysten/dapp-kit";
import {useEffect, useState} from "react";
import {deleteByID} from "@/lib/contracts"

export default function Shares() {
    const account = useCurrentAccount();
    const shares = stringToMap(useAppSelector(state => state.oj.share), 1) as Map<string, shareType>;
    const problems = stringToMap(useAppSelector(state => state.oj.problems), 0) as Map<string, problemType>;
    const [sid, setSid] = useState<string>("");
    const [confirming, setConfirming] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    const tryDelete = (sid: string) => {
        setSid(sid);
        setConfirming(true);
    }

    useEffect(() => {
        setConfirming(false);
    }, [account]);

    const confirmDelete = () => {
        setDeleting(true);
        deleteByID(sid).then(() => {
            // setSid("");
            // setConfirming(false);
            // setDeleting(false);
            window.location.reload();
        });
    }

    return (
        <div className="flex flex-col divide-y min-h-[85vh] px-3 bg-white shadow-xl text-sm select-text">
            <h2 className="py-6 text-5xl font-medium text-center">LetsMove知识分享</h2>
            <div className="flex justify-between pt-5 pb-1 px-6 font-medium">
                <span className="flex-1">标题</span>
                <div className="flex justify-between w-2/3">
                    <span>作者</span>
                    <span className="pr-28">时间</span>
                </div>
            </div>
            {Array.from(shares.keys()).map((key, index) => {
                const share = shares.get(key)!;
                const problem = problems.get(share.pid);
                return (
                    <div
                        className={"relative flex justify-between py-2 px-6 " + (index % 2 === 0 ? "bg-[#f9f9f9]" : "")}
                        key={index}>
                        <Link href={`/share/${key}`}>
                            <span
                                className="flex-1 text-blue-600 font-medium opacity-70 cursor-pointer hover:opacity-90 hover:underline hover:decoration-solid transition-all">
                                {(problem ? problem.title : "Some Problem")}
                            </span>
                        </Link>
                        <div className="flex justify-between w-2/3 tabular-nums">
                            <span>{share.sharer}</span>
                            <span>{share.share_time}</span>
                        </div>
                        {
                            account && account.address === share.sharer &&
                            <span
                                className="absolute right-1 cursor-pointer opacity-10 hover:opacity-90 transition-opacity"
                                onClick={() => tryDelete(key)}>X</span>
                        }
                    </div>
                )
            })}
            {
                confirming &&
                <div className="fixed left-0 top-0 w-full h-screen select-none">
                    <div className="h-full w-full z-40 bg-[#f1f2f5] opacity-60" onClick={() => setConfirming(deleting)}></div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="flex flex-col gap-9 bg-white px-3 py-3 rounded-xl">
                            <span>请确认删除</span>
                            <div className="flex justify-between">
                                <span className={!deleting ? "cursor-pointer" : ""} onClick={confirmDelete}>{deleting ? "等待..." : "确认"}</span>
                                <span className={!deleting ? "cursor-pointer" : ""} onClick={() => setConfirming(deleting)}>取消</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}