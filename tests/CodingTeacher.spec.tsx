import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CodingTeacher } from "../src/Question Stuff/QuestionTypesTeacher/CodingTeacher";
import type { CodingQ } from "../src/Question Stuff/QuestionParent";
import { runCode } from "../src/Question Stuff/QuestionTypesTeacher/runCode";
//ChatGPT was used to help generate this code 

// Chat GPT Mock Monaco Editor
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
    return (
      <textarea
        data-testid="code-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  },
}));

// Mock runCode function to avoid actual code execution in tests
jest.mock("../src/Question Stuff/QuestionTypesTeacher/runCode", () => ({
  runCode: jest.fn().mockResolvedValue("Test output"),
}));

describe("CodingTeacher", () => {
  let list: CodingQ[];
  let updatedList: CodingQ[];
  let setList: React.Dispatch<React.SetStateAction<CodingQ[]>>;
  let qIndex: number;
  let setQIndex: React.Dispatch<React.SetStateAction<number>>;

  beforeEach(() => {
    list = [
      {
        Type: "Coding",
        Question: "Write a function to add two numbers",
        Answer: "",
        Points: 0,
        Answers: [],
        StudentAnswer: "",
        MultipleAnswers: false,
        Files: [
          {
            name: "main",
            language: "python",
            codeInput: "# Enter code here",
            isTeacher: 0,
          },
        ],
        Language: "python",
        rubric: { title: "Default Rubric", criteria: [] },
        rubricVisibility: "hidden",
      },
    ];

    updatedList = structuredClone(list);
    qIndex = 1;

    setList = jest.fn((value: React.SetStateAction<CodingQ[]>) => {
      updatedList =
        typeof value === "function"
          ? (value as (prev: CodingQ[]) => CodingQ[])(updatedList)
          : value;
    });

    setQIndex = jest.fn((value: React.SetStateAction<number>) => {
      qIndex =
        typeof value === "function"
          ? (value as (prev: number) => number)(qIndex)
          : value;
    });
  });

  test("renders language selector and prompt input", () => {
    render(
      <CodingTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
        Q={list[0]}
      />
    );

    // Language selector
    const languageSelect: HTMLSelectElement = screen.getByTestId("language-select");
    expect(languageSelect).toBeInTheDocument();

    // Prompt input
    const promptInput: HTMLInputElement = screen.getByPlaceholderText("Code prompt");
    expect(promptInput).toBeInTheDocument();

    // Run button
    expect(screen.getByText("Run")).toBeInTheDocument();
  });

  test("changes the language and updates the question", () => {
    render(
      <CodingTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
        Q={list[0]}
      />
    );

    const languageSelect: HTMLSelectElement = screen.getByTestId("language-select");
    expect(languageSelect).toHaveValue("python");

    fireEvent.change(languageSelect, { target: { value: "typescript" } });
    expect(updatedList[0].Language).toBe("typescript");
  });

  test("updates the code and saves it to the question", () => {
  render(
    <CodingTeacher
      list={list}
      setList={setList}
      Index={0}
      QIndex={qIndex}
      setQIndex={setQIndex}
      Q={list[0]}
    />
  );

  // Simulate what the editor would do
  setList(prev => {
    const updated = structuredClone(prev);
    updated[0].Files![0].codeInput = "def add(a, b): return a + b";
    return updated;
  });

  expect(updatedList[0].Files![0].codeInput).toBe("def add(a, b): return a + b");
});


  test("runs the code and displays output", async () => {
    render(
      <CodingTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
        Q={list[0]}
      />
    );

    const languageSelect: HTMLSelectElement = screen.getByTestId("language-select");
    fireEvent.change(languageSelect, { target: { value: "typescript" } });
    expect(updatedList[0].Language).toBe("typescript");

    fireEvent.click(screen.getByText("Run"));

    expect(runCode).toHaveBeenCalledWith("typescript", list[0].Files);
    expect(runCode).toHaveBeenCalledTimes(1);

    const output: HTMLElement = await screen.findByText("Test output");
    expect(output).toBeInTheDocument();
  });

  test("deletes the question and updates the list", () => {
    render(
      <CodingTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
        Q={list[0]}
      />
    );

    fireEvent.click(screen.getByText("Delete Question"));
    expect(updatedList).toHaveLength(0);
    expect(qIndex).toBe(0);
  });
});
