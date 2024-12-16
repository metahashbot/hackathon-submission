import {ShareContents} from "@/components"

// export function generateStaticParams() {
//     const ids: {id: string}[] = []
//     let i = 1;
//     while (i < 100) {
//         ids.push({id: i.toString()});
//         i = i + 1;
//     }
//     return ids
// }

export default async function ProblemPage({params}: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    return (
        <div className="min-h-screen bg-[#f1f2f5] xl:px-32 2xl:px-96 pt-20 pb-10 font-[family-name:var(--font-geist-sans)] text-black">
            <ShareContents id={id} />
        </div>
    )
}