import { Button, Stack } from "react-bootstrap";
import type { QuestionObject } from "../QuestionParent";
import Form from "react-bootstrap/Form"
import RubricEditor from "../RubricEditor"
import type { Rubric, RubricVisibility } from "../RubricEditor";


interface QuestionDropDownProps {
  list: QuestionObject[];
  setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  Index:number
  QIndex:number
  setQIndex: React.Dispatch<React.SetStateAction<number>>;
};

export function FreeResponseTeacher({
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
    // no longer needed - points auto-sum in the rubric
    // function changePoints(event: React.ChangeEvent<HTMLInputElement>){
    //     const newQ = {...list[Index], Points: Number(event.target.value)}
    //     const newList = structuredClone(list)
    //     newList[Index] = newQ
    //     setList(newList)
    // }
    function computeRubricTotal(rubric: Rubric): number {
        return rubric.criteria.reduce((sum, crit) => {
            return sum + crit.points;
        }, 0);
    }
    function changeQuestion(event: React.ChangeEvent<HTMLInputElement>){
        const newQ = {...list[Index], Question: event.target.value}
        const newList = structuredClone(list)
        newList[Index] = newQ
        setList(newList)
    }
    // function changeAnswer(event: React.ChangeEvent<HTMLInputElement>){
    //     const newQ = {...list[Index], Answer:event.target.value}
    //     const newList = structuredClone(list)
    //     newList[Index] = newQ
    //     setList(newList)
    // }

    //rubric functionality - chatGPT
    function updateRubric(r: Rubric) {
        const newTotal = computeRubricTotal(r);
        const newList = structuredClone(list);
        newList[Index].rubric = r;
        newList[Index].Points = newTotal;
        setList(newList);
    }
    function updateRubricVisibility(value: RubricVisibility) {
        const newList =  structuredClone(list);
        (newList[Index]).rubricVisibility = value;
        setList(newList);
    }

    const currentRubric = list[Index].rubric;
    const currentVisibility = list[Index].rubricVisibility ?? "hidden";

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
            {/* <div>
                <Form.Group controlId="AnswerBox">
                    <Form.Label><strong>Answer:</strong></Form.Label>
                <Form.Control
                    value={list[Index].Answer}
                    onChange={changeAnswer} 
                />     
                </Form.Group>
            </div> */}

            {/* Rubric visibility radio buttons */}
            <div className="mt-3">
                <Form.Label><strong>Rubric visibility to students:</strong></Form.Label>
                <div>
                    <Form.Check
                        inline
                        type="radio"
                        label="Do not show rubric"
                        name={`rubric-visibility-${Index}`}
                        checked={currentVisibility === "hidden"}
                        onChange={() => updateRubricVisibility("hidden")}
                    />
                    <Form.Check
                        inline
                        type="radio"
                        label="Show rubric at all times"
                        name={`rubric-visibility-${Index}`}
                        checked={currentVisibility === "always"}
                        onChange={() => updateRubricVisibility("always")}
                    />
                    <Form.Check
                        inline
                        type="radio"
                        label="Show rubric only after submission"
                        name={`rubric-visibility-${Index}`}
                        checked={currentVisibility === "afterSubmit"}
                        onChange={() => updateRubricVisibility("afterSubmit")}
                    />
                </div>
            </div>

            {/* Rubric editor */}
            <RubricEditor
                rubric={currentRubric}
                onRubricChange={updateRubric}
            />

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
