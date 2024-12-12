'use client'

import {ChangeEvent, useEffect, useRef, useState} from "react";
import {stringToMap, problemType, refreshData, refreshScore} from "@/store/modules/oj";
import {AppDispatch, useAppSelector} from "@/store";
import {read, strToMDXElement} from "@/utils"
import {MDXRemote, type MDXRemoteSerializeResult} from "next-mdx-remote";
import {useRouter} from "next/navigation";
import {submit, acceptProblem, personalShare} from "@/lib/contracts"
import {useCurrentAccount} from "@mysten/dapp-kit";
import {useDispatch} from "react-redux";
import Link from "next/link";

export default function ProblemContents({id}: { id: string }) {
    const [packageID, setPackageID] = useState<string>("");
    const packageIDRef = useRef<HTMLInputElement>(null);

    const account = useCurrentAccount();
    const dispatch = useDispatch<AppDispatch>();
    const [tips, setTips] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    const router = useRouter();
    const problems = stringToMap(useAppSelector(state => state.oj.problems), 0) as Map<string, problemType>;
    const [problem, setProblem] = useState<problemType | undefined>(undefined);

    const [detail, setDetail] = useState<MDXRemoteSerializeResult | null>();

    const acceptedList = useAppSelector(state => state.oj.personal.accepted);
    const sharedList = useAppSelector(state => state.oj.personal.share);
    const [hasAccepted, setHasAccepted] = useState<boolean>(false);
    const [hasShared, setHasShared] = useState<boolean>(false);

    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [sharing, setSharing] = useState<boolean>(false);
    const [shareTips, setShareTips] = useState<string>("");

    const changePackageID = (event: ChangeEvent<HTMLInputElement>) => {
        setPackageID(event.target.value);
    }

    const submitAnswer = async () => {
        setSubmitting(true);
        submit(id, packageID, setTips).then(ret => {
            const submitted = Number(problem!.submitted) + 1;
            if (ret === "Accepted") {
                setTips("Recording...");
                acceptProblem(account!.address, id).then(success => {
                    setTips(success ? ret : "Recording Error");
                    setSubmitting(false);
                    dispatch(refreshData(account?.address));
                    const accepted = Number(problem!.accepted) + (success ? 1 : 0);
                    setProblem({
                        ...problem!,
                        accepted,
                        submitted,
                    });
                    dispatch(refreshScore(account!.address));
                });
            } else {
                setTips(ret);
                setSubmitting(false);
                dispatch(refreshData(account?.address));
                setProblem({
                    ...problem!,
                    submitted,
                });
            }
        });
    }

    useEffect(() => {
        if (problems.size === 0)
            return
        if (!problem) {
            if (!problems.has(id)) {
                router.push("/not-found");
            }
            setProblem(problems.get(id));
        }
    }, [problems, id, problem, router]);

    useEffect(() => {
        if (problem && !detail) {
            const initDetail = async () => {
                return await read({blobId: problem.detail});
            }
            initDetail().then(detail => {
                const len = detail.split(' ')[0].length;
                if (len > 0) {
                    strToMDXElement(detail.slice(len + 1)).then(md => setDetail(md))
                }
            });
        }
    }, [problem, detail]);

    useEffect(() => {
        setHasAccepted(acceptedList.find(it => it === id) !== undefined);
        setHasShared(sharedList.find(it => it === id) !== undefined);
    }, [acceptedList, sharedList, id]);

    const fileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files![0]);
    }

    const shareFile = () => {
        setSharing(true);
        personalShare(account!.address, id, file!, setShareTips).then(ret => {
            setShareTips(ret);
            setSharing(false);
        });
    }

    return (
        <div className="min-h-[85vh] px-3 bg-white shadow-xl">
            <h2 className="py-10 text-2xl select-text">{id}. {problem?.title}</h2>
            <hr/>
            <article className="py-3 prose max-w-[50rem] select-text">
                {detail && <MDXRemote {...detail}/>}
            </article>
            <div
                className="absolute flex flex-col divide-y top-48 xl:right-32 2xl:right-96 pr-3 w-72 text-sm shadow-[-1px_0_0_0_rgba(0,0,0,0.1)]">
                <p className="flex justify-between items-center h-14 px-3 bg-[#f9f9f9]">
                    <span>gas限制：</span>
                    <span>{problem?.gas}</span>
                </p>
                <p className="flex justify-between items-center h-14 px-3">
                    <span>总通过数：</span>
                    <span>{problem?.accepted}</span>
                </p>
                <p className="flex justify-between items-center h-14 px-3 bg-[#f9f9f9]">
                    <span>总提交数：</span>
                    <span>{problem?.submitted}</span>
                </p>
                <p className="relative flex justify-between items-center h-14 px-3">
                    <span>PackageID:</span>
                    <input className="px-2 text-right focus:outline-0" type="text" ref={packageIDRef}
                           onChange={changePackageID} placeholder="请输入PackageID"/>
                    <Link href="/problem/rules" className="absolute bottom-0 right-0 text-xs opacity-80 hover:text-blue-600 transition-colors">more</Link>
                </p>
                <p className="flex justify-between items-center h-14 pl-1 pr-3 bg-[#f9f9f9]">
                    <button
                        className={"px-2 h-8 text-center leading-8 rounded-full transition-all " + (packageID && !submitting && account ? "bg-white cursor-pointer hover:scale-105 active:scale-95" : "text-[#999]")}
                        onClick={submitAnswer}
                        disabled={!packageID || submitting || !account}>提交答案
                    </button>
                    <span
                        className={submitting ? "" : (tips === "Accepted" ? "text-green-600" : "text-red-600")}>{tips}</span>
                </p>
                {hasAccepted &&
                    <>
                        <p className="flex justify-between items-center h-14 pl-1 pr-3">
                            <input className="w-0 opacity-0" name="move" type="file" accept=".md" ref={fileRef}
                                   onChange={fileChange}/>
                            <span
                                className="absolute px-2 h-8 text-center leading-8 cursor-pointer bg-[#f9f9f9] rounded-full hover:scale-105 active:scale-95 transition-all"
                                onClick={() => fileRef.current?.click()}>上传文件</span>
                            <span>{file ? file.name : "请选择您的分享（.md）"}</span>
                        </p>
                        <p className="flex justify-between items-center h-14 pl-1 pr-3 bg-[#f9f9f9]">
                            <button
                                className={"px-2 h-8 w-[4.5rem] text-center leading-8 rounded-full transition-all " + (file && !sharing ? "bg-white cursor-pointer hover:scale-105 active:scale-95" : "text-[#999]")}
                                onClick={shareFile}
                                disabled={!file || sharing}>{sharing ? "稍后" : (hasShared ? "再次分享" : "分享")}
                            </button>
                            <span
                                className={sharing ? "" : (shareTips === "Congratulations" ? "text-green-600" : "text-red-600")}>{shareTips}</span>
                        </p>
                    </>
                }
            </div>
        </div>
    )
}