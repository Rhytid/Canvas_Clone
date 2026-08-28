// tests/StudentViewDisplay.spec.tsx
import type { SetStateAction } from "react";
import { render, screen } from "@testing-library/react";
import { StudentViewTaker } from "../src/Assignment-Components/StudentViewDisplay";
import type { Assign } from "../src/Assignment-Components/Dashboard";
//ChatGPT was used to help generate this code 

/* ---------- mocks ---------- */

interface HeaderProps {
  title: string;
}

jest.mock("../src/Header", () => ({
  __esModule: true,
  StudentViewAssignmentHeader: ({ title }: HeaderProps) => (
    <h1 data-testid="student-header">{title}</h1>
  ),
}));

interface QuestionParentProps {
  StudentTeacher: boolean;
}

jest.mock("../src/Question Stuff/QuestionParent", () => ({
  __esModule: true,
  QuestionParent: ({ StudentTeacher }: QuestionParentProps) => (
    <div
      data-testid="question-parent"
      data-student={String(StudentTeacher)}
    />
  ),
}));

/* ---------- sample data ---------- */

const sampleAssignment: Assign = {
  editMode: false,
  Title: "Student View Assignment",
  dueDate: new Date("2025-01-01T12:00:00Z"),
  Totalpoints: 100,
  time: "",
  notes: "",
  description: "",
  showMetadata: false,
  Questions: [],
  QIndex: 0,
  collaborators: [],
  Attempts: 1,
  StudentAttempts: 0,
  Grade: -1,
  Published: true,
};

/* ---------- typed mock ---------- */

const mockSetAlist = jest.fn() as jest.Mock<
  void,
  [SetStateAction<Assign[]>]
>;

/* ---------- tests ---------- */

describe("StudentViewDisplay", () => {
  beforeEach(() => {
    mockSetAlist.mockClear();
  });

  test("renders fallback text when index is invalid", () => {
    render(
      <StudentViewTaker
        Alist={[sampleAssignment]}
        Index={-1}
        setAlist={mockSetAlist}
      />
    );

    expect(
      screen.getByText("No assignment seleceted")
    ).toBeInTheDocument();
  });

  test("renders assignment header with title", () => {
    render(
      <StudentViewTaker
        Alist={[sampleAssignment]}
        Index={0}
        setAlist={mockSetAlist}
      />
    );

    expect(screen.getByTestId("student-header"))
      .toHaveTextContent("Student View Assignment");
  });

  test("renders due date when present", () => {
    render(
      <StudentViewTaker
        Alist={[sampleAssignment]}
        Index={0}
        setAlist={mockSetAlist}
      />
    );

    expect(screen.getByText(/Due:/)).toBeInTheDocument();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  test("renders 'No due date' when dueDate is undefined", () => {
    const noDueDate: Assign = {
      ...sampleAssignment,
      dueDate: null,
    };

    render(
      <StudentViewTaker
        Alist={[noDueDate]}
        Index={0}
        setAlist={mockSetAlist}
      />
    );

    expect(
      screen.getByText("Due: No due date")
    ).toBeInTheDocument();
  });

  test("renders total points", () => {
    render(
      <StudentViewTaker
        Alist={[sampleAssignment]}
        Index={0}
        setAlist={mockSetAlist}
      />
    );

    expect(
      screen.getByText("Total Points: 100")
    ).toBeInTheDocument();
  });

  test("renders QuestionParent in student mode", () => {
    render(
      <StudentViewTaker
        Alist={[sampleAssignment]}
        Index={0}
        setAlist={mockSetAlist}
      />
    );

    const qp = screen.getByTestId("question-parent");
    expect(qp).toHaveAttribute("data-student", "false");
  });
});
