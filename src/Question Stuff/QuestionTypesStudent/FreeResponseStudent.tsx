
//import { Button, Stack } from "react-bootstrap"; 
import type { QuestionObject } from "../QuestionParent";
import Form from "react-bootstrap/Form"
import { useState} from "react";
import Card from "react-bootstrap/Card";

interface QuestionDropDownProps {
  list: QuestionObject[];
  setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  Q:QuestionObject
  Index:number
  submitted: boolean;
};


export function FreeResponseStudent({
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

        //update global list with selected answer
        const newList = list.map((q) =>
            q === Q ? {...Q, StudentAnswer: value} : q
        );
        setList(newList);
    }

    //rubric code
    const rubric = Q.rubric;
    const visibility = Q.rubricVisibility ?? "hidden";

    const showRubric = 
        visibility === "always" ||
        (visibility === "afterSubmit" && submitted);
    

    return (
        <div>
            {/* answer box */}
            <Form.Group controlId={`freeresponse-student-${Q.Question}`}>
              <Form.Control
                as="textarea"
                rows={6}
                value={answer}
                onChange={change}
                placeholder="Type your answer here"
                disabled={submitted}
                />
            </Form.Group>

            {/* student rubric view */}
            {rubric && rubric.criteria.length>0 && showRubric && (
                <Card className="p-3 mt-4">
                    <Card.Body>
                        <h5><strong>{rubric.title}</strong></h5>
                        <table className="table table-bordered mt-3 align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th style={{width: "25%"}}>Criteria</th>
                                    <th style={{width: "70%"}}>Ratings</th>
                                    <th style={{width: "5%"}}>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rubric.criteria.map((crit, i) => (
                                    <tr key={i}>
                                        <td>
                                            <strong>{crit.title}</strong>
                                            <div className="text-muted">{crit.description}</div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-row gap-2">
                                                {crit.ratings.map((rating, ri) => (
                                                    <Card key={ri} className="p-2" style={{minWidth: "140px", flex: "1"}}>
                                                        <strong>{rating.title}</strong>
                                                        <div className="text-muted small">{rating.description}</div>
                                                        <div className="mt-1"><em>{rating.points} pts</em></div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            {crit.points}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}