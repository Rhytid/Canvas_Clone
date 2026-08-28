import { Button, Form, Col, Row, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import { EditAssignmentButton } from "../editAssignmentButton";
import type { Assign } from "./Dashboard";
import { QuestionParent, type QuestionObject} from "../Question Stuff/QuestionParent";
import { useNavigate } from "react-router-dom"
import { UploadButton } from "./Importer";
import { exportAssignToDocx } from "../ExportDoc";



interface AssignmentProps {
  Alist: Assign[];
  setAlist: React.Dispatch<React.SetStateAction<Assign[]>>;
}


const A:Assign = {
    editMode: true,
    Title: "",
    dueDate: new Date(),
    Totalpoints: 0,
    time: "",
    notes: "",
    description: "",
    showMetadata: true,
    Questions: [],
    QIndex: 0,
    collaborators: [],
    Attempts: 1,
    StudentAttempts: 0,
    Grade: -1,
    Published: false,
}


export function Assignment(
    {Alist,
    setAlist,
    
    }:AssignmentProps
): React.JSX.Element {

        

    //state
    

    //const [title, setTitle] = useState<string>("Enter Assignment Title Here");
    //const [dueDate, setDueDate] = useState<Date | null>(null);
    //const [points, setPoints] = useState<number>(0);
    //metadata
    //const [time, setTime] = useState<string>("Enter Estimated Time Here");
    //const [notes, setNotes] = useState<string>("Notes to Self");
    //const [description, setDescription] = useState<string>("Enter Assignment Description Here");
    //const [showMetadata, setShowMetadata] = useState<boolean>(true);

    //control
    function createAssignment(): void{
        const newList = structuredClone(Alist)
        newList.push(structuredClone(A))
        setAlist(newList)
    }
    function updateMode(index:number){
        const newA = structuredClone(Alist[index])
        newA.editMode = (!newA.editMode)
        const newList = structuredClone(Alist)
        newList[index] = newA
        setAlist(newList)

    }
    function updateTitle(event: React.ChangeEvent<HTMLInputElement>, index:number) {
        const newA = structuredClone(Alist[index])
        newA.Title = (event.target.value)
        const newList = structuredClone(Alist)
        newList[index] = newA
        setAlist(newList)
    }
    // **eliminate to make points auto-sum
    // function updatePoints(event: React.ChangeEvent<HTMLInputElement>, index:number) {
    //     const newA = structuredClone(Alist[index])
    //     newA.Totalpoints = Number(event.target.value)
    //     const newList = structuredClone(Alist)
    //     newList[index] = newA
    //     setAlist(newList)
    // }
    function updateDescription(event: React.ChangeEvent<HTMLInputElement>, index:number) {
        const newA = structuredClone(Alist[index])
        newA.description = (event.target.value)
        const newList = structuredClone(Alist)
        newList[index] = newA
        setAlist(newList)
    }
    function updateTime(event: React.ChangeEvent<HTMLInputElement>, index:number) {
        const newA = structuredClone(Alist[index])
        newA.time = (event.target.value)
        const newList = structuredClone(Alist)
        newList[index] = newA
        setAlist(newList)
    }
    function updateNotes(event: React.ChangeEvent<HTMLInputElement>, index:number) {
        const newA = structuredClone(Alist[index])
        newA.notes = (event.target.value)
        const newList = structuredClone(Alist)
        newList[index] = newA
        setAlist(newList)
    }
    //checkbox to show or hide metadata
    function updateShowMetadata(event: React.ChangeEvent<HTMLInputElement>, index:number) {
        const newA = structuredClone(Alist[index])
        newA.showMetadata = event.target.checked;
        const newList = structuredClone(Alist)
        newList[index] = newA
        setAlist(newList)
    }

    function deleteA(index:number){
         const newList = structuredClone(Alist)
         newList.splice(index,1)
         setAlist(newList)
    }
    function updateAttempts(event:React.ChangeEvent<HTMLInputElement>, index:number){
        const newA = structuredClone(Alist[index])
        newA.Attempts = Number(event.target.value)
        const newList = structuredClone(Alist)
        newList[index] = newA
        setAlist(newList)
    }

    

     //https://spin.atomicobject.com/create-export-react-frontend/   
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

    function setDueDate(date:Date | null, index:number){
        const newA = structuredClone(Alist[index])
        newA.dueDate = (date)
        const newList = structuredClone(Alist)
        newList[index] = newA
        setAlist(newList)
    }

    function togglePublish(index: number) {
        const updated = structuredClone(Alist);
        updated[index].Published = !updated[index].Published;
        setAlist(updated);
    }

    //function called by clicking the "View as Student" button
    //takes the user to the assignment in the student view
    const navigate = useNavigate();
    const directToStudentView = (assignmentIndex: number) => {
        void navigate('/studentView', { state: { Alist, assignmentIndex } });
    };

    //functions used to reorder the assignments 
    function moveUp(index: number) {
        if (index <= 0) return; 
        const newList = [...Alist];
        [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
        setAlist(newList);
    }

    function moveDown(index: number) {
        if (index >= Alist.length - 1) return; 
        const newList = [...Alist];
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
        setAlist(newList);
    }

    //assignment has a box around it and two buttons to view it using the functions above
    return (
        <div>
            <div>
                {Alist.length === 0 ? (
                                <p>No assignments yet. Click "New Assignment" to create your first assignment!</p>
                            ) : (
                                Alist.map((Assignment:Assign, index:number) => (
                                    <div key={index}>
                                        <Card className="shadow-sm my-4 border-0" style={{
                                            borderRadius: "12px",
                                            backgroundColor: "#f0f7ff",
                                        }}
                                        >
                                        <Card.Body>
                {Assignment.editMode ? (
                    <>
                        <div className="position-relative mb-4">
                            {/* buttons formatting html */}
                                <Button 
                                    variant="danger"
                                    className="position-absolute"
                                    style={{left: 0, top: 0}}
                                    onClick={() => deleteA(index)}
                                >
                                    Delete Assignment
                                </Button>
                                <Button 
                                    variant="success"
                                    className="position-absolute"
                                    style={{right: 0, top: 0}}
                                    onClick={()=>updateMode(index)}
                                >
                                    Save Assignment
                                </Button>

                                <h5 className="text-primary fw-semibold text-center mt-5 mx-auto" style={{ maxWidth: "60%", wordBreak: "break-word", overflowWrap: "break-word" }}>Editing {Assignment.Title}</h5>
                        </div>

                        <Form>
                            {/* title html */}
                            <Form.Group as={Row} className="mb-3 align-items-center">
                                <Form.Label column sm={3}>
                                    <strong>Assignment Title:</strong>
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        value={Assignment.Title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>updateTitle(e, index)}
                                        placeholder="Enter Assignment Title Here"
                                    />
                                </Col>
                            </Form.Group>

                            {/* due date html */}
                            <Form.Group as={Row} className="mb-3 align-items-center">
                                <Form.Label column sm={3}>
                                    <strong>Due Date:</strong>
                                </Form.Label>
                                <Col sm={9}>
                                    <DatePicker
                                        selected={Assignment.dueDate}
                                        onChange={(date: Date | null) => setDueDate(date, index)}
                                        showTimeSelect
                                        timeFormat="h:mm aa"
                                        timeIntervals={15}
                                        //LATER ADJUST SO TIME IS MANUAL INPUT (can do 11:59PM)
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        placeholderText="Select due date and time"
                                        className="form-control"
                                        wrapperClassName="w-100"
                                    />
                                </Col>
                            </Form.Group>

                            {/* points html */}
                            <Form.Group as={Row} className="mb-4 align-items-center">
                                <Form.Label column sm={3}>
                                    <strong>Points:</strong>
                                </Form.Label>
                                <Col sm={9}>
                                    <div className="form-control" style={{textAlign: "left"}}>
                                        {Assignment.Totalpoints}
                                    </div>
                                </Col>
                            </Form.Group>


                            <Form.Group as={Row} className="mb-4 align-items-center">
                                <Form.Label column sm={3}>
                                    <strong>Attempts:</strong>
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="number"
                                        value={Assignment.Attempts}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>updateAttempts(e, index)}
                                        placeholder="Enter Points Value Here"
                                    />
                                </Col>
                            </Form.Group>

                            
                            {/* show (and edit!) metadata html */}
                            <Form.Check
                                inline
                                type="checkbox"
                                id={`show-metadata-${index}`}
                                label={<span className="fw-bold">Show Metadata</span>}
                                checked={Assignment.showMetadata}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>updateShowMetadata(e,index)}
                                className="mb-3"
                            />

                            {/* Metadata fields html */}
                            {Assignment.showMetadata && (
                                <Card className="p-3 mt-3 bg-light rounded shadow-sm border-0">
                                    <div className="d-flex flex-column gap-3">
                                        {/* description html */}
                                        <Form.Group as={Row} className="mb-3 align-items-center">
                                            <Form.Label column sm={3} className="fw-bold">Assignment Description:</Form.Label>
                                            <Col sm={9}>
                                                <Form.Control
                                                    type="text"
                                                    value={Assignment.description}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDescription(e, index)}
                                                    placeholder="Enter assignment description here"
                                                />
                                            </Col>
                                        </Form.Group>
                                        {/* time html */}
                                        <Form.Group as={Row} className="mb-3 align-items-center">
                                            <Form.Label column sm={3} className="fw-bold">Estimated Time to Complete:</Form.Label>
                                            <Col sm={9}>
                                                <Form.Control
                                                    type="text"
                                                    value={Assignment.time}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTime(e, index)}
                                                    placeholder="Enter estimated time here"
                                                />
                                            </Col>
                                        </Form.Group>
                                        {/* notes html */}
                                        <Form.Group as={Row} className="mb-3 align-items-center">
                                            <Form.Label column sm={3} className="fw-bold">Instructor Notes:</Form.Label>
                                            <Col sm={9}>
                                                <Form.Control
                                                    type="text"
                                                    value={Assignment.notes}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNotes(e, index)}
                                                    placeholder="Add notes here"
                                                />
                                            </Col>
                                        </Form.Group>
                                </div>
                            </Card>                    
                        )}
                    </Form>
                </>
                    
                ) : (
                    <>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="mb-3" style={{textAlign: "left"}}>
                                <p className="mb-1 text-muted">
                                    Points: {Assignment.Totalpoints}
                                    <br/>
                                    Due on: {Assignment.dueDate ? Assignment.dueDate.toLocaleString() : "No Due Date Set"}
                                </p>
                            </div>
                            
                            <div className="d-flex align-items-center gap-2">
                                <Button
                                    size="sm"
                                    style={{ backgroundColor: "#564787", borderColor: "#564787", borderRadius: "7px", fontWeight: "bold" }}
                                    onClick={() => moveUp(index)}
                                >
                                    ⇧
                                </Button>
                                <Button
                                    size="sm"
                                    style={{ backgroundColor: "#564787", borderColor: "#564787", borderRadius: "7px", fontWeight: "bold" }}
                                    onClick={() => moveDown(index)}
                                >
                                    ⇩
                                </Button>
                            </div>
                        </div>
                        
                        <div className="d-flex flex-column align-items-center gap-2">
                            <div className="d-flex gap-2">
                                <Button variant="danger" onClick={() => deleteA(index)}>Delete Assignment</Button>
                                <Button style={{ backgroundColor: "#ED9B40", borderColor: "#E5B335" }} onClick={()=>updateMode(index)}>Edit Assignment</Button>
                                <Button 
                                    style={{ backgroundColor: "#1B3B6F", borderColor: "#1B3B6F" }} 
                                    onClick={() => directToStudentView(index)}
                                >
                                    View as Student
                                </Button>
                            </div>
                        </div>

                        <br/>
                        <h5 style = {{WebkitTextFillColor: "#1B3B6F"}}  className="mb-0 text-primary">{Assignment.Title}</h5>
                        <br/>

                        {/* show metadata html */}
                        <Form.Check
                            inline
                            type="checkbox"
                            id="show-metadata"
                            label={<span className="fw-bold">Show Metadata</span>}
                            checked={Assignment.showMetadata}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>updateShowMetadata(e,index)}
                            className="mb-3"
                        />
                        {Assignment.showMetadata &&
                        <div className="p-3 mt-2 bg-light rounded shadow-sm border">
                            <p className="mb-2">
                                <strong>Assignment Description:</strong> {Assignment.description}
                            </p>
                            <p className="mb-2">
                                <strong>Estimated Time to Complete:</strong> {Assignment.time}
                            </p>
                            <p className="mb-2">
                                <strong>Instructor Notes:</strong> {Assignment.notes}
                            </p>
                        </div>}
                        
                        
                    </>
                )}
                {!Assignment.editMode &&
                        <div className="d-flex flex-column align-items-center gap-2">
                            <div className="d-flex gap-2">
                                <Button style = {{marginTop: "20px", backgroundColor: "#3c1942ff", borderColor: "#3c1942ff"}}
                        onClick={()=>exporter(Assignment)}>
                            Export as JSON
                        </Button>
                        <Button style = {{marginTop: "20px", backgroundColor: "#41A5EE", borderColor: "#41A5EE"}}
                        onClick={()=>
                        {void exportAssignToDocx(Assignment)}}>
                            Export as DOCX
                        </Button>
                                
                                <Button style = {{marginTop: "20px", marginBottom: "1px"}}
                                    variant={Assignment.Published ? "danger" : "success"}
                                    onClick={() => togglePublish(index)}
                                >{Assignment.Published ? "Unpublish" : "Publish"}</Button>
                            </div>
                        </div>
                        }
                {Assignment.editMode && 
                    
                    <QuestionParent 
                    
                    StudentTeacher={true}
                    Qlist={Alist[index].Questions}
                    setQList={(newList) => {
                    const updatedAlist = structuredClone(Alist);
                    const updatedQuestions =
                    typeof newList === "function"
                    ? newList(updatedAlist[index].Questions)
                        : newList;
                    
                        //recalculate total points based on question points
                    const newTotal: number = updatedQuestions.reduce(
                        (sum: number, q: QuestionObject) => sum + (q.Points),
                        0
                    );
                    updatedAlist[index] = {
                    ...updatedAlist[index],
                    Questions: updatedQuestions,
                    Totalpoints: newTotal
                    };
                    setAlist(updatedAlist);
                    }}
                    AList = {Alist}
                    setAList = {setAlist}
                    Aindex = {index}
                    ></QuestionParent>
                }
                
                        </Card.Body>
                    </Card>
                    
                                </div>
                                ))
                            )}
                    
                <Button style={{marginTop: "10px", marginBottom: "10px"}} variant="success" onClick={createAssignment}>New Assignment</Button>
                
                <UploadButton
                Alist = {Alist}
                setAlist={setAlist}
                    />
                
                
            </div>
        </div>        
    );
}