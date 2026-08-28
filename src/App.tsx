import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {LoginPage} from './pages/loginPage';
import {StudentAssignmentPage} from './pages/studentAssignmentPage';
//import {StudentFeedbackPage} from './pages/studentFeedbackPage';
import {TeacherAssignmentPage} from './pages/teacherAssignmentPage';
import { StudentDashboard } from "./pages/studentDashboard";
import { TeacherDashboard } from "./pages/teacherDashboard";
import { StudentView } from "./pages/studentView";





export function App() {

    return (
        <>
        <Router>
            <Routes>
                <Route path = "/" element = {<LoginPage/>}/>
                <Route path = "/studentAssignmentPage" element = {<StudentAssignmentPage/>}/>
                {/* <Route path = "/studentFeedbackPage" element = {<StudentFeedbackPage/>}/> */}
                <Route path = "/teacherAssignmentPage" element = {<TeacherAssignmentPage/>}/>
                <Route path = "/studentDashboard" element = {<StudentDashboard/>}/>
                <Route path = "/teacherDashboard" element = {<TeacherDashboard/>}/>
                <Route path = "/studentView" element = {<StudentView/>}/>
            </Routes>
        </Router>
        </>
    );
}

export default App;