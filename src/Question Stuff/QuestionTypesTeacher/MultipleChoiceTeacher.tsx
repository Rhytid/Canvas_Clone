
import { Button, Stack } from "react-bootstrap";
import type { QuestionObject } from "../QuestionParent";
import Form from "react-bootstrap/Form"



interface QuestionDropDownProps {
  
  list: QuestionObject[];
  setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  Index:number
  QIndex:number
  setQIndex: React.Dispatch<React.SetStateAction<number>>;
  
};


export function MultipleChoiceTeacher({
    list,
    setList,
    
    
    Index,
    QIndex,
    setQIndex,
    

}: QuestionDropDownProps):React.JSX.Element{

    //helper function to write a modified question back into list
    function writeQuestion(updatedQ: QuestionObject) {
        const newList = structuredClone(list);
        newList[Index] = updatedQ;
        setList(newList);
    }
  

    //Creates a copy of the list and deletes the element at the given index
    function DeleteA(answerIndex:number){
        const question = structuredClone(list[Index]);
        const newAnswers = structuredClone(question.Answers);
        newAnswers.splice(answerIndex, 1);

        //remove deleted answer from correct answers
        const newCorrect: string[] = Array.isArray(question.Answer)
        ? structuredClone(question.Answer) : [];
        const removed = question.Answers[answerIndex];
        const filteredCorrect = newCorrect.filter((a: string) => a !==removed);

        question.Answers = newAnswers;
        question.Answer = filteredCorrect;
        writeQuestion(question);
    }

    
    function AddAnswer(){
        const question = structuredClone(list[Index]);
        question.Answers = [...(question.Answers), ""];
        writeQuestion(question);
    }

    function setAnswer(event: React.ChangeEvent<HTMLInputElement>, answerIndex:number){
        const question = structuredClone(list[Index]);
        const answers = structuredClone(question.Answers);
        answers[answerIndex] = event.target.value;

        //if answer was part of correct answer list, update that entry too
        const correct: string[] = Array.isArray(question.Answer)
        ? structuredClone(question.Answer) : [];

        //replace old value with new value
        const old = list[Index].Answers[answerIndex];
        question.Answers = answers;
        question.Answer = correct.map((a: string) => (a === old ? event.target.value : a));
        writeQuestion(question);
    }
    
    function deleteQ(id:number){
        //Creates a copy of the list and deletes the element at the given index
        //Code to delete the data
        const newList = structuredClone(list);
        newList.splice(id,1);
        setList(newList)
        setQIndex(QIndex-1)
    }

    function setQuestion(event: React.ChangeEvent<HTMLInputElement>){
        
        const newQ = structuredClone(list[Index]);
        newQ.Question = event.target.value;
        writeQuestion(newQ);
        
    }

    function changePoints(event: React.ChangeEvent<HTMLInputElement>){
        const newQ = structuredClone(list[Index])
        const val = Number(event.target.value);
        newQ.Points = Number.isFinite(val) ? val : 0;
        writeQuestion(newQ);
    }

    //control for multiple answer mode
    function toggleMultAns() {
        const q = structuredClone(list[Index]);
        q.MultipleAnswers = !q.MultipleAnswers;

        //if switching from multiple to single, keep only first correct answer in list
        if (!q.MultipleAnswers && Array.isArray(q.Answer) && q.Answer.length > 1) {
            q.Answer = q.Answer.slice(0, 1);
        }

        writeQuestion(q);
    }

    function setCorAns(Ans: string){
        const newQ = structuredClone(list[Index]);
        const currentCorrect: string[] = Array.isArray(newQ.Answer) ? structuredClone(newQ.Answer) : [];

        if (newQ.MultipleAnswers) {
            if (currentCorrect.includes(Ans)) {
                newQ.Answer = currentCorrect.filter((a) => a !==Ans);
            }
            else {
                newQ.Answer = [...currentCorrect, Ans];
            }
        }
        else {
            newQ.Answer = [Ans];
        }

        writeQuestion(newQ);
    }

    function moveAnswerUp(answerIndex:number){
        //Moves the answer indexup by one but only if its not 0
        if (answerIndex===0) return;
        
        const q = structuredClone(list[Index]);
        const answers = structuredClone(q.Answers);
        [answers[answerIndex-1], answers[answerIndex]] = [answers[answerIndex], answers[answerIndex-1]];
        
        q.Answers = answers;
        writeQuestion(q);
    }
    function moveAnswerDown(answerIndex :number){
        const q = structuredClone(list[Index]);
        //do nothing if last in list
        if (answerIndex === q.Answers.length-1) return;

        const answers = structuredClone(q.Answers);
        [answers[answerIndex+1], answers[answerIndex]] = [answers[answerIndex], answers[answerIndex+1]];
        q.Answers = answers;
        writeQuestion(q);
    }


    //Theres a bug that links all the answers together please fix it 
    return (
        <div>
            {/* formatting of the question prompt */}
            <Form.Group controlId="Question">
                <Form.Label><strong>Prompt:</strong></Form.Label>
                <Form.Control                
                    value={list[Index].Question}
                    onChange = {setQuestion}            
                />
            </Form.Group>

            {/* switch to enable multiple answer mode */}
            <div style={{marginTop: "12px", marginBottom: "8px"}}>
                <Form.Check
                    type="switch"
                    inline
                    id={`multi-toggle-${Index}`}
                    label="Allow multiple correct answers"
                    checked={Boolean(list[Index].MultipleAnswers)}
                    onChange={toggleMultAns}
                />
            </div>

            {/* list of answer options */}
            <br/>
            <ul
                style={{
                    listStyle: "none",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%"
                }}
            >
                {list[Index].Answers.length > 0 &&
                    list[Index].Answers.map((Answer:string, id:number)=>(
                        <li
                            key={id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                width: "100%",
                                marginBottom: "4px"
                            }}
                        >
                        
                        <label 
                            htmlFor={`answer-${id}`}
                            style={{
                                fontWeight: "bold",
                                marginBottom: 0,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Option {id+1}:
                        </label>
                        <Form.Control   
                            id={`answer-${id}`}             
                            style={{maxWidth: "300px"}}
                            value={Answer}
                            onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setAnswer(e,id)}
                                             
                            />
                        
                        <Button
                            variant="danger"
                            onClick={() => {
                                DeleteA(id);
                            }}
                            
                            size="sm"
                            >
                            {"X"}
                        </Button>
                        <Button
                        variant="success"
                        onClick={() => {
                            moveAnswerUp(id);
                        }}
                        size="sm">
                        {"↑"}
                            
                        </Button>
                        <Button
                        variant="success"
                        onClick={() => {
                            moveAnswerDown(id);
                        }}
                        size="sm">
                        {"↓"}
                            
                        </Button>
                        
                            </li>

                        
                    ))
                }
            </ul>

            {/* add answer button at bottom of options list */}
            <ul>
                <Button
                    variant="success"
                    onClick={() => {
                        AddAnswer();
                    }}
                    size="sm"
                    
                    >
                Add Answer
                </Button>
            </ul>

            {/* answer selection */}
            {list[Index].Answers.length > 0 && (
                <Form.Group controlId="CorrectAnswer">
                    <Form.Label><strong>Answer:</strong></Form.Label>
                    <br/>
                    {list[Index].Answers.map((answer: string, id: number) => {
                        const isChecked = Array.isArray(list[Index].Answer) && list[Index].Answer.includes(answer);

                        return (
                            <Form.Check
                                key={id}
                                inline
                                type={list[Index].MultipleAnswers ? "checkbox" : "radio"}
                                name={`correct-answer-${Index}`}
                                label={answer || `Option ${id+1}`}
                                checked={isChecked}
                                onChange={() => setCorAns(answer)}
                            />
                        );
  
                    })}
                </Form.Group>
            )}
            

            {/* points input */}
            <Form.Group controlId="PointBox">
            <Form.Label><strong>Points:</strong></Form.Label>
            <Form.Control
                //type ="number"
                value={list[Index].Points}
                onChange={changePoints} 
                />
            </Form.Group>

            {/* delete button */}
            <Stack direction="horizontal" gap={3} className="justify-content-between mt-3">
                <Button
                    variant="danger"
                    onClick={() => {
                        deleteQ(Index);
                    }}
                    size="sm"
                >
                    Delete Question
                </Button>
                
            </Stack>

        </div>
        
        
    );
}