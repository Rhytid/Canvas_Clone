//import { Button, Stack } from "react-bootstrap"; 
import type { QuestionObject } from "../QuestionParent";
import Form from "react-bootstrap/Form"
import { useState} from "react";

interface QuestionDropDownProps {
  list: QuestionObject[];
  setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  Q:QuestionObject
  Index:number
  submitted: boolean;
};


export function FillinTheBlankStudent({
    list,
    setList,
    Q,
    submitted,

}: QuestionDropDownProps):React.JSX.Element{
    
    //state for chosen answer
    const [answer, setAnswer] = useState<string>(
    Array.isArray(Q.StudentAnswer) ? Q.StudentAnswer.join(", ") : (Q.StudentAnswer || "")
);

    //control
    function change(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setAnswer(value);

        //update global list with selected answer - chatGPT
        const newList = list.map((q) =>
            q === Q ? {...Q, StudentAnswer: value} : q
        );
        setList(newList);
    }

    return (
        <div>
            <Form.Group controlId={`fillintheblank-student-${Q.Question}`}>
              <Form.Control
                type="text"
                value={answer}
                onChange={change}
                placeholder="Write your answer here"
                disabled={submitted}
                />
            </Form.Group>
        </div>
    );
}