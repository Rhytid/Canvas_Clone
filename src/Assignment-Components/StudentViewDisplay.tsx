
import "react-datepicker/dist/react-datepicker.css";
import type { Assign } from "./Dashboard";
import { QuestionParent } from "../Question Stuff/QuestionParent";
import {  StudentViewAssignmentHeader } from "../Header";
//import { Card,} from "react-bootstrap";

//import "react-datepicker/dist/react-datepicker.css";


interface AssignmentProps {
  Alist: Assign[];
  Index: number;
  setAlist: React.Dispatch<React.SetStateAction<Assign[]>>;
}
export function StudentViewTaker(
    {
        Alist,
        Index,
        setAlist
    }:AssignmentProps
):React.JSX.Element{

    if (Index < 0 || Index >= Alist.length) {
        return <p>No assignment seleceted</p>
    }

    const currentAssignment = Alist[Index]
    
    return(
            
        <div>

            <StudentViewAssignmentHeader
                title={currentAssignment.Title}
            />

            <p className="text-muted">
                Due: {" "}
                {currentAssignment.dueDate ? new Date(currentAssignment.dueDate).toLocaleString() : "No due date"}
            </p>

            <p className="text-muted">
                Total Points: {currentAssignment.Totalpoints}
            </p>

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