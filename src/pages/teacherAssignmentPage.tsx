import { useNavigate } from "react-router-dom";
import { LogOutButton } from "../logOutButton"
import { Button } from "react-bootstrap";
import { TeacherAssignmentHeader } from "../Header";

export function TeacherAssignmentPage (){
    const navigate = useNavigate();
    const directToTeacherDashboard = () =>{void navigate('/teacherDashboard');};
    return (
        <>
        <TeacherAssignmentHeader></TeacherAssignmentHeader>
        <hr></hr>
        <LogOutButton></LogOutButton>
        <br/>
        <Button onClick={directToTeacherDashboard}>Back to Dashboard</Button>
        </>
    )
}