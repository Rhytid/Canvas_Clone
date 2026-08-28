import { LogOutButton } from "../logOutButton";

import { Dashboard } from "../Assignment-Components/Dashboard";
import { TeacherDashboardHeader } from "../Header";



export function TeacherDashboard(){
    return (
        <>
        <TeacherDashboardHeader></TeacherDashboardHeader>
        <hr></hr>
        <>
            <Dashboard StudentTeacher={0}></Dashboard>
            <br/>
            <LogOutButton></LogOutButton>
        </>
        </>
    )
}


//OLD CODE FOR REFERENCE LATER

// import { LogOutButton } from "../logOutButton";
// import { useCallback, useEffect, useState } from "react";
// import { Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { Assignment } from "../Assignment";
// //import type { AssignmentData } from "../AssignmentData";
// import { TeacherDashboardHeader } from "../Header";


// export function TeacherDashboard(){
//     const [assignments, setAssignments] = useState<number[]>([]);
//     const navigate = useNavigate();

//     //retrieves assignments from local storage - from Copilot
//     const loadAssignments = useCallback(() => {
//         const stored = localStorage.getItem("assignments");
//         if (stored){
//             try {
//             const parsed = JSON.parse(stored) as number[];
//             if (Array.isArray(parsed)) {
//             setAssignments(parsed);
//             }
//         } catch {
//             setAssignments([]);
//         } 
//         }
//     }, []);
//     //gets the assignments list from Assignemnt.tsx - from Copilot
//     useEffect(() => {
//         loadAssignments();
//     }, [loadAssignments]);
    
//     // Refresh when tab becomes visible - from copilot 
//     useEffect(() => {
//         const handleUpdate = () => loadAssignments();
//         window.addEventListener("assignment-updated", handleUpdate);
//         return () => {
//         window.removeEventListener("assignment-updated", handleUpdate);
//     };
//     }, [loadAssignments]);
//     //sets the information into local storage - from Copilot

//     useEffect(()=>{
//         localStorage.setItem("assignments", JSON.stringify(assignments));
//     }, [assignments]);
    
//         //control - default, storage, and navigate - from Copilot
//         function addAssignment() {
//             const newId = Date.now();
//             const defaultAssignment: AssignmentData = {
//                 title: "New Assignment",
//                 dueDate: null,
//                 points: "0",
//             };
//             localStorage.setItem(`assignment-${newId}`, JSON.stringify(defaultAssignment));
//             localStorage.setItem("assignments", JSON.stringify([...assignments, newId]));
//             window.dispatchEvent(new Event("assignment-updated"));
//             void navigate(`/teacherAssignmentPage/${newId}`)
//         }
//         function deleteAssignment(id: number) {
//             setAssignments(assignments.filter((assignmentId) => assignmentId !== id));
//             localStorage.removeItem(`assignment-${id}`);
//             window.dispatchEvent(new Event("assignment-updated"));
//         }
        
//         return (
//             <div>
//                 <TeacherDashboardHeader></TeacherDashboardHeader>

//                 <hr></hr>
//                 <h2 className="text-primary fw-semibold mb-3">Assignments</h2>
//                 <hr></hr>

//                 {assignments.length === 0 ? (
//                     <p>No assignments yet. Click "New Assignment" to create your first assignment!</p>
//                 ) : (
//                     assignments.map((id) => (
//                         <Assignment key={id} id={id} onDelete={deleteAssignment} index={0}/>
//                     ))
//                 )}
//                 <br/>
//                 <Button variant="success" onClick={addAssignment}>New Assignment</Button>
//                 <LogOutButton></LogOutButton>
//             </div>
//         );
//     } 
