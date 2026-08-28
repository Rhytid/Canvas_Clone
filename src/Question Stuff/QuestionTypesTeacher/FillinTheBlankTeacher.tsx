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


export function FillInTheBlankTeacher({
   
    list,
    setList,
    
    Index,
    QIndex,
    setQIndex,

}: QuestionDropDownProps):React.JSX.Element{
  
    function deleteQ(id:number){
        //Creates a copy of the list and deletes the element at the given index
        //Code to delete the data
        const newList = [...list];
        newList.splice(id,1);
        setList(newList);
        setQIndex(QIndex-1);
    }

    function changePoints(event: React.ChangeEvent<HTMLInputElement>){
        const value = Number(event.target.value);
        
        const newQ = {...list[Index], Points: isNaN(value) ? 0: value};
        
        const newList = structuredClone(list);
        newList[Index] = newQ;
        setList(newList);

    }

    function changeQuestion(event: React.ChangeEvent<HTMLInputElement>){
        const newQ = {...list[Index], Question:event.target.value};
        
        const newList = structuredClone(list);
        newList[Index] = newQ;
        setList(newList);
    }

    //convert answer to an array (always)
    const answers: string[] = Array.isArray(list[Index].Answer)
        ? list[Index].Answer
        : list[Index].Answer
            ? [list[Index].Answer]
            : [];

    //helper function
    function updateAnswers (newAnswers: string[]) {
        const newList = structuredClone(list);
        newList[Index].Answer = newAnswers;
        setList(newList);
    }
    function changeAnswer(event: React.ChangeEvent<HTMLInputElement>, i: number){
        const copy = [...answers];
        copy[i] = event.target.value;
        updateAnswers(copy);
    }

    //functionality for adding and deleting answer options
    function addAnswer() {
        updateAnswers([...answers, ""]);
    }
    function removeAnswer(i: number) {
        const copy = [...answers];
        copy.splice(i, 1);
        updateAnswers(copy);
    }

    return (
        <div>
            <div>
                <Form.Label><strong>Prompt:</strong></Form.Label>
                <Form.Group controlId="QuestionBox">
                <Form.Control
                    value={list[Index].Question}
                    onChange={changeQuestion} 
                />
                </Form.Group>
            </div>
            
            <div>
                <Form.Group controlId="AnswerBox">
                    <Form.Label><strong>Correct Answers:</strong></Form.Label>
                    
                    <br/>
                    {/* multiple answer fields */}
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
                        {answers.length > 0 &&
                            answers.map((ans: string, i: number) => (
                                <li
                                    key={i}
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
                                        htmlFor={`fib-answer-${i}`}
                                        style={{
                                            fontWeight: "bold",
                                            marginBottom: 0,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Answer {i+1}:
                                    </label>

                                    {/* text box input */}
                                    <Form.Control
                                        id={`fib-answer-${i}`}
                                        style={{maxWidth: "300px"}}
                                        value={ans}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeAnswer(e, i)}
                                    />
                                    
                                    {/* delete answer option button */}
                                    <Button
                                        variant="danger"
                                        onClick={() => removeAnswer(i)}
                                        size="sm"
                                    >
                                        X
                                    </Button>
                                </li>
                        ))}
                    </ul>

                    <Button
                        variant="success"
                        size="sm"
                        onClick={addAnswer}
                    >
                        Add Answer
                    </Button>
                            
                </Form.Group>
            </div>
            <div>
                <Form.Group controlId="PointBox">
                    <Form.Label><strong>Points:</strong></Form.Label>
                    <Form.Control
                        value={list[Index].Points}
                        onChange={changePoints} 
                        />
                </Form.Group>
            </div>

            {/* save, edit, and delete buttons */}
            <Stack direction="horizontal" gap={3} className="justify-content-between mt-3">
                <Button
                        variant="danger"
                        onClick={() => {
                            deleteQ(Index);
                        }}
                        size="sm"
                        >
                    {"Delete Question"}
                </Button>
                
            </Stack>
            

        </div>
        
    );
}
