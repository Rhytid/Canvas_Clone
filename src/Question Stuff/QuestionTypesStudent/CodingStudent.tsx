//import { Button, Stack } from "react-bootstrap"; 
import type { CodingQ, QuestionObject } from "../QuestionParent";
import Form from "react-bootstrap/Form"
import {  useState} from "react";
import { Tabs, Tab, Button } from "react-bootstrap";
import type { CodeFile } from "../QuestionTypesTeacher/CodingTeacher";
import { runCode } from "../QuestionTypesTeacher/runCode";
import { Editor } from "@monaco-editor/react";


interface QuestionDropDownProps {
  list: QuestionObject[];
  setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  Q:QuestionObject
  Index:number
  submitted: boolean;
};

export function CodingStudent({
    list,
    setList,
    Q,
    submitted,

}: QuestionDropDownProps):React.JSX.Element{
    
    //state for chosen answer
    /*const [code, setCode] = useState<string>(
    Array.isArray(Q.StudentAnswer) ? Q.StudentAnswer.join(", ") : (Q.StudentAnswer || "")
    );*/

    const codingQ = Q as CodingQ;
   const initialFiles: CodeFile[] = structuredClone(codingQ.Files ?? []);
let visibleInitial = initialFiles.filter(file => file.isTeacher === 0);

// 👇 ensure main always exists
if (visibleInitial.length === 0) {
  visibleInitial = [
    {
      name: "main",
      language: "python",
      codeInput: "",
      isTeacher: 0,
    },
  ];
}
    

    const [allFiles, setAllFiles] = useState<CodeFile[]>(initialFiles);
    const [files, setFiles] = useState<CodeFile[]>(visibleInitial);
    const [currFile, setCurrFile] = useState<number>(0);

    const [output, setOutput] = useState<string>("");

    const [language, setLanguage] = useState("python");
    function changeLanguage(event: React.ChangeEvent<HTMLSelectElement>) {
        const newLanguage = event.target.value;
        setLanguage(newLanguage);
    }

    //control

    const handleRun = async () => {
          const result = await runCode(language, allFiles);
          setOutput(result);
        }; 

    
    
    const safeIndex =
  Number.isInteger(currFile) && currFile >= 0 && currFile < files.length
    ? currFile
    : 0;

const currentFile = files[safeIndex];


    return (
        <div>
        <Form.Group controlId={`coding-student-${Q.Question}`}>
        <Form.Select data-testid = "language-select2" style = {{}} value = {language} onChange = {changeLanguage} disabled ={submitted}>
          <option value ="python">Python</option>
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          {/*<option value="c">C</option>
          <option value="cpp">C++</option>*/}
        </Form.Select>
        <Tabs
            id="code-files-tabs"
            activeKey={currFile}
  onSelect={(k) => {
    if (k !== null && k !== "new") {
      setCurrFile(Number(k));
    }
  }}
          >
        {files.map((file, index) => (
        <Tab
          key={file.name}
          eventKey={index}
          title={
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>{file.name}</span>
          <Button style = {{borderColor: "#ddddddff", backgroundColor:"#ddddddff"}}
            variant="outline-secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // prevent switching tab when you click on the button
              
              const newFiles = files.filter((_,i) => i != index);
              //switches current file if you try to delete the one you're on
              if (index === currFile) {
                const mainIndex = newFiles.findIndex(f => f.name === "main");
                if (mainIndex !== -1){
                  setCurrFile(mainIndex);
                } else {
                  setCurrFile(0);
                }
              }else if (index < currFile) {
                setCurrFile(currFile - 1);
              }
              setFiles(newFiles);
              setAllFiles(newFiles);
            }}
            disabled = {file.name === "main"|| submitted}
          >
            🗑
          </Button>
        </div> 
      }
    >
    </Tab>
  ))}
  
  <Tab
    eventKey="new"
    title={
      <Button
        variant="success"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setFiles([
            ...files,
            {
              name: `file${files.length}`,
              language: language,
              codeInput: "",
              isTeacher: 0,
            },
          ]);
          setAllFiles([
            ...allFiles,
            {
              name: `file${files.length}`,
              language: language,
              codeInput: "",
              isTeacher: 0,
            },
          ]);
        }}
      >
        + New File
      </Button>
    }
  >
    </Tab>
    </Tabs>
    </Form.Group>
  <Form.Group controlId="QuestionBox">
            <Form.Control style = {{marginBottom: "25px"}}
              value={currentFile.name}
              onChange={(event) => {
              const newName = event.target.value;
              const newFiles = files.map((f) =>
              f.name === currentFile.name ? { ...f, name: newName } : f
              );
              setFiles(newFiles);
              const newAllFiles = allFiles.map((f)=> f.name === currentFile.name? {...f, name:newName}: f);
              setAllFiles(newAllFiles);
            }}
            placeholder="Rename file"
            disabled = {currentFile.name === "main"|| submitted}
            />
            {/*ChatGPT was used to help generate this code - code editor that allows the user to input code*/}

            <Editor
                height="400px"
                language={language}
                value = {currentFile.codeInput}
                onChange = {(val) => {
                const newFiles = [...files];
                newFiles[currFile].codeInput = val || "";
                setFiles(newFiles);
                setAllFiles(newFiles);
                const newList = list.map((q) =>
                q === Q ? {...q, Files: newFiles} : q);
                setList(newList);
                }}
                defaultValue="// type your code here"
                options={{ readOnly: submitted }}

                />
                <Button style = {{marginTop: "10px", backgroundColor: "#880032ff", borderColor: "#880032ff", borderRadius: "7px"}} 
                    onClick={() => void handleRun()}
                    disabled = {submitted}
                    >Run</Button>
                <div style={{ marginTop: "10px", background: "#f4f4f4", padding: "10px" }}>
                <strong>Output:</strong>
                <pre>{output}</pre>
        </div>
        </Form.Group>
        </div>
    );        

}