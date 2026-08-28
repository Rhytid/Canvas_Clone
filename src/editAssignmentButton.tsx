import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export function EditAssignmentButton (){
    const navigate = useNavigate();
    const directToStudentAssignment = () =>{void navigate('/teacherAssignmentPage');};
    return (
        <div>
            <Button onClick={directToStudentAssignment}>Edit Assignment</Button>
        </div>
    )
}