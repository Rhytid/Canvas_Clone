
import { useNavigate } from "react-router-dom";
import { LogOutButton } from "../logOutButton"
import { Button } from "react-bootstrap";
import { Dashboard } from "../Assignment-Components/Dashboard";




export function StudentAssignmentPage ()
   

{
    const navigate = useNavigate();
   
    const directToStudentDashboard = () =>{void navigate('/studentDashboard');};
    return (
        <>

        <div>
            <Dashboard StudentTeacher={3}/>
            
        </div>
        <div>
            <Button onClick={directToStudentDashboard}>Back to Dashboard</Button>
            <br/>
            <br/>
            <LogOutButton></LogOutButton>
        </div></>
    )
}