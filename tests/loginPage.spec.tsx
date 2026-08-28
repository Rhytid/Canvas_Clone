// tests/loginPage.spec.tsx
import { render, screen, } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../src/pages/loginPage";
import { StudentDashboard } from "../src/pages/studentDashboard";
import { TeacherDashboard } from "../src/pages/teacherDashboard";

//ChatGPT was used to help generate this code 

export function renderRoute(initialRoute: string) {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/teacherDashboard" element={<TeacherDashboard />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("LoginPage routing", () => {
  it("renders LoginPage on /", () => {
    renderRoute("/");
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("navigates to teacher dashboard when 'teacher' is entered",  () => {
    renderRoute("/");

    userEvent.type(screen.getByPlaceholderText(/enter username/i), "teacher1");
    userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/teacher dashboard/i)).toBeInTheDocument();
  });

  it("navigates to student dashboard when 'student' is entered",  () => {
    renderRoute("/");

    userEvent.type(screen.getByPlaceholderText(/enter username/i), "student1");
    userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/student dashboard/i)).toBeInTheDocument();
  });
});
