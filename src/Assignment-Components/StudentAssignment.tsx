import { Button, Card, Stack} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import type { Assign } from "./Dashboard";
import { useNavigate } from "react-router-dom";
import { UploadButton } from "./Importer";

interface AssignmentProps {
  Alist: Assign[];
  setAlist: React.Dispatch<React.SetStateAction<Assign[]>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}
export function StudentAssignment(
    {
        Alist,
        setAlist,
        setIndex,
    }:AssignmentProps
){
    const navigate = useNavigate();

    const directToStudentAssignment = (id:number) =>{
        setIndex(id)
        void navigate('/studentAssignmentPage');
    };

    function exporter(q:Assign){
        const fileData:string = JSON.stringify(q)
        const blob = new Blob([fileData], {type: "text/plain"})
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        //Adding space here in case of empty string
        let combo:string = "";
        if (q.Title === ""){
            combo = q.Title + "PlaceHolder" + ".json"
        }
        else{
            combo = q.Title + "" + ".json"
        }
        link.download = combo
        link.href = url;
        link.click();
    }

    if (Alist.filter(a => a.Published).length === 0) {
        return <p>No assignments yet. Go have fun!</p>
    }

    return(
        <div>
            {Alist.filter(a => a.Published).map((assignment: Assign, id: number) => 
                <Card
                    key={id}
                    className="shadow-sm my-4 border-0"
                    style={{
                        borderRadius: "12px",
                        backgroundColor: "#f0f7ff",
                    }}
                >
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <p className="mb-0 text-muted">Points: {assignment.Totalpoints}</p>

                            <p className="text-muted mb-3 text-end" style={{minWidth: "150px"}}>
                                Due:{" "}
                                {assignment.dueDate
                                ? new Date(assignment.dueDate).toLocaleString()
                                : "No due date"}
                        </p>
                        </div>

                        <h5 style = {{WebkitTextFillColor: "#1B3B6F"}} className="mb-0 text-primary flex-grow-1 text-center">{assignment.Title}</h5>
                        <br/>
                        
                        <Stack direction = "vertical" gap={2} className="justify-content-center">
                            <div>
                                {assignment.StudentAttempts<assignment.Attempts ? 
                            <div>
                                <div>
                                    <Button style = {{backgroundColor: "#1B3B6F", borderColor: "#1B3B6F"}}
                                    onClick={() => directToStudentAssignment(id)}
                                >
                                Take Assignment
                                </Button>
                                <div>
                                    Attempts Left: {assignment.Attempts - assignment.StudentAttempts}
                                </div>
                                </div>
                    
                                
                                    
                            </div>
                            :
                                <div>
                                No Attempts Left
                                </div>}
                            </div>  
                                    </Stack>
                        <div>
                                {assignment.Grade > -1 ? 
                                <div>
                                    Your Grade: {String(assignment.Grade).slice(0,4)}
                                </div>: <div></div>}
                        </div>
                        
                        <Button style = {{margin: "15px", backgroundColor: "#3f291cff", borderColor: "#3f291cff"}}
                            onClick={()=>exporter(assignment)}>
                            Export
                        </Button>
                    </Card.Body>
                </Card>
            )}
            <UploadButton
                            Alist = {Alist}
                            setAlist={setAlist}
                                
                                />
            
        </div>
    );
}