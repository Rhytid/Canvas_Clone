import { render, screen, cleanup } from "@testing-library/react";
import App from "../src/App";
//ChatGPT was used to help generate this code 

afterEach(() => cleanup());

export function renderRoute(route: string) {
  // HashRouter uses location.hash, so set it
  window.location.hash = route;

  return render(<App />);
}

describe("App routing", () => {
  it("renders LoginPage on /", () => {
    renderRoute("/");
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("renders StudentAssignmentPage on /studentAssignmentPage",  () => {
    renderRoute("/studentAssignmentPage");
    expect(screen.getByText(/Back to dashboard/i)).toBeInTheDocument();
  });

  it("renders TeacherAssignmentPage on /teacherAssignmentPage",  () => {
    renderRoute("/teacherAssignmentPage");
    expect(
      screen.getByRole("heading", { name: /teacher dashboard/i })
    ).toBeInTheDocument();
  });

  it("renders StudentDashboard on /studentDashboard", () => {
    renderRoute("/studentDashboard");
    expect(screen.getByText(/student dashboard/i)).toBeInTheDocument();
  });

  it("renders TeacherDashboard on /teacherDashboard", () => {
    renderRoute("/teacherDashboard");
    expect(screen.getByText(/teacher dashboard/i)).toBeInTheDocument();
  });

  it("renders StudentView on /studentView", () => {
    renderRoute("/studentView");
    expect(screen.getByText(/Back to Teacher View/i)).toBeInTheDocument();
  });
});
