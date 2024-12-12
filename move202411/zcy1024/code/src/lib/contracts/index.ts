import AddQuestion from "@/lib/contracts/questions";
import {getProblems, getProblemByID} from "@/lib/contracts/problems"
import submit from "@/lib/contracts/submit";
import {acceptProblem, getPersonalInfo} from "@/lib/contracts/personal"
import personalShare from "@/lib/contracts/share";
import getShare from "@/lib/contracts/share/getShare";
import getShareByID from "@/lib/contracts/share/getShareByID";
import isPermitted from "@/lib/contracts/questions/isPermitted";
import deleteByID from "@/lib/contracts/share/deleteByID";

export {
    AddQuestion,
    getProblems,
    getProblemByID,
    submit,
    acceptProblem,
    getPersonalInfo,
    personalShare,
    getShare,
    getShareByID,
    isPermitted,
    deleteByID
}