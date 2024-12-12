'use client'

import {useEffect, useState} from "react";
import {read, strToMDXElement} from "@/utils"
import {MDXRemote, type MDXRemoteSerializeResult} from "next-mdx-remote";
import {problemType, shareType, stringToMap} from "@/store/modules/oj";
import {useAppSelector} from "@/store";

export default function ShareContents({id}: { id: string }) {
    const [share, setShare] = useState<shareType | undefined>(undefined);
    const [detail, setDetail] = useState<MDXRemoteSerializeResult | null>();
    const [problemTitle, setProblemTitle] = useState<string>("");
    const shares = stringToMap(useAppSelector(state => state.oj.share), 1) as Map<string, shareType>;
    const problems = stringToMap(useAppSelector(state => state.oj.problems), 0) as Map<string, problemType>;
    useEffect(() => {
        if (share)
            return
        const findShare = shares.get(id);
        if (!findShare) {
            return;
        }
        setShare(findShare);
        read({blobId: findShare.content}).then(detail => {
            const len = detail.split(' ')[0].length;
            if (len > 0) {
                strToMDXElement(detail.slice(len + 1)).then(md => setDetail(md));
            }
        });
        const problem = problems.get(findShare.pid);
        setProblemTitle(problem ? problem.title : "Some Problem");
    }, [share, shares, id, problems]);

    return (
        <div className="min-h-[85vh] px-3 bg-white shadow-xl select-text">
            <h2 className="pt-10 text-3xl font-bold">{problemTitle}</h2>
            <div className="h-10 leading-10 text-sm opacity-75">
                <span className="mr-10">作者：{share?.sharer}</span>
                <span>时间：{share?.share_time}</span>
            </div>
            <hr/>
            <article className="py-3 prose max-w-none select-text">
                {detail && <MDXRemote {...detail}/>}
            </article>
        </div>
    )
}