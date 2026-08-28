import { LoginHeader } from "../Header";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";


export function LoginPage (){
    const [user, setUser]=useState<string>("");
    const [password, setPassword]=useState<string>("");
    const [isStudent, setIsStudent] = useState<boolean>(true);
    
    //updates isStudent to switch the view from student to teacher
    function updateUser(event: React.ChangeEvent<HTMLInputElement>){
        setUser(event.target.value);
        if (user.startsWith("teacher")){
            setIsStudent(false)
    } else{
            setIsStudent(true)
    }
    }

    function updatePassword(event: React.ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value);
    }

    function LoginButton (){
        const navigate = useNavigate();
        const directToStudentDashboard = () =>{void navigate('/studentDashboard');};
        const directToTeacherDashboard = () =>{void navigate('/teacherDashboard');};

        return (
        <div>
            <Button variant="success" onClick={isStudent? directToStudentDashboard: directToTeacherDashboard}>Login</Button>
        </div>
    )
}

    return (
        <div>
            <LoginHeader></LoginHeader>
            <hr></hr>
            <div>Login below</div>
            <hr></hr>
            <Form.Group controlId="formUser">
                <span><Form.Label style = {{fontWeight: "bold"}}>Username:</Form.Label>
                <Form.Control value={user} onChange={updateUser} placeholder="Enter username" /></span>
            </Form.Group>
            <Form.Group controlId="formPassword">
                <span>
                <Form.Label style = {{fontWeight: "bold"}}>Password:</Form.Label>
                <Form.Control type = "password" value={password} onChange={updatePassword} placeholder="Enter password" /></span>
            </Form.Group>
            <hr></hr>
            <div>
            <span>
            {/* <div></div> */}
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px"}}>
                {/*<Form>
                    <Form.Check
                        type="switch"
                        id="is-student-check"
                        label={"Login as a: " + (isStudent? "Student": "Teacher")}
                        checked={isStudent}
                        onChange={updateIsStudent}
                        style = {{width: "200px", height: "50px"}}
                    /> 
                </Form>*/}
            </div>
            </span>
        </div>
        <LoginButton></LoginButton>
        </div>
    )
}