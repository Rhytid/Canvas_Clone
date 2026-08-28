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


export function TrueFalseTeacher({
   
    list,
    setList,
    
    Index,
    QIndex,
    setQIndex,

}: QuestionDropDownProps):React.JSX.Element{
  

    

    

    
    function deleteQ(id:number){
        //Creates a copy of the list and deletes the element at the given index
        //Code to delete the data
        const newList = [...list]
        newList.splice(id,1);
        setList(newList)
        setQIndex(QIndex-1)
    }

    //Error here where if you pass in too many non integer characters it displays NaN and you can no longer edit it
    function changePoints(event: React.ChangeEvent<HTMLInputElement>){
        
        const newQ = {...list[Index], Points:Number(event.target.value)}
        const newList = structuredClone(list)
        newList[Index] = newQ
        setList(newList)

    }

    function changeQuestion(event: React.ChangeEvent<HTMLInputElement>){
        const newQ = {...list[Index], Question:event.target.value}
        const newList = structuredClone(list)
        newList[Index] = newQ
        setList(newList)
    }
    function changeAnswer(event: React.ChangeEvent<HTMLInputElement>){
        const newQ = {...list[Index], Answer:event.target.value}
        const newList = structuredClone(list)
        newList[Index] = newQ
        setList(newList)
    }

    return (
        <div>
            <div>
                <Form.Label><strong>Prompt:</strong></Form.Label>
                <Form.Group controlId="QuestionBox">
                <Form.Control
                value={list[Index].Question}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeQuestion(e)} 
                />
                </Form.Group>
            </div>
            
            
            <div>
                <Form.Group controlId="AnswerBox">
                    <Form.Label><strong>Answer:</strong></Form.Label>
                <br/>
                    <Form.Check
                        inline
                        type="radio"
                        name={`question-${list[Index].Question}`}
                        label="True"
                        value="True"
                        checked={list[Index].Answer==="True"}
                        onChange={changeAnswer}
                        
                        />
                    <Form.Check
                        inline
                        type="radio"
                        name={`question-${list[Index].Question}`}
                        label="False"
                        value="False"
                        checked={list[Index].Answer==="False"}
                        onChange={changeAnswer}
                        
                        />
                </Form.Group>
            </div>
            <div>
                <Form.Group controlId="PointBox">
                    <Form.Label><strong>Points:</strong></Form.Label>
                    <Form.Control
                        value={list[Index].Points}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => changePoints(e)} 
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
