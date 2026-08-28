import { render, screen, fireEvent } from "@testing-library/react";
import { FillinTheBlankStudent } from "../src/Question Stuff/QuestionTypesStudent/FillinTheBlankStudent";
import type { QuestionObject } from "../src/Question Stuff/QuestionParent";
import React from "react";
//ChatGPT was used to help generate this code 

/* ---------- helpers ---------- */
function makeFIBQuestion(overrides?: Partial<QuestionObject>): QuestionObject {
  return {
    Type: "Fill In The Blank",
    Question: "The capital of France is ___",
    Answer: ["Paris"],
    Points: 1,
    StudentAnswer: "",
    MultipleAnswers: false,
    ...overrides,
  } as QuestionObject;
}

/* ---------- tests ---------- */
describe("FillinTheBlankStudent", () => {
  let list: QuestionObject[];
  let updatedList: QuestionObject[];
  let setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;

  beforeEach(() => {
    list = [makeFIBQuestion()];
    updatedList = [...list];

    setList = jest.fn((value) => {
      if (typeof value === "function") {
        updatedList = (value as (prev: QuestionObject[]) => QuestionObject[])(updatedList);
      } else {
        updatedList = value;
      }
    });
  });

  test("renders the input with placeholder", () => {
    render(
      <FillinTheBlankStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={false}
      />
    );

    const input = screen.getByPlaceholderText("Write your answer here");
    expect(input).toBeInTheDocument();
    expect(input).not.toBeDisabled();
  });

  test("updates StudentAnswer when user types", () => {
    render(
      <FillinTheBlankStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={false}
      />
    );

    const input = screen.getByPlaceholderText("Write your answer here");
    fireEvent.change(input, { target: { value: "Paris" } });

    expect(updatedList[0].StudentAnswer).toBe("Paris");
  });

  test("pre-fills input when StudentAnswer exists", () => {
    const qWithAnswer = makeFIBQuestion({ StudentAnswer: "Berlin" });
    render(
      <FillinTheBlankStudent
        list={[qWithAnswer]}
        setList={setList}
        Q={qWithAnswer}
        Index={0}
        submitted={false}
      />
    );

    const input = screen.getByDisplayValue("Berlin");
    expect(input).toBeInTheDocument();
  });

  test("disables input when submitted is true", () => {
    render(
      <FillinTheBlankStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={true}
      />
    );

    const input = screen.getByPlaceholderText("Write your answer here");
    expect(input).toBeDisabled();
  });
});
