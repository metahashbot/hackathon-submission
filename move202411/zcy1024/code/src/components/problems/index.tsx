'use client'

import Link from "next/link";
import {useAppSelector} from "@/store";
import {problemType, stringToMap} from "@/store/modules/oj";

export default function Problems() {
    const problems = stringToMap(useAppSelector(state => state.oj.problems), 0) as Map<string, problemType>;

    return (
        <div className="flex flex-col divide-y min-h-[85vh] px-3 bg-white shadow-xl text-sm select-text">
            <h2 className="py-6 text-5xl font-medium text-center">LetsMoveOJ</h2>
            <div className="flex justify-between pt-5 pb-1 px-6 font-medium">
                <span className="w-14 mr-10">#</span>
                <span>标题</span>
                <span className="flex-1 text-right">通过率</span>
            </div>
            {Array.from(problems.keys()).map((key, index) => {
                const problem = problems.get(key)!;
                return (
                    <div className={"flex justify-between py-2 px-6 " + (index % 2 === 0 ? "bg-[#f9f9f9]" : "")}
                         key={index}>
                        <span className="w-14 mr-10">{key}</span>
                        <Link href={`/problem/${key}`}>
                    <span
                        className="text-blue-600 font-medium opacity-70 cursor-pointer hover:opacity-90 hover:underline hover:decoration-solid transition-all">
                        {problem.title}
                    </span>
                        </Link>
                        <span
                            className="flex-1 text-right">{(Number(problem.accepted) === 0 ? 0 : Number(problem.accepted) / Number(problem.submitted) * 100).toFixed(2)}%</span>
                    </div>
                )
            })}
        </div>
    )
}