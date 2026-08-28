import { useState} from "react";
import { QuestionDropDown } from "./QuestionTeacherView";
import { QuestionStudent } from "./QuestionStudentView";
import type { CodeFile } from "./QuestionTypesTeacher/CodingTeacher";
import type { Assign } from "../Assignment-Components/Dashboard";
import type { Rubric, RubricVisibility } from "./RubricEditor";


interface QuestionParentProps {
  StudentTeacher: boolean;
  Qlist:QuestionObject[]
  setQList:React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  AList:Assign[] 
  setAList:React.Dispatch<React.SetStateAction<Assign[]>>;
  Aindex:number
}


//Declaring a temporary instance of each question type
export interface MultipleChoiceQ{
    Question:string;
    Answers:string[]; //student answers
    //allow multiple answers
    Answer: string | string[]; //correct answer
    Points:number;
    Type:string;
    StudentAnswer:string | string[];
    //toggle for teacher to allow multiple correct answers
    MultipleAnswers: boolean;
    rubric?: Rubric;
    rubricVisibility?: RubricVisibility;
}
export interface TrueFalseQ{
    Question:string;
    Answers:string[];
    Answer: string | string[];
    Points:number;
    Type:string;
    StudentAnswer:string | string[];
    MultipleAnswers: boolean;
    rubric?: Rubric;
    rubricVisibility?: RubricVisibility;
}
export interface FreeResponseQ{
    Question:string;
    Answers:string[];
    Answer: string | string[];
    Points:number;
    Type:string;
    StudentAnswer:string | string[];
    MultipleAnswers: boolean;
    rubric?: Rubric;
    rubricVisibility?: RubricVisibility;
}
export interface CodingQ{
    Question:string;
    Answers:string[];
    Answer: string | string[];
    Points:number;
    Type:string
    StudentAnswer:string | string[];
    MultipleAnswers: boolean;
    Files?: CodeFile[];
    Language?: string;
    rubric?: Rubric;
    rubricVisibility?: RubricVisibility;
}
export interface FIBQ{
  Question:string;
    Answers:string[];
    Answer: string | string[];
    Points:number;
    Type:string
    StudentAnswer:string | string[];
    MultipleAnswers: boolean;
    rubric?: Rubric;
    rubricVisibility?: RubricVisibility;
}
export interface PageBreak{
  Question:string;
    Answers:string[];
    Answer: string | string[];
    Points:number;
    Type:string
    StudentAnswer:string | string[];
    MultipleAnswers: boolean;
    rubric?: Rubric;
    rubricVisibility?: RubricVisibility;
}
export interface Instructions{
    Question:string;
    Answers:string[];
    Answer: string | string[];
    Points:number;
    Type:string
    StudentAnswer:string | string[];
    MultipleAnswers: boolean;
    rubric?: Rubric;
    rubricVisibility?: RubricVisibility;
}


export type QuestionObject = MultipleChoiceQ | TrueFalseQ | FreeResponseQ | CodingQ | FIBQ | PageBreak | Instructions;

export function QuestionParent({StudentTeacher, Qlist, setQList, AList, setAList, Aindex}:QuestionParentProps) { 
  
  const [allOptions] = useState<string[]>([
    "Multiple Choice",
    "True False",
    "Free Response",
    "Coding",
    "Fill in the Blank",
    "Page Break",
    "Instruction Box"
  ]);
  
  
  //If we pass true of false through the QuestionParent function 
  //It determines what view we see the student or teacher
  //We can call Question Parent with <QuestionParent StudentTeacher = true/>
  if (StudentTeacher){
    return (
      <div>
      <QuestionDropDown
      allOptions={allOptions}
      list={Qlist}
      setList={setQList}
    />
    </div>
  );
  }
  else{
    return (
    <div>
    <QuestionStudent
      allOptions={allOptions}
      list={Qlist}
      setList={setQList}
      Alist = {AList}
      setAlist = {setAList}
      Aindex = {Aindex}
      
      
    />
    </div>
  );
  }
  
}
