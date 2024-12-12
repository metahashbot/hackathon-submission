import {getShare} from "@/lib/contracts";

export default async function getShareByID(sid: string) {
    const shares = await getShare();
    return shares.get(sid);
}