import type { QuestionObject } from "../QuestionParent";
import { Button } from "react-bootstrap";

interface QuestionDropDownProps {
  list: QuestionObject[];
  setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
 
  Index:number
}

export function PagerBreak({
    list,
    setList,
    
    Index,
}:QuestionDropDownProps):React.JSX.Element{

    function deleteQ(id:number){
        //Creates a copy of the list and deletes the element at the given index
        //Code to delete the data
        const newList = [...list]
        newList.splice(id,1);
        setList(newList)
    }
    return(
        <div>
            <b>PAGE BREAK</b>
            <Button
                        variant="danger"
                        onClick={() => {
                            deleteQ(Index);
                        }}
                        size="sm"
                        >
                    {"Delete Page Break"}
                </Button>
        </div>
    )
}