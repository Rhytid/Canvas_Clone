import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import { TeacherAssignmentPage } from "../src/pages/teacherAssignmentPage";
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

jest.mock("../src/Header", () => ({
  TeacherAssignmentHeader: (): React.JSX.Element => (
    <h1>Teacher Assignment Header</h1>
  ),
}));

/* -------------------- helpers -------------------- */

function renderTeacherAssignmentPage(): void {
  render(
    <MemoryRouter initialEntries={["/teacherAssignment"]}>
      <Routes>
        <Route
          path="/teacherAssignment"
          element={<TeacherAssignmentPage />}
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

describe("TeacherAssignmentPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders header, Log Out button, and Back to Dashboard button", () => {
    renderTeacherAssignmentPage();

    expect(
      screen.getByRole("heading", { name: /teacher assignment header/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /back to dashboard/i })
    ).toBeInTheDocument();
  });

  test("navigates to teacher dashboard when Back to Dashboard is clicked", () => {
    renderTeacherAssignmentPage();

    userEvent.click(
      screen.getByRole("button", { name: /back to dashboard/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/teacherDashboard");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
