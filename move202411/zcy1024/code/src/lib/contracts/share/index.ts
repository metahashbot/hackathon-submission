import {Dispatch, SetStateAction} from "react";
import {getBlobIdAfterPublish} from "@/utils";
import moveCall from "@/lib/contracts/share/moveCall";

function padStart(num: number) {
    return num.toString().padStart(2, '0');
}

export default async function share(user: string, pid: string, file: File, setTips: Dispatch<SetStateAction<string>>) {
    const curDate = new Date();
    const curTime = `${curDate.getFullYear()}-${padStart(curDate.getMonth() + 1)}-${padStart(curDate.getDate())} ${padStart(curDate.getHours())}:${padStart(curDate.getMinutes())}:${padStart(curDate.getSeconds())}`;

    setTips("publishing to walrus...");
    const shareBlobId = await getBlobIdAfterPublish(user, await file.text());

    setTips("signAndExecuteTransaction...");
    try {
        if (!(await moveCall(user, pid, curTime, shareBlobId))) {
            return "Error on signAndExecuteTransaction"
        }
    } catch (error) {
        console.error(error);
        return "Run Time Error"
    }

    return "Congratulations";
}