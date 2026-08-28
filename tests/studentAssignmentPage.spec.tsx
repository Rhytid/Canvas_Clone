import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import { StudentAssignmentPage } from "../src/pages/studentAssignmentPage";
//ChatGPT was used to help generate this code 

/* -------------------- mocks -------------------- */

const mockNavigate = jest.fn<void, [string]>();

jest.mock("react-router-dom", () => {
const actual: typeof import("react-router-dom") = jest.requireActual("react-router-dom");


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

/* -------------------- helpers -------------------- */

function renderStudentAssignmentPage(): void {
  render(
    <MemoryRouter initialEntries={["/studentAssignment"]}>
      <Routes>
        <Route
          path="/studentAssignment"
          element={<StudentAssignmentPage />}
        />
        <Route
          path="/studentDashboard"
          element={<div>Student Dashboard</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

/* -------------------- tests -------------------- */

describe("StudentAssignmentPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders Back to Dashboard button and Log Out button", () => {
    renderStudentAssignmentPage();

    expect(
      screen.getByRole("button", { name: /back to dashboard/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
  });

  test("navigates to student dashboard when Back to Dashboard is clicked", () => {
    renderStudentAssignmentPage();

    userEvent.click(
      screen.getByRole("button", { name: /back to dashboard/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/studentDashboard");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
