import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import { StudentView } from "../src/pages/studentView";
import type { Assign } from "../src/Assignment-Components/Dashboard";
//ChatGPT was used to help generate this code 

/* -------------------- mocks -------------------- */

const mockNavigate = jest.fn<void, [string]>();

jest.mock("react-router-dom", () => {
  const actual: typeof import("react-router-dom") =
    jest.requireActual("react-router-dom");

  return {
    ...actual,
    useNavigate: (): ((path: string) => void) => mockNavigate,
  };
});

jest.mock("../src/logOutButton", () => ({
  LogOutButton: (): React.JSX.Element => (
    <button>Log Out</button>
  ),
}));

jest.mock(
  "../src/Assignment-Components/StudentAssignmentDisplay",
  () => ({
    StudentAssignmentTaker: (): React.JSX.Element => (
      <div>Student Assignment Taker</div>
    ),
  })
);

/* -------------------- helpers -------------------- */

function makeAssignment(overrides: Partial<Assign> = {}): Assign {
  return {
    editMode: false,
    Title: "Test Assignment",
    dueDate: null,
    Totalpoints: 100,
    time: "",
    notes: "",
    description: "",
    showMetadata: false,
    Questions: [],
    QIndex: 0,
    collaborators: [],
    Attempts: 3,
    StudentAttempts: 0,
    Grade: -1,
    Published: true,
    ...overrides,
  };
}

function renderStudentView(
  state: { Alist: Assign[]; assignmentIndex: number } | null
): void {
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/studentView",
          state,
        },
      ]}
    >
      <Routes>
        <Route
          path="/studentView"
          element={<StudentView />}
        />
        <Route
          path="/teacherDashboard"
          element={<div>Teacher Dashboard</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

/* -------------------- tests -------------------- */

describe("StudentView", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders fallback message when no assignment state is provided", () => {
    renderStudentView(null);

    expect(
      screen.getByText(/no assignment selected/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /back to teacher view/i,
      })
    ).toBeInTheDocument();
  });

  test("navigates to teacher dashboard when Back to Teacher View is clicked (no state)", () => {
    renderStudentView(null);

    userEvent.click(
      screen.getByRole("button", {
        name: /back to teacher view/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/teacherDashboard");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test("renders StudentAssignmentTaker and controls when assignment state exists", () => {
    const assignment = makeAssignment();

    renderStudentView({
      Alist: [assignment],
      assignmentIndex: 0,
    });

    expect(
      screen.getByText(/student assignment taker/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /back to teacher view/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
  });

  test("navigates to teacher dashboard when Back to Teacher View is clicked (with state)", () => {
    const assignment = makeAssignment();

    renderStudentView({
      Alist: [assignment],
      assignmentIndex: 0,
    });

    userEvent.click(
      screen.getByRole("button", {
        name: /back to teacher view/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/teacherDashboard");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
