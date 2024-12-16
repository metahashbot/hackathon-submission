import {getPersonalInfo} from "@/lib/contracts";

export default async function checkEnoughScore(user: string, score: number) {
    const {accepted} = await getPersonalInfo(user);
    accepted.pop();
    return (new Set(accepted.filter(pid => Number(pid) > 0))).size + 1 === score;
}