// tests/StudentAssignmentDisplay.spec.tsx
import type { SetStateAction } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { StudentAssignmentTaker } from "../src/Assignment-Components/StudentAssignmentDisplay";
import type { Assign } from "../src/Assignment-Components/Dashboard";
//ChatGPT was used to help generate this code 

/* ---------- mocks ---------- */

interface HeaderProps {
  title: string;
}

jest.mock("../src/Header", () => ({
  __esModule: true,
  StudentAssignmentHeader: ({ title }: HeaderProps) => (
    <h1 data-testid="student-assignment-header">{title}</h1>
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

/* ---------- localStorage mock ---------- */

beforeEach(() => {
  const store: Record<string, string> = {};

  jest.spyOn(window, "localStorage", "get").mockReturnValue({
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(k => delete store[k]);
    },
    key: () => null,
    length: 0,
  });
});

/* ---------- sample data ---------- */

const sampleAssignment: Assign = {
  editMode: false,
  Title: "Student Assignment",
  dueDate: new Date("2025-02-01T10:00:00Z"),
  Totalpoints: 50,
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

describe("StudentAssignmentDisplay", () => {
  beforeEach(() => {
    mockSetAlist.mockClear();
  });

  test("renders fallback text when index is invalid", () => {
    render(
      <StudentAssignmentTaker
        Alist={[sampleAssignment]}
        Index={-1}
        setAlist={mockSetAlist}
      />
    );

    expect(
      screen.getByText("No assignment seleceted")
    ).toBeInTheDocument();
  });

  test("renders assignment header, due date, and total points", () => {
    render(
      <StudentAssignmentTaker
        Alist={[sampleAssignment]}
        Index={0}
        setAlist={mockSetAlist}
      />
    );

    expect(screen.getByTestId("student-assignment-header"))
      .toHaveTextContent("Student Assignment");

    expect(screen.getByText(/Due:/)).toBeInTheDocument();
    expect(screen.getByText(/Total Points: 50/)).toBeInTheDocument();
  });

  test("allows adding a collaborator", () => {
    render(
      <StudentAssignmentTaker
        Alist={[sampleAssignment]}
        Index={0}
        setAlist={mockSetAlist}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("name"), {
      target: { value: "Alice" },
    });

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "alice@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("role (optional)"), {
      target: { value: "Reviewer" },
    });

    fireEvent.click(screen.getByText("Add"));

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    expect(screen.getByText("Reviewer")).toBeInTheDocument();
  });

  test("does not add collaborator if name or email is missing", () => {
    render(
      <StudentAssignmentTaker
        Alist={[sampleAssignment]}
        Index={0}
        setAlist={mockSetAlist}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("name"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Add"));

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  test("allows removing a collaborator", () => {
    render(
      <StudentAssignmentTaker
        Alist={[sampleAssignment]}
        Index={0}
        setAlist={mockSetAlist}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("name"), {
      target: { value: "Bob" },
    });

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "bob@test.com" },
    });

    fireEvent.click(screen.getByText("Add"));

    expect(screen.getByText("Bob")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Remove"));

    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  test("renders QuestionParent in student mode", () => {
    render(
      <StudentAssignmentTaker
        Alist={[sampleAssignment]}
        Index={0}
        setAlist={mockSetAlist}
      />
    );

    const qp = screen.getByTestId("question-parent");
    expect(qp).toHaveAttribute("data-student", "false");
  });
});
