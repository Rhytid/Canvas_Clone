
import type { QuestionObject } from "../QuestionParent";

import { useEffect, useState} from "react";
import Form from "react-bootstrap/Form"
import { Button, Stack, Tabs, Tab } from "react-bootstrap";
import Editor from "@monaco-editor/react";
import { runCode } from "./runCode";


interface QuestionDropDownProps {
  list: QuestionObject[];
  setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  Q:QuestionObject
  Index:number
  QIndex:number
  setQIndex: React.Dispatch<React.SetStateAction<number>>;
};

export interface CodeFile {
  name: string;
  language: string;
  codeInput: string;
  //if isTeacher is 0, it'll be available to both; if it's 1, then just shows on teacher view
  isTeacher: number;
}


export function CodingTeacher({
   
    list,
    setList,
    Q,
    Index,
    QIndex,
    setQIndex,

}: QuestionDropDownProps, ):React.JSX.Element{
  //const [codeInput, setCodeInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [prompt, setPrompt] = useState<string>(() => {
    return localStorage.getItem("codingTeacher_prompt") ||Q.Question;
  });

  function updateQuestion(updater: (q: QuestionObject) => QuestionObject){
    const newList = structuredClone(list);
    newList[Index] = updater(newList[Index]);
    setList(newList);
  }

  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem("codingTeacher_language") || "python";
  });

  function changeLanguage(event: React.ChangeEvent<HTMLSelectElement>) {
      const newLanguage = event.target.value;
      setLanguage(newLanguage);

      updateQuestion(q=> ({...q, Language: newLanguage}));
  }
  //helper function to write a modified question back into list
    function writeQuestion(updatedQ: QuestionObject) {
        const newList = structuredClone(list);
        newList[Index] = updatedQ;
        setList(newList);
    }
  function changePoints(event: React.ChangeEvent<HTMLInputElement>){
        const newQ = structuredClone(list[Index])
        const val = Number(event.target.value);
        newQ.Points = Number.isFinite(val) ? val : 0;
        writeQuestion(newQ);
    }


  const [files, setFiles] = useState<CodeFile[]> (() => {
    const saved = localStorage.getItem("codingTeacher_files");
    return saved ? JSON.parse(saved) as CodeFile[] : [
      { name: "main", language: "python", codeInput: "# Enter code here", isTeacher: 0 }
    ];
  });

  

  useEffect(() => {
  localStorage.setItem("codingTeacher_files", JSON.stringify(files));
  }, [files]);
  

  useEffect(() => {
  localStorage.setItem("codingTeacher_prompt", prompt);
  }, [prompt]);

  useEffect(() => {
  localStorage.setItem("codingTeacher_language", language);
  }, [language]);

  const [currFile, setCurrFile] = useState<number>(0);

    
    function deleteQ(id:number){
        //Creates a copy of the list and deletes the element at the given index
        //Code to delete the data
        const newList = [...list]
        newList.splice(id,1);
        setList(newList)
        setQIndex(QIndex-1)
    }

    function updatePrompt(event:React.ChangeEvent<HTMLInputElement>){
      const newPrompt = event.target.value;
      setPrompt(newPrompt);
      updateQuestion(q=> ({...q, Question: newPrompt}))
    }
  

    const handleRun = async () => {
      const result = await runCode(language, files);
      setOutput(result);
    }; 


    return (
        <div>
        <Form.Select data-testid = "language-select" style = {{}} value = {language} onChange = {changeLanguage}>
          <option value ="python">Python</option>
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          {/*<option value="c">C</option>
          <option value="cpp">C++</option>*/}
        </Form.Select>
        <Form.Label><strong>Prompt:</strong></Form.Label>
        <Form.Control style = {{marginBottom:"50px"}}
          data-testid="prompt-input"
          value = {prompt}
          onChange = {updatePrompt}
          placeholder = "Code prompt"
          />
        <Tabs id="code-files-tabs" activeKey={currFile} onSelect={(k) => setCurrFile(Number(k))} className="mb-3">
  {files.map((file, index) => (
    <Tab
      key={file.name}
      eventKey={index}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>{file.name}</span>
          <span
            role="button"
            tabIndex={0}
            style={{
              border: "1px solid #ddd",
              backgroundColor: "#ddd",
              padding: "2px 5px",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
            onClick={(e) => {
              e.stopPropagation();
              const newFiles = files.map((f, i) =>
                i === index ? { ...f, isTeacher: f.isTeacher === 0 ? 1 : 0 } : f
              );
              setFiles(newFiles);
            }}
          >
            {file.isTeacher === 0 ? "👁️" : "🚫"}
          </span>
          <span
            role="button"
            tabIndex={0}
            style={{
              border: "1px solid #ddd",
              backgroundColor: "#ddd",
              padding: "2px 5px",
              borderRadius: "3px",
              cursor: file.name === "main" ? "not-allowed" : "pointer",
              opacity: file.name === "main" ? 0.5 : 1,
              fontSize: "0.8rem",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (file.name === "main") return;
              const newFiles = files.filter((_, i) => i !== index);
              if (index === currFile) setCurrFile(0);
              else if (index < currFile) setCurrFile(currFile - 1);
              setFiles(newFiles);
            }}
          >
            🗑
          </span>
        </div>
      }
    />
  ))}

  <Tab
    eventKey="new"
    title={
      <span
        role="button"
        tabIndex={0}
        style={{
          border: "1px solid #28a745",
          backgroundColor: "#28a745",
          color: "#fff",
          padding: "2px 5px",
          borderRadius: "3px",
          cursor: "pointer",
          fontSize: "0.8rem",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setFiles([
            ...files,
            { name: `file${files.length}`, language, codeInput: "", isTeacher: 0 },
          ]);
        }}
      >
        + New File
      </span>
    }
  />
</Tabs>

        <Form.Group controlId="QuestionBox">
            <Form.Control style = {{marginBottom: "25px"}}
              value={files[currFile].name}
              onChange={(event) => {
              const newName = event.target.value;
              const newFiles = files.map((f) =>
              f.name === files[currFile].name ? { ...f, name: newName } : f
              );
            setFiles(newFiles);
            }}
            placeholder="Rename file"
            disabled = {files[currFile].name === "main"}
            />
                <Editor
                  data-testid = "editor-teacher"
                  height="400px"
                  language={language}
                  value = {files[currFile].codeInput}
                  onChange = {(val) => {
                  const newFiles = [...files];
                  newFiles[currFile].codeInput = val || "";
                  setFiles(newFiles);

                  updateQuestion(q=> ({...q, Files: newFiles}));
                }}
                  defaultValue="// type your code here"
                />
                <Button style = {{marginTop: "10px", backgroundColor: "#880032ff", borderColor: "#880032ff", borderRadius: "7px"}} onClick={() => void handleRun()}>Run</Button>
                <div style={{ marginTop: "10px", background: "#f4f4f4", padding: "10px" }}>
                <strong>Output:</strong>
                  <pre>{output}</pre>
    </div>
        </Form.Group>
        {/* points input */}
            <Form.Group controlId="PointBox">
            <Form.Label><strong>Points:</strong></Form.Label>
            <Form.Control
                //type ="number"
                value={list[Index].Points}
                onChange={changePoints} 
                />
            </Form.Group>

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

          {/*<Button
              onClick={() => {
                  Globalize();
                  }}
              size="sm"
              style={{backgroundColor: codeS ? "#E5B335" : "green", borderColor: codeS ? "#E5B335" : "green"}}
          >
                      
              {!codeS && "Save"}
              {codeS && "Edit"}
          </Button>*/}
        </Stack>
        </div>
        
    );
}
