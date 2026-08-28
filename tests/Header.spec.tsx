import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  LoginHeader,
  StudentDashboardHeader,
  TeacherDashboardHeader,
  StudentAssignmentHeader,
  TeacherAssignmentHeader,
  StudentViewAssignmentHeader,
} from "../src/Header";
//ChatGPT was used to help generate this code 

describe("Header Components", () => {
  test("LoginHeader renders correctly", () => {
    render(<LoginHeader />);
    expect(screen.getByRole("img", { name: /logo/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Login");
    expect(screen.getByText("Welcome to coFlowCode!")).toBeInTheDocument();
    expect(
      screen.getByText("By Alex Sohn, Tricia Devine, and Gabi Manzari")
    ).toBeInTheDocument();
  });

  test("StudentDashboardHeader renders correctly", () => {
    render(<StudentDashboardHeader />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Student Dashboard"
    );
    expect(
      screen.getByText("By Alex Sohn, Tricia Devine, and Gabi Manzari")
    ).toBeInTheDocument();
  });

  test("TeacherDashboardHeader renders correctly", () => {
    render(<TeacherDashboardHeader />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Teacher Dashboard"
    );
    expect(
      screen.getByText("By Alex Sohn, Tricia Devine, and Gabi Manzari")
    ).toBeInTheDocument();
  });

  test("StudentAssignmentHeader renders title and link correctly", () => {
    const title = "Math Assignment 1";
    render(
      <MemoryRouter>
        <StudentAssignmentHeader title={title} />
      </MemoryRouter>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/studentDashboard");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title);
  });

  test("TeacherAssignmentHeader renders correctly with link", () => {
    render(
      <MemoryRouter>
        <TeacherAssignmentHeader />
      </MemoryRouter>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/teacherDashboard");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Teacher Dashboard"
    );
  });

  test("StudentViewAssignmentHeader renders title correctly with link", () => {
    const title = "Science Assignment 2";
    render(
      <MemoryRouter>
        <StudentViewAssignmentHeader title={title} />
      </MemoryRouter>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/teacherDashboard");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      `Viewing ${title} as Student`
    );
  });
});
