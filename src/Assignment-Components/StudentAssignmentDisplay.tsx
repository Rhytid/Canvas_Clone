
import "react-datepicker/dist/react-datepicker.css";
import type { Assign } from "./Dashboard";
import { QuestionParent } from "../Question Stuff/QuestionParent";
import { StudentAssignmentHeader } from "../Header";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
//import { Card,} from "react-bootstrap";

//import "react-datepicker/dist/react-datepicker.css";


interface AssignmentProps {
  Alist: Assign[];
  Index: number;
  setAlist: React.Dispatch<React.SetStateAction<Assign[]>>;
  
}


export interface Collaborator {
    name: string;
    email: string; 
    role: string;
}

export function StudentAssignmentTaker(
    {
        Alist,
        Index,
        setAlist,
        
    }:AssignmentProps
):React.JSX.Element{

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
            const saved = localStorage.getItem("Collaborators");
            return saved ? (JSON.parse(saved) as Collaborator[]): [];
          });
          
    
          useEffect(() => {
        localStorage.setItem("Collaborators", JSON.stringify(collaborators));
      }, [collaborators]);
    

    if (Index < 0 || Index >= Alist.length) {
        return <p>No assignment seleceted</p>
    }

    const currentAssignment = Alist[Index];


    function updateName (event: React.ChangeEvent<HTMLInputElement>){
        setName(event.target.value);
    }
    function updateEmail (event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
    }

    function updateRole (event: React.ChangeEvent<HTMLInputElement>){
        setRole(event.target.value);
    }

    function addCollaborator(){
        if (!name || !email){
            return;
        }
        
        setCollaborators([...collaborators, {name, email, role}]);

        setName("");
        setEmail("");
        setRole("");
    }



    return(
            
        <div>

            <StudentAssignmentHeader
                title={currentAssignment.Title}
            />

            <p className="text-muted">
                Due: {" "}
                {currentAssignment.dueDate ? new Date(currentAssignment.dueDate).toLocaleString() : "No due date"}
            </p>

            <p className="text-muted">
                Total Points: {currentAssignment.Totalpoints}
            </p>

            <h3>Collaborators:</h3>

            <Stack direction = "horizontal" gap = {1} style = {{marginBottom: "25px"}}>
                <Form.Control placeholder = "name" value = {name} onChange = {updateName} />
                <Form.Control type = "email" placeholder = "email" value = {email} onChange = {updateEmail}/>
                <Form.Control placeholder = "role (optional)" value = {role} onChange = {updateRole}/>
                <Button style = {{marginLeft: "10px", height: "35px", width: "auto"}} onClick = {addCollaborator}> Add</Button>
            </Stack>
  
            
            <Col>{collaborators.map((collab, index) => (<li style = {{listStyleType: "none"}} key = {index}><Row>
                <Col>{collab.name}</Col> 
                <Col>{collab.email}</Col>
                <Col>{collab.role}</Col>
                <Col>
                <Button onClick={() => setCollaborators(collaborators.filter((_, i) => i !== index))}>
                Remove
            </Button> </Col></Row></li>
        ))}
            </Col>
            <hr></hr>

            {/* Use QuestionParent in student mode */}
            <QuestionParent
                
                StudentTeacher={false}
                Qlist={currentAssignment.Questions}
                // chatGPT code
                setQList={(newList) => {
                    const updatedAlist = [...Alist];
                    const updatedQuestions = 
                        typeof newList == "function"
                            ? newList(updatedAlist[Index].Questions)
                            : newList;
                        updatedAlist[Index] = {
                            ...updatedAlist[Index],
                            Questions: updatedQuestions,
                        };
                        setAlist(updatedAlist);
                }}
                AList = {Alist}
                setAList = {setAlist}
                Aindex = {Index}
            />
        </div>
        
    );
}