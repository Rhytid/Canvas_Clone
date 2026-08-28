
import type { QuestionObject } from "../QuestionParent";
import Form from "react-bootstrap/Form"
import { useState, useEffect } from "react";

interface QuestionDropDownProps {
  list: QuestionObject[];
  setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  Q:QuestionObject
  Index:number
  submitted: boolean;
};


export function MultipleChoiceStudent({
    list,
    setList,
    Q,
    Index,
    submitted,

}: QuestionDropDownProps):React.JSX.Element{
    //fix for grading bug - chatGPT
    function sanitize(arr: string | string[] | undefined): string[] {
        if (Array.isArray(arr)) {
            return arr.filter(a => a.trim() !== "");
        }
        if (typeof arr === "string") {
            return arr.trim() !== "" ? [arr.trim()] : [];
        }
        return [];
    }
    
    //state for chosen answer
    const [chosen, setChosen] = useState<string[]>([]);

    //fix for grading bug pt 2 - chatGPT
    useEffect(() => {
        if (submitted) {
            setChosen(sanitize(Q.StudentAnswer));
        }
    }, [Q.StudentAnswer, submitted]);

    //control
    function select(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        
        let updated: string[];

        //mutliple answers mode
        if (Q.MultipleAnswers) {
            updated = chosen.includes(value)
                ? chosen.filter(a => a !== value)
                : [...chosen, value];
        }
        else {
            updated = [value]
        }

        const clean = sanitize(updated);
        setChosen(clean);

        //update global list with selected answer
        const newList = list.map((q, i) =>
            i === Index 
                ? {
                    ...q,
                    StudentAnswer: Q.MultipleAnswers ? clean : clean[0] ?? ""
                } : q
        );
        setList(newList);
    }
    
    
    return (
        <div>
            <Form.Group controlId={`mcq-student-${Q.Question}`} className="text-center">
                {Q.Answers.length > 0 ? (
                    Q.Answers.map((answer: string, index: number) => {
                        const isChecked = chosen.includes(answer);

                        return (
                            <Form.Check
                                key={index}
                                type={Q.MultipleAnswers ? "checkbox" : "radio"}
                                name={`student-q-${Q.Question}`}
                                label={answer}
                                value={answer}
                                checked={isChecked}
                                onChange={select}
                                disabled={submitted}
                                className="d-flex justify-content-center align-items-center mb-2"
                                style={{gap: "6px"}}
                            />
                        );
                    })
                ) : (
                    <p style={{color: "gray"}}>
                        No answer options available for this question at this time.
                    </p>
                )}
            </Form.Group>
        </div>
    );
}