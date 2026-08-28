import { LogOutButton } from "../logOutButton";

import { StudentDashboardHeader } from "../Header";
import { Dashboard } from "../Assignment-Components/Dashboard";

export function StudentDashboard(){
    return (
        <>
        <StudentDashboardHeader></StudentDashboardHeader>
        <><><div></div>
        <Dashboard StudentTeacher={1}/>
        {/*<TakeAssignmentButton></TakeAssignmentButton></><>*/}
        <br/>
        <LogOutButton></LogOutButton></></></>

    )
}