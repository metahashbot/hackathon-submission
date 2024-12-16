'use client'

import Rules from "@/components/problems/rules/index.mdx"

export default function RulesPage() {
    return (
        <div className="min-h-screen bg-[#f1f2f5] xl:px-32 2xl:px-96 pt-20 pb-10 font-[family-name:var(--font-geist-sans)] text-black">
            <div className="min-h-[85vh] px-3 bg-white shadow-xl">
                <article className="py-3 prose max-w-none select-text">
                    <Rules/>
                </article>
            </div>
        </div>
    )
}