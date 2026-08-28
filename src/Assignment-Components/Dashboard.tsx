import React, { useState, useEffect } from "react";

import {Assignment} from "./Assignment";
import type { QuestionObject } from "../Question Stuff/QuestionParent";
import { StudentAssignment } from "./StudentAssignment";
import { StudentAssignmentTaker} from "./StudentAssignmentDisplay";
import { StudentViewTaker } from "./StudentViewDisplay";
import type {Collaborator} from "./StudentAssignmentDisplay"

export interface Assign{
        editMode:boolean
        Title:string
        dueDate: Date| null
        Totalpoints:number
        time:string
        notes:string
        description:string
        showMetadata:boolean
        Questions:QuestionObject[]
        QIndex:number
        collaborators: Collaborator[]
        Attempts: number
        StudentAttempts: number
        Grade:number
        Published: boolean
    }
interface DashboardProps {
  StudentTeacher: number;
}
export function Dashboard(
    {StudentTeacher}:DashboardProps
):React.JSX.Element{
    //state
    
    const [Alist, setAlist] = useState<Assign[]>(() => {
       const saved = localStorage.getItem("AssignmentList");
       //chatGPT fix for Date picker crashing website
        if (saved) {
            try {
            // Parse directly as Assign[]
            const parsed = JSON.parse(saved) as Assign[];
            return parsed.map((a) => ({
                ...a,
                dueDate: a.dueDate ? new Date(a.dueDate) : null, // convert string to Date
            }));
            } catch (error) {
            console.error("Failed to parse AssignmentList from localStorage", error);
            return [];
            }
        }
        return [];
        });
        
      

    useEffect(() => {
        localStorage.setItem("AssignmentList", JSON.stringify(Alist));
        }, [Alist]);  
  
    const [index, setIndex] = useState<number>(() => {
        const saved = localStorage.getItem("Index");
        return saved ? (JSON.parse(saved) as number): 0;
      });
      

    useEffect(() => {
        localStorage.setItem("Index", JSON.stringify(index));
        }, [index]);

  
  

  

    /*control
    function addAssignment() {
        setAssignments([...assignments, Date.now()]) //gives the new assignment a unique ID
    }
    function deleteAssignment(id: number) {
        setAssignments(assignments.filter((assignmentId) => assignmentId !== id));
    }*/

        if (StudentTeacher === 0){
            return(
                <div>
                    <Assignment 
                    Alist={Alist}
                    setAlist={setAlist}
                    
                    />
                </div>
            )
        }
        else if (StudentTeacher === 1){
            return(
                <div>
                    <StudentAssignment
                    Alist={Alist}
                    setAlist={setAlist}
                    setIndex={setIndex}
                    />
                </div>
            )
        }
        else if (StudentTeacher === 4){
            return(
                <div>
                    <StudentViewTaker
                    Alist={Alist}
                    setAlist={setAlist}
                    Index={index}
                    />
                </div>
            )
        }
        else {
            return(
                <div>
                    <StudentAssignmentTaker
                    Alist = {Alist}
                    setAlist={setAlist}
                    Index={index}
                    
                    />
                </div>
            )
        }
    return (
        <div>
            <h2 className="text-primary fw-semibold mb-3">Assignments</h2>
            <hr></hr>
            
            <br/>
        </div>
    );
} 