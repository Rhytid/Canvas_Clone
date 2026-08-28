import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export function TakeAssignmentButton (){
    const navigate = useNavigate();
    const directToStudentAssignment = () =>{void navigate('/studentAssignmentPage');};
    return (
        <div>
            <Button style = {{backgroundColor: "#1B3B6F"}} onClick={directToStudentAssignment}>Start Assignent</Button>
        </div>
    )
}