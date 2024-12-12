import {getProblems} from "@/lib/contracts";

export default async function getProblemByID(pid: string) {
    const problems = await getProblems();
    return problems.get(pid);
}