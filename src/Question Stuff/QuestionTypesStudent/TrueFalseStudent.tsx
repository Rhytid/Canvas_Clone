
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


export function TrueFalseStudent({
    list,
    setList,
    Q,
    submitted,

}: QuestionDropDownProps):React.JSX.Element{
    
    //state for chosen answer
    const [chosen, setChosen] = useState<string>(
    Array.isArray(Q.StudentAnswer) ? Q.StudentAnswer.join(", ") : (Q.StudentAnswer || "")
);
    //control
    function select(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setChosen(value);

        //update global list with selected answer
        const newList = list.map((q) =>
            q === Q ? {...Q, StudentAnswer: value} : q
        );
        setList(newList);
    }
  

    
    
    return (
        <div>
            <Form.Group controlId={`truefalse-student-${Q.Question}`}>
                <Form.Check
                    inline
                    type="radio"
                    name={`question-${Q.Question}`}
                    label="True"
                    value="True"
                    checked={chosen==="True"}
                    onChange={select}
                    disabled={submitted}
                    />
                <Form.Check
                    inline
                    type="radio"
                    name={`question-${Q.Question}`}
                    label="False"
                    value="False"
                    checked={chosen==="False"}
                    onChange={select}
                    disabled={submitted}
                    />
            </Form.Group>
        </div>
    );
}