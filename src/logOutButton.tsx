import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export function LogOutButton (){
    const navigate = useNavigate();
    const directToDashboard = () =>{void navigate('/');};
    return (
        <div className = "logOutButton">
            <Button style = {{marginBottom: "10px", backgroundColor: "#8f031aff", borderColor: "#8f031aff"}}
            onClick={directToDashboard}>Log out</Button>
        </div>
    )
}