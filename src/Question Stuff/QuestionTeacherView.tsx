
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import type { QuestionObject } from "./QuestionParent";

import { MultipleChoiceTeacher } from "./QuestionTypesTeacher/MultipleChoiceTeacher";
import { FreeResponseTeacher } from "./QuestionTypesTeacher/FreeResponseTeacher";
import { TrueFalseTeacher } from "./QuestionTypesTeacher/TrueFalseTeacher";
import { FillInTheBlankTeacher } from "./QuestionTypesTeacher/FillinTheBlankTeacher";
import { CodingTeacher } from "./QuestionTypesTeacher/CodingTeacher";
import { PagerBreak } from "./QuestionTypesTeacher/PageBreakTeacher";
import { InstructionBox } from "./QuestionTypesTeacher/InstructionBox";

import type { MultipleChoiceQ } from "./QuestionParent";
import type { TrueFalseQ } from "./QuestionParent";
import type { FreeResponseQ } from "./QuestionParent";
import type { CodingQ } from "./QuestionParent";
import type { FIBQ } from "./QuestionParent";
import type { PageBreak } from "./QuestionParent";
import type { Instructions } from "./QuestionParent";


//Declaring a temporary instance of each question type
const MCQ:MultipleChoiceQ = {
    
    Question:"",
    Answers:[],
    Answer:"",
    Points:0,
    Type:"Multiple Choice Question",
    StudentAnswer: "",
    MultipleAnswers: false,
}

const TFQ: TrueFalseQ={
    
    Question:"",
    Answers:[],
    Answer:"",
    Points:0,
    Type:"True False Question",
    StudentAnswer: "",
    MultipleAnswers: false,
}

const FRQ: FreeResponseQ={

    Question:"",
    Answers:[],
    Answer:"",
    Points:0,
    Type:"Free Response Question",
    StudentAnswer: "",
    MultipleAnswers: false, 
    rubric: {title: "", criteria: [
      {title: "",
        description: "",
        points: 0,
        ratings: [
          {title: "Full Credit", description: "Default full score", points: 0},
          {title: "No Credit", description: "Default zero score", points: 0}
        ]
      }
    ]},
    rubricVisibility: "hidden"
}

const CQ: CodingQ={
   
    Question:"",
    Answers:[],
    Answer:"",
    Points:0,
    Type: "Coding Question",
    StudentAnswer: "",
    MultipleAnswers: false,
    Files: [],
    Language: "python"
}
const FIB: FIBQ={
    Question:"",
    Answers:[],
    Answer:"",
    Points:0,
    Type: "Fill In The Blank Question",
    StudentAnswer: "",
    MultipleAnswers: false,
}
const PB: PageBreak={
    Question:"",
    Answers:[],
    Answer:"",
    Points:0,
    Type:"Page Break",
    StudentAnswer:"",
    MultipleAnswers: false,
}
const IB: Instructions={
    Question:"",
    Answers:[],
    Answer:"",
    Points:0,
    Type:"Instruction Box",
    StudentAnswer:"",
    MultipleAnswers: false,
}

//Assigning each string on each button to a function so it can be called based on the string
const QuestionEdit: Record<string, QuestionObject> = { //Assigning each question type/ string, to a function call to display something
    "Multiple Choice" : MCQ,
    "True False":TFQ,
    "Free Response": FRQ,
    "Coding": CQ,
    "Fill in the Blank": FIB,
    "Page Break": PB,
    "Instruction Box": IB
    

};
interface QuestionDropDownProps {
  allOptions: string[];
  list: QuestionObject[];
  setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  
};
export function QuestionDropDown({
    allOptions,
    list,
    setList,
    
    
}: QuestionDropDownProps): React.JSX.Element {
    
    
    //state for which question type is chosen
    const [type, setType] = useState<string>(allOptions[0]);

    const [Qindex, setQIndex] = useState<number>(() => {
            const saved = localStorage.getItem("QIndex");
            return saved ? (JSON.parse(saved) as number): 0;
          });
          
    
          useEffect(() => {
        localStorage.setItem("Index", JSON.stringify(Qindex));
      }, [Qindex]);
    
            
          
    
         
    

    //control for which question type is chose
    function updateType(event: React.ChangeEvent<HTMLSelectElement>) {
            setType(event.target.value);
    }
    
    function chooseMember(QType: string) {
        const temp = QuestionEdit[QType]
        const newQuestion:QuestionObject = structuredClone(temp)
        const newList = [...list, newQuestion];
        
        setList(newList);
        console.log(QType)
        if(QType!== "Page Break" && QType!== "Instruction Box"){
            setQIndex(Qindex+1)
        }
   
}

    function clearQuestions() {
        setList([]);
        setQIndex(0)
        
    }
    
    function moveUp(index: number) {
        if (index <= 0) return; 
        const newList = [...list];
        [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
        setList(newList);
    }

    function moveDown(index: number) {
        if (index >= list.length - 1) return; 
        const newList = [...list];
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
        setList(newList);
    }
    
    
    

    function getQuestionIndex(list: QuestionObject[], realIndex: number) {
    return list.slice(0, realIndex).filter(q => q.Type !== "Page Break" && q.Type !== "Instruction Box").length + 1;
}




    // First part makes the choices to add different question types in a dropdown format
    // Second part is a button to actually add the questions
    // Then it will add a place to edit the title and due date, along with an edit and delete button
    // When the edit button is clicked based on the type the user will have different UIs to edit the question
    return (
        <div>
            <h2 className="text-primary fw-semibold mb-3">Questions</h2>
            <hr></hr>

            {list.length===0 && <p>No questions yet. Click "Add Question" to create your first question!</p>}
            
            {/* html for dynamic question list */}
            {list.map((q:QuestionObject, index:number) => (
                <Card
                    key={index}
                    className="p-3 mt-3 bg-light rounded shadow-sm border-0"
                    style={{
                        borderRadius: "12px",
                        backgroundColor: "#f0f7ff",
                    }}
                >
                    <Card.Body>
                        {q.Type !== "Page Break" && q.Type!== "Instruction Box" && (
                            <>
                                {/* match header to assignments in saved mode */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    {/* left side - points and question type */}
                                    <div style={{textAlign: "left"}}>
                                        <p className="mb-1 text-muted">
                                            Points: {q.Points}
                                            <br/>
                                            {q.Type}
                                        </p>
                                    </div>

                                    {/* right side - reorder buttons */}
                                    <div className="d-flex align-items-center gap-2">
                                        <Button size="sm" style = {{backgroundColor: "#2f46adff", borderColor: "#2f46adff", borderRadius: "7px", fontWeight: "bold"}} onClick={() => moveUp(index)}>⇧</Button>
                                        <Button size="sm" style = {{backgroundColor: "#2f46adff", borderColor: "#2f46adff", borderRadius: "7px", fontWeight: "bold"}} onClick={() => moveDown(index)}>⇩</Button>
                                    </div>
                                </div>

                                <h5 className="mb-3 text-primary">Question {getQuestionIndex(list,index)}</h5>
                            </>
                        )}

                        {q.Type === "Page Break" || q.Type=== "Instruction Box" && (
                            <>
                                {/* right side - reorder buttons */}
                                <div style={{textAlign: "right"}} className="gap-3">
                                    <Button size="sm" style = {{backgroundColor: "#2f46adff", borderColor: "#2f46adff", borderRadius: "7px", fontWeight: "bold"}} onClick={() => moveUp(index)}>⇧</Button>
                                    {" "}
                                    <Button size="sm" style = {{backgroundColor: "#2f46adff", borderColor: "#2f46adff", borderRadius: "7px", fontWeight: "bold"}} onClick={() => moveDown(index)}>⇩</Button>
                                </div>
                            </>
                        )}

                        
                        {/* render based on question type */}
                        {q.Type === "Multiple Choice Question" && 
                        <MultipleChoiceTeacher
                            
                            list={list}
                            setList={setList}
                            Index = {index}
                            QIndex={Qindex}
                            setQIndex = {setQIndex}
                            
                        />}
                        {q.Type === "Free Response Question" && 
                        <FreeResponseTeacher
                            list = {list}
                            setList = {setList}
                            
                            Index = {index}
                            QIndex={Qindex}
                            setQIndex = {setQIndex}
                        />}
                        {q.Type === "True False Question" && 
                            <TrueFalseTeacher
                                list = {list}
                                setList = {setList}
                                
                                Index = {index}
                                QIndex={Qindex}
                                setQIndex = {setQIndex}
                            
                        />}
                        {q.Type === "Fill In The Blank Question" && 
                            <FillInTheBlankTeacher
                                list = {list}
                                setList = {setList}
                                
                                Index = {index}
                                QIndex={Qindex}
                                setQIndex = {setQIndex}
                            
                        />}
                        {q.Type === "Coding Question" && 
                            <CodingTeacher
                                list = {list}
                                setList = {setList}
                                Q = {q}
                                Index = {index}
                                QIndex={Qindex}
                                setQIndex = {setQIndex}
                            
                        />}
                        {q.Type === "Page Break" &&
                            <PagerBreak
                            list = {list}
                            setList = {setList}
                            Index = {index}
                            />
                                }
                        {q.Type === "Instruction Box" &&
                            <InstructionBox
                            list = {list}
                            setList = {setList}
                            Index = {index}
                            />
                                }
                       
                    </Card.Body>
                    
                </Card>


            ))}

            {/* html to add a question (dropdown box) */}
            <Card
                className="shadow-sm bg-light border-0 mt-4"
                style={{
                    backgroundColor: "#f0f7ff",
                    borderRadius: "12px",
                    padding: "20px",
                }}
            >
                <Card.Body className="text-center">
                    <h5 className="mb-3 text-primary">New Question</h5>
                    <Row className="justify-content-center mb-3">
                        <Col xs={12} md={6}>
                            <Form.Select
                                value={type}
                                onChange={updateType}
                                style={{ 
                                    width: "100%",
                                    //maxWidth: "500px",
                                    marginBottom: "12px",
                                    textAlign: "center",
                                    padding: "10px"
                                }}
                            >
                                {allOptions.map((option: string) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                    
                    <Button
                        variant="success"
                        onClick={()=>chooseMember(type)}
                        style={{marginBottom: "16px"}}
                    >
                        Add Question
                    </Button>
                    {" "}
                    <Button 
                        variant="danger" 
                        onClick={clearQuestions}
                        style={{marginBottom: "16px"}}
                        >Clear Questions
                        
                    </Button>

                </Card.Body>
            </Card>

            
            <br/>
        <br/>
            <br/>
        </div>
    );
}