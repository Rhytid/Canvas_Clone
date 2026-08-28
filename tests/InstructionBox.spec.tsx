import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import type { QuestionObject } from "../src/Question Stuff/QuestionParent";
import { InstructionBox } from "../src/Question Stuff/QuestionTypesTeacher/InstructionBox";
//ChatGPT was used to help generate this code 

/* ---------- mocks ---------- */
jest.mock("../src/Question Stuff/QuestionTypesTeacher/plugins/ToolbarPlugin", () => ({
  __esModule: true,
  default: () => <div data-testid="toolbar-plugin" />,
}));

/* ---------- ResizeObserver polyfill (strictly typed) ---------- */
class MockResizeObserver implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

beforeAll(() => {
  globalThis.ResizeObserver = MockResizeObserver;
});

/* ---------- helpers ---------- */
function makeInstructionQuestion(
  overrides?: Partial<QuestionObject>
): QuestionObject {
  return {
    Type: "Instruction Box",
    Question: "Read the instructions carefully.",
    Answers: [],
    Answer: "",
    Points: 0,
    StudentAnswer: "",
    MultipleAnswers: false,
    ...overrides,
  };
}

/* ---------- tests ---------- */
describe("InstructionBox", () => {
  let list: QuestionObject[];
  let updatedList: QuestionObject[];
  let setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;

  beforeEach(() => {
    list = [
      makeInstructionQuestion({ Question: "Instruction 1" }),
      makeInstructionQuestion({ Question: "Instruction 2" }),
    ];

    updatedList = [...list];

    setList = jest.fn(
      (
        value:
          | QuestionObject[]
          | ((prev: QuestionObject[]) => QuestionObject[])
      ) => {
        if (typeof value === "function") {
          updatedList = value(updatedList);
        } else {
          updatedList = value;
        }
      }
    );
  });

  test("renders the editor placeholder, toolbar, and delete button", () => {
    render(
      <InstructionBox
        list={list}
        setList={setList}
        Index={0}
      />
    );

    // Placeholder
    expect(
      screen.getByText("Enter some rich text...")
    ).toBeInTheDocument();

    // Toolbar
    expect(
      screen.getByTestId("toolbar-plugin")
    ).toBeInTheDocument();

    // Delete button
    expect(
      screen.getByText("Delete Instruction Box")
    ).toBeInTheDocument();
  });

  test("deletes the instruction box at index 0", () => {
    render(
      <InstructionBox
        list={list}
        setList={setList}
        Index={0}
      />
    );

    fireEvent.click(
      screen.getByText("Delete Instruction Box")
    );

    expect(updatedList).toHaveLength(1);
    expect(updatedList[0].Question).toBe("Instruction 2");
  });

  test("deletes the instruction box at a non-zero index", () => {
    render(
      <InstructionBox
        list={list}
        setList={setList}
        Index={1}
      />
    );

    fireEvent.click(
      screen.getByText("Delete Instruction Box")
    );

    expect(updatedList).toHaveLength(1);
    expect(updatedList[0].Question).toBe("Instruction 1");
  });
});
