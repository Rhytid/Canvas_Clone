import { useNavigate, useLocation } from "react-router-dom";
import { LogOutButton } from "../logOutButton"
import { Button, Stack } from "react-bootstrap";
//import {StudentViewAssignmentHeader} from "../Header"

import { StudentAssignmentTaker } from "../Assignment-Components/StudentAssignmentDisplay";
import type { Assign } from "../Assignment-Components/Dashboard";
interface LocationState {
    Alist: Assign[];
    assignmentIndex: number;
}
export function StudentView (){
    const navigate = useNavigate();
    const location = useLocation() as { state: LocationState | null };
     const directToTeacherDashboard = () =>{void navigate('/teacherDashboard');};
    const state = location.state ;
    if (!state) {
        return (
            <div style={{ marginBottom: "50px" }}>
                <p>No assignment selected. Redirecting...</p>
                <Button onClick={directToTeacherDashboard}>Back to Teacher View</Button>
            </div>
        );
    }
   
    return (
        <><div style={{ marginBottom: "50px" }}>
                <StudentAssignmentTaker
                    Alist={state.Alist}
                    setAlist={() => {}} 
                    Index={state.assignmentIndex}
                />
                <Button 
                        style={{ marginBottom: "20px", backgroundColor: "#4786b9ff", borderColor: "#4786b9ff", borderRadius: "7px" }} 
                        onClick={directToTeacherDashboard}
                    >
                        Back to Teacher View
                    </Button>
                <Stack direction="horizontal" gap={3} className="justify-content-between mt-3">
                    
                    <LogOutButton />
                </Stack>
            </div>
            <div>
                
            </div></>
    )
}