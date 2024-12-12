'use client'

import {Questions} from "@/components"
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";
import {setTab} from "@/store/modules/oj";

export default function QuestionPage() {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(setTab(2));
    }, [dispatch]);
    return (
        <div className="min-h-screen bg-[#f1f2f5] xl:px-32 2xl:px-96 pt-20 pb-10 font-[family-name:var(--font-geist-sans)] text-black">
            <Questions/>
        </div>
    )
}