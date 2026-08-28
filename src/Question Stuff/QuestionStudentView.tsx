
import { Button, Card, ProgressBar } from "react-bootstrap";
import type { QuestionObject } from "./QuestionParent";
import { useState, useEffect } from "react";

import { MultipleChoiceStudent } from "./QuestionTypesStudent/MultipleChoiceStudent";
import { TrueFalseStudent } from "./QuestionTypesStudent/TrueFalseStudent";
import { FreeResponseStudent } from "./QuestionTypesStudent/FreeResponseStudent";
import { CodingStudent } from "./QuestionTypesStudent/CodingStudent";
import { FillinTheBlankStudent } from "./QuestionTypesStudent/FillinTheBlankStudent";
import type { Assign } from "../Assignment-Components/Dashboard";
import React from "react";




interface QuestionStudentProps {
  allOptions: string[];
  list: QuestionObject[];
  setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  Alist:Assign[]
  setAlist: React.Dispatch<React.SetStateAction<Assign[]>>
  Aindex:number
};


export function QuestionStudent({

    list,
    setList,
    Alist,
    setAlist,
    Aindex,
    
}:QuestionStudentProps ):React.JSX.Element {
    //state
    const [submitted, setSubmit] = useState<boolean>(false);
    const [pointsScore, setPoints] = useState<number>(0);
    const [percentScore, setPercent] = useState<number>(0);
    const [totalPoints, setTotal] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    
    //update progress bar as students answer questions - chatGPT
    useEffect(() => {
        if (list.length === 0) return;

        const answered = list.filter(q => {
            const ans = q.StudentAnswer;

            //multiple question answers stored as an array
            if(Array.isArray(ans)) {
                return ans.length > 0;
            }
            //free response, true/false, single choice, and coding
            if(typeof ans === "string") {
                return ans.trim() !== "";
            }

            return false;
        }).length;
        
        const progressPercent = (answered / list.length) * 100;
        setProgress(progressPercent);
    }, [list]);

    function Submit(){
        setSubmit(true)
        let user = 0;
        let total = 0;

        for (const q of list) {
            total += q.Points;

            if (q.Type === "Fill In The Blank Question") {
                const correct = Array.isArray(q.Answer) ? q.Answer : [q.Answer];
                const student = typeof q.StudentAnswer === "string" ? q.StudentAnswer : "";

                const normalizedCorrect = correct.map(a =>
                    (a).trim().toLowerCase()
                );
                const normalizedStudent = (student).trim().toLowerCase();

                const isCorrect = normalizedCorrect.includes(normalizedStudent);
                if (isCorrect) user += q.Points;
            }
            else {
                const correct = Array.isArray(q.Answer) ? q.Answer : [q.Answer];

                let student: string | string[];
                let isCorrect: boolean;

                if (q.MultipleAnswers) {
                    const student = Array.isArray(q.StudentAnswer) ? q.StudentAnswer : [q.StudentAnswer];
                    isCorrect = correct.length === student.length && correct.every(a => student.includes(a));
                }
                else {
                    student = typeof q.StudentAnswer === "string" ? q.StudentAnswer : (Array.isArray(q.StudentAnswer) ? q.StudentAnswer[0] : "");
                    isCorrect = correct.includes(student);
                }

                if (isCorrect) {
                    user += q.Points;
                }
            }
            
        }
        const A  = structuredClone(Alist[Aindex])
        A.StudentAttempts += 1
        let gradecalc:number = (total>0 ? (user/total)*100 : 0);
        gradecalc = Math.round(gradecalc)
        A.Grade = gradecalc
        console.log("Grade assigned: ", A.Grade)
        const newList = structuredClone(Alist)
        newList[Aindex] = A
        setAlist(newList)

        setPoints(user);
        setPercent(total>0 ? (user/total)*100 : 0);
        setTotal(total);
    }

    //determine color of score card based on grade
    function getScoreColor() {
        if (percentScore >= 85) return "#4caf50";
        if (percentScore >= 70) return "#ffa726";
        return "#ef5350";
    }

    //determine feedback for each question - chatGPT
    function getFeedback(q: QuestionObject) {
        if (q.Type === "Page Break" || q.Type === "Instruction Box") {
            return {text: "", color: "", icon: ""};
        }

        const correctArray = Array.isArray(q.Answer) ? q.Answer : [q.Answer];
        
        //early exit if no correct answer provided
        if (q.Answer.length===0 || correctArray.every(a => a === "")) {
            return {text: "In progress...", color: "blue"};
        }

        //fill in the blank grading
        if (q.Type === "Fill In The Blank Question") {
            const student = typeof q.StudentAnswer === "string" ? q.StudentAnswer : "";

            const normalizedCorrect = correctArray.map(a => (a).trim().toLowerCase());
            const normalizedStudent = (student).trim().toLowerCase();

            //early exit if no correct answers provided (check 2)

            const isCorrect = normalizedCorrect.includes(normalizedStudent);

            if (isCorrect) return {text: "Correct!", color: "green", icon: "✅"};
            return {text: "Incorrect", color: "red", icon: "❌"};
        }

        //all other question types
        const student = Array.isArray(q.StudentAnswer) ? q.StudentAnswer : [q.StudentAnswer];
        
        const isCorrect = correctArray.length === student.length && correctArray.every(a => student.includes(a));

        if (isCorrect) return {text: "Correct!", color: "green", icon: "✅"};
        return {text: "Incorrect", color: "red", icon: "❌"};
    }



type LexicalNode = {
  type: string;
  text?: string;
  format?: number;
  style?: string;
  children?: LexicalNode[];
};

type LexicalRoot = {
  root: {
    children: LexicalNode[];
  };
};
//Two below functions generated with chat
function parseStyleString(styleString: string): React.CSSProperties {
  const styleEntries: [string, string][] = styleString
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => s.split(":").map((v) => v.trim()) as [string, string])
    .filter(([key, value]) => key && value);

  const styleObject: Record<string, string> = {};
  for (const [key, value] of styleEntries) {
    const reactKey = key.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
    styleObject[reactKey] = value;
  }

  return styleObject as React.CSSProperties;
}
function lexicalJSONToJSX(jsonString: string): React.ReactNode {
  const parsed = JSON.parse(jsonString) as LexicalRoot;

  const renderNodes = (nodes: LexicalNode[], keyPrefix = ""): React.ReactNode[] => {
    return nodes.map((node, index) => {
      const key = `${keyPrefix}-${index}`;

      if (node.type === "paragraph") {
        return (
          <p key={key} style={node.style ? { ...parseStyleString(node.style) } : undefined}>
            {node.children ? renderNodes(node.children, key) : null}
          </p>
        );
      }

      if (node.type === "text") {
        let content: React.ReactNode = node.text;

        if (node.format) {
          if (node.format & 1) content = <b>{content}</b>; // bold
          if (node.format & 2) content = <i>{content}</i>; // italic
          if (node.format & 4) content = <u>{content}</u>; // underline
        }

        if (node.style) {
          content = <span style={parseStyleString(node.style)}>{content}</span>;
        }

        return <React.Fragment key={key}>{content}</React.Fragment>;
      }

      if (node.children) {
        return <React.Fragment key={key}>{renderNodes(node.children, key)}</React.Fragment>;
      }

      return null;
    });
  };

  return <>{renderNodes(parsed.root.children)}</>;
}


    
    return(

        <div>
            <ProgressBar
                now={progress}
                variant={progress===100 ? "success" : "info"}
                label={`${Math.round(progress)}% complete`}
                style={{height: "22px", marginBottom: "20px"}}
            />
            <hr/>
            <h2 className="text-primary fw-semibold mb-3">Questions</h2>
            <hr></hr>

            {list.length === 0 && (
                <p>No questions available at this time. Check back later!</p>
            )}

            {list.map((q: QuestionObject, index:number) => {
                const feedback = submitted ? getFeedback(q) : null;
                
                return (
                    <Card
                        key={q.Question + index}
                        className="shadow-sm my-4 border-0"
                        style={{
                            borderRadius: "12px",
                            backgroundColor: submitted
                                ? feedback?.text === "Correct!"
                                ? "#e9fbe9"
                                : q.Answer.length > 0
                                    ? "#fdeaea"
                                    : "#f0f7ff"
                                : "#f0f7ff",
                            transition: "background-color 0.3s ease",

                        }}
                    >
                        <Card.Body>
                            {q.Type !== "Page Break" && q.Type !== "Instruction Box" &&
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        {submitted ? (
                                            <p style={{color: feedback?.color, fontWeight: "bold"}}>
                                                {feedback?.icon} {feedback?.text}
                                            </p>
                                        ) : (
                                            <p className="mb-0 text-muted">Available Points: {q.Points}</p>
                                        )}

                                        <p className="mb-0 text-muted">{q.Type}</p>
                                    </div>

                                    <h5 className="mb-3 text-primary">Question {index+1}</h5>
                                </>
                            }

                            {q.Type === "Instruction Box" && (
                                <div
                                className="instruction-box mb-3 p-3"
                                style={{
                                    backgroundColor: "#f0f7ff",
                                    borderLeft: "4px solid #0d6efd",
                                    borderRadius: "8px",
                                    fontStyle: "italic",
                                    whiteSpace: "pre-wrap", // preserves line breaks
                            }}
                                >
                            {lexicalJSONToJSX(q.Question,)}
                            </div>
                                )}

                            {q.Type!= "Instruction Box" && q.Type!= "Page Break" && 
                            <p className="fw-semibold mb-3">{q.Question}</p>}
                            {/* render based on question type */}
                            {q.Type === "Multiple Choice Question" && 
                                <MultipleChoiceStudent
                                    list={list}
                                    setList={setList}
                                    Q = {q}
                                    Index = {index}
                                    submitted={submitted}
                                />}
                            {q.Type === "Free Response Question" && 
                                <FreeResponseStudent
                                    list={list}
                                    setList={setList}
                                    Q = {q}
                                    Index = {index}
                                    submitted={submitted}
                                />}
                            {q.Type === "True False Question" && 
                                <TrueFalseStudent
                                    list={list}
                                    setList={setList}
                                    Q = {q}
                                    Index = {index}
                                    submitted={submitted}
                                />}
                            {q.Type === "Fill In The Blank Question" && 
                                <FillinTheBlankStudent
                                    list={list}
                                    setList={setList}
                                    Q = {q}
                                    Index = {index}
                                    submitted={submitted}
                                />}
                            {q.Type === "Coding Question" && 
                                <CodingStudent
                                    list={list}
                                    setList={setList}
                                    Q = {q}
                                    Index = {index}
                                    submitted={submitted}
                                />}

                            {/* feedback after submission */}
                            {submitted && q.Type !== "Page Break" && q.Type !== "Instruction Box" && (
                                <div className="mt-3">
                                    <p>
                                        <strong>Your answer:</strong>{" "}
                                        {Array.isArray(q.StudentAnswer)
                                            ? q.StudentAnswer.length > 0
                                                ? q.StudentAnswer.join(", ")
                                                : "No answer provided"
                                                : typeof q.StudentAnswer === "string" && q.StudentAnswer.trim() !== ""
                                                ? q.StudentAnswer
                                                : "No answer provided"}
                                    </p>
                                    <p>
                                        <strong>{"Correct answer(s):"}</strong>{" "}
                                        {Array.isArray(q.Answer)
                                        ? q.Answer.join(", ")
                                        : q.Answer || "Grading in Progress"}
                                    </p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                );
            })}

            {list.length > 0 && (
                <div className="text-center mt-5">
                    {!submitted ? (
                        <div>
                            <Button
                            variant="success"
                            onClick={Submit}
                            className="mb-3 px-4 py-2 fs-5"
                            >
                            Submit
                        </Button>
                        

                        </div>
                        
                        
                    ) : (
                        <Card
                            className="shadow-sm border-0 mx-auto mt-3"
                            style={{
                                maxWidth: "400px",
                                backgroundColor: getScoreColor(),
                                borderRadius: "14px",
                                transition: "all 0.4s ease",
                            }}
                        >
                            <Card.Body>
                                <h4 className="fw-semibold mb-2">Score</h4>
                                <h1
                                    className="fw-bold mb-2"
                                    //style={{color: getScoreColor()}}
                                >
                                    {Math.round(percentScore)}%
                                </h1>
                                <p>
                                    You scored {pointsScore} out of {totalPoints} points.
                                </p>
                            </Card.Body>
                        </Card>
                    )}

                </div>
            )}

            <br/>
            <br/>
        </div>

    );
}