import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CodingStudent } from "../src/Question Stuff/QuestionTypesStudent/CodingStudent";
import type { CodingQ, QuestionObject } from "../src/Question Stuff/QuestionParent";
import { runCode } from "../src/Question Stuff/QuestionTypesTeacher/runCode";
//ChatGPT was used to help generate this code 

/* -------------------- mocks -------------------- */

// mock runCode (same pattern as CodingTeacher)
jest.mock("../src/Question Stuff/QuestionTypesTeacher/runCode", () => ({
  runCode: jest.fn().mockResolvedValue("Student output"),
}));

// mock Monaco Editor safely
jest.mock("@monaco-editor/react", () => ({
  Editor: (props: {
    value?: string;
    onChange?: (value: string) => void;
  }): React.JSX.Element => (
    <textarea
      data-testid="monaco-editor"
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  ),
}));

/* -------------------- helpers -------------------- */

function makeCodingQuestion(): CodingQ {
  return {
    Type: "Coding",
    Question: "Write a function",
    Answer: "",
    Points: 10,
    Answers: [],
    StudentAnswer: "",
    MultipleAnswers: false,
    Files: [
      {
        name: "main",
        language: "python",
        codeInput: "",
        isTeacher: 0,
      },
    ],
    Language: "python",
    rubric: { title: "Default", criteria: [] },
    rubricVisibility: "hidden",
  };
}

/* -------------------- tests -------------------- */

describe("CodingStudent", () => {
  let list: QuestionObject[];
  let updatedList: QuestionObject[];
  let setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;

  beforeEach(() => {
    list = [makeCodingQuestion()];
    updatedList = structuredClone(list);

    setList = jest.fn(
      (value: React.SetStateAction<QuestionObject[]>) => {
        updatedList =
          typeof value === "function"
            ? value(updatedList)
            : value;
      }
    );
  });

  test("renders language selector and run button", () => {
    render(
      <CodingStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={false}
      />
    );

    const languageSelect: HTMLSelectElement =
      screen.getByTestId("language-select2");
    expect(languageSelect).toBeInTheDocument();
    expect(languageSelect).toHaveValue("python");

    expect(screen.getByText("Run")).toBeInTheDocument();
  });

  test("changes language selection", () => {
    render(
      <CodingStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={false}
      />
    );

    const languageSelect: HTMLSelectElement =
      screen.getByTestId("language-select2");

    fireEvent.change(languageSelect, {
      target: { value: "typescript" },
    });

    expect(languageSelect).toHaveValue("typescript");
  });

  test("updates code and saves it to the question", () => {
    render(
      <CodingStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={false}
      />
    );

    const editor = screen.getByTestId("monaco-editor");

    fireEvent.change(editor, {
      target: { value: "print('hello')" },
    });

    const updatedQuestion = updatedList[0] as CodingQ;
    expect(updatedQuestion.Files?.[0].codeInput).toBe("print('hello')");
  });

  test("runs code and displays output", async () => {
    render(
      <CodingStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={false}
      />
    );

    fireEvent.click(screen.getByText("Run"));

    expect(runCode).toHaveBeenCalledTimes(1);

    const output = await screen.findByText("Student output");
    expect(output).toBeInTheDocument();
  });

  test("disables inputs when submitted", () => {
    render(
      <CodingStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={true}
      />
    );

    const languageSelect: HTMLSelectElement =
      screen.getByTestId("language-select2");

    expect(languageSelect.disabled).toBe(true);
    expect(screen.getByText("Run")).toBeDisabled();
  });
});
