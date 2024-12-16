'use client'

import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        const delayToHome = async () => {
            await sleep(3000);
            router.push("/");
        }
        delayToHome().then();
    }, [router]);

    return (
        <div
            className="min-h-screen bg-[#f1f2f5] xl:px-32 2xl:px-96 pt-20 pb-10 font-[family-name:var(--font-geist-sans)] text-black">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <p className="animate-bounce">┭┮﹏┭┮ 页面未找到，即将自动返回主页 (๑•̀ㅂ•́)و✧</p>
            </div>
        </div>
    )
}