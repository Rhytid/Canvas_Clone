import * as React from "react"; 
import FullLogo from "/FullLogo.svg"
import { Link } from "react-router-dom";


export function LoginHeader(): React.JSX.Element {

    return (
        <header>
          <img src={FullLogo} className="logo" alt="logo" />
          <h1>Login</h1>
          <p>Welcome to coFlowCode!</p>
          <p>By Alex Sohn, Tricia Devine, and Gabi Manzari</p>
        </header>
    )
}

export function StudentDashboardHeader(): React.JSX.Element {

    return (
        <header>
          <img src={FullLogo} className="logo" alt="logo" />
          <h1>Student Dashboard</h1>
          <p>By Alex Sohn, Tricia Devine, and Gabi Manzari</p>
        </header>
    )
}

export function TeacherDashboardHeader(): React.JSX.Element {

    return (
        <header>
          <img src={FullLogo} className="logo" alt="logo" />
          <h1>Teacher Dashboard</h1>
          <p>By Alex Sohn, Tricia Devine, and Gabi Manzari</p>
        </header>
    )
}

interface StudentAssignmentHeaderProps{
  title: string
}

//somehow pass assignment title into the header - FIX LATER
export function StudentAssignmentHeader({title} : StudentAssignmentHeaderProps): React.JSX.Element {

    return (
        <header>
          <Link to="/studentDashboard">
              <img src={FullLogo} className="logo" alt="logo" />
          </Link>
          <h1>{title}</h1>
          <p>By Alex Sohn, Tricia Devine, and Gabi Manzari</p>
        </header>
    )
}

export function TeacherAssignmentHeader(): React.JSX.Element {

    return (
        <header>
          <Link to="/teacherDashboard">
              <img src={FullLogo} className="logo" alt="logo" />
          </Link>
          <h1>Teacher Dashboard</h1>
          <p>By Alex Sohn, Tricia Devine, and Gabi Manzari</p>
        </header>
    )
}

export function StudentViewAssignmentHeader({title} : StudentAssignmentHeaderProps): React.JSX.Element {

    return (
        <header>
          <Link to="/teacherDashboard">
              <img src={FullLogo} className="logo" alt="logo" />
          </Link>
          <h1>Viewing {title} as Student</h1>
          <p>By Alex Sohn, Tricia Devine, and Gabi Manzari</p>
        </header>
    )
}