import { type JSX } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";
import type { Assign } from "../src/Assignment-Components/Dashboard";
import { StudentAssignment } from "../src/Assignment-Components/StudentAssignment";
//ChatGPT was used to help generate this code 

/* ---------------- useNavigate mock ---------------- */

const mockNavigate: NavigateFunction = jest.fn();

import * as ReactRouterDom from "react-router-dom";

jest.mock("react-router-dom", () => {
  const actual: typeof ReactRouterDom = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: (): NavigateFunction => mockNavigate,
  };
});


/* ---------------- UploadButton mock ---------------- */

jest.mock("../src/Assignment-Components/Importer", () => ({
  UploadButton: (): JSX.Element => <div data-testid="upload-button">UploadButton</div>,
}));


/* ---------------- URL.createObjectURL polyfill ---------------- */

beforeAll(() => {
  const createObjectURL = (): string => "blob:mock-url";

  Object.defineProperty(URL, "createObjectURL", {
    value: createObjectURL,
    writable: true,
  });
});

/* ---------------- helpers ---------------- */

function makeAssignment(
  overrides: Partial<Assign> = {}
): Assign {
  return {
    editMode: false,
    Title: "Test Assignment",
    dueDate: new Date("2025-01-01T12:00:00"),
    Totalpoints: 100,
    time: "",
    notes: "",
    description: "",
    showMetadata: true,
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

/* ---------------- tests ---------------- */

describe("StudentAssignment", () => {
  test("renders fallback message when no published assignments exist", () => {
    const unpublished = makeAssignment({ Published: false });

    render(
      <MemoryRouter>
        <StudentAssignment
          Alist={[unpublished]}
          setAlist={jest.fn()}
          setIndex={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText("No assignments yet. Go have fun!")
    ).toBeInTheDocument();
  });

  test("renders published assignment card", () => {
    const assignment = makeAssignment();

    render(
      <MemoryRouter>
        <StudentAssignment
          Alist={[assignment]}
          setAlist={jest.fn()}
          setIndex={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Assignment")).toBeInTheDocument();
    expect(screen.getByText("Points: 100")).toBeInTheDocument();
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });

  test("shows Take Assignment button when attempts remain", () => {
    const assignment = makeAssignment({
      Attempts: 3,
      StudentAttempts: 1,
    });

    render(
      <MemoryRouter>
        <StudentAssignment
          Alist={[assignment]}
          setAlist={jest.fn()}
          setIndex={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: "Take Assignment" })
    ).toBeInTheDocument();

    expect(screen.getByText("Attempts Left: 2")).toBeInTheDocument();
  });

  test("shows No Attempts Left when attempts are exhausted", () => {
    const assignment = makeAssignment({
      Attempts: 1,
      StudentAttempts: 1,
    });

    render(
      <MemoryRouter>
        <StudentAssignment
          Alist={[assignment]}
          setAlist={jest.fn()}
          setIndex={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("No Attempts Left")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Take Assignment" })
    ).toBeNull();
  });

  test("sets index and navigates when Take Assignment is clicked", () => {
    const setIndex = jest.fn();
    const assignment = makeAssignment();

    render(
      <MemoryRouter>
        <StudentAssignment
          Alist={[assignment]}
          setAlist={jest.fn()}
          setIndex={setIndex}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Take Assignment" })
    );

    expect(setIndex).toHaveBeenCalledWith(0);
    expect(mockNavigate).toHaveBeenCalledWith("/studentAssignmentPage");
  });

  test("renders grade when grade is available", () => {
    const assignment = makeAssignment({
      Grade: 92.3456,
    });

    render(
      <MemoryRouter>
        <StudentAssignment
          Alist={[assignment]}
          setAlist={jest.fn()}
          setIndex={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Your Grade: 92.3")).toBeInTheDocument();
  });

  test("exports assignment when Export button is clicked", () => {
    const assignment = makeAssignment();

    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation((): void => {});

    render(
      <MemoryRouter>
        <StudentAssignment
          Alist={[assignment]}
          setAlist={jest.fn()}
          setIndex={jest.fn()}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Export" }));

    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });

  test("renders UploadButton", () => {
    const assignment = makeAssignment();

    render(
      <MemoryRouter>
        <StudentAssignment
          Alist={[assignment]}
          setAlist={jest.fn()}
          setIndex={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("upload-button")).toBeInTheDocument();
  });
  test("StudentAssignment is defined", () => {
  expect(StudentAssignment).toBeDefined();
});
test("MemoryRouter is defined", () => {
  const { MemoryRouter }: typeof ReactRouterDom = jest.requireActual("react-router-dom");
  expect(MemoryRouter).toBeDefined();
});

});
