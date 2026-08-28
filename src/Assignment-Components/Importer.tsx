import React, { useRef, useState, type ChangeEvent } from 'react'
import type { Assign } from './Dashboard';
import { Button } from "react-bootstrap";

interface AssignmentProps {
  Alist: Assign[];
  setAlist: React.Dispatch<React.SetStateAction<Assign[]>>;
}


//https://www.davebernhard.com/blog/pretty-file-upload-in-react
export function UploadButton(
    {
        Alist,
        setAlist,
    }:AssignmentProps
){
  const [uploadError, setUploadError] = useState('')
  const uploadRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return
    }
    const file = e.target.files[0]

    
      if (!file.name.toLowerCase().endsWith('.json')) {
        setUploadError('Please upload a .json file');
        return;
    }
      //Need to make my own text parser GAH
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        const contents = event.target?.result
        if (typeof contents === "string") { 
            const NewAssignment: Assign = JSON.parse(contents) as Assign; 
            const newlist = structuredClone(Alist);
            newlist.push(NewAssignment);
            setAlist(newlist);
  }
      }

      e.target.value = ''
      fileReader.readAsText(file)
    
  }

  return (
    <>
      {/* style this however you like */}
      <Button style = {{margin: "10px", backgroundColor:"#538678ff", borderColor:"#538678ff" }} onClick={() => uploadRef.current?.click()}>Upload file</Button>

      <input
        type="file"
        ref={uploadRef}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />

      {uploadError ? <p>{uploadError}</p> : null}
    </>
  )
}
