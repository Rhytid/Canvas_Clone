import { render, screen, fireEvent } from "@testing-library/react";
import type { QuestionObject } from "../src/Question Stuff/QuestionParent";
import React from "react";
import { FillInTheBlankTeacher } from "../src/Question Stuff/QuestionTypesTeacher/FillinTheBlankTeacher";
//ChatGPT was used to help generate this code 

/* ---------- helpers ---------- */
function makeFIBQuestion(overrides?: Partial<QuestionObject>): QuestionObject {
  return {
    Type: "Fill In The Blank",
    Question: "The capital of France is ___",
    Answer: ["Paris"],
    Points: 1,
    ...overrides,
  } as QuestionObject;
}

/* ---------- tests ---------- */
describe("FillInTheBlankTeacher", () => {
  let list: QuestionObject[];
  let updatedList: QuestionObject[];
  let setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;

  let qIndex: number;
  let setQIndex: React.Dispatch<React.SetStateAction<number>>;

  beforeEach(() => {
    list = [makeFIBQuestion()];
    updatedList = [...list];
    qIndex = 1;

    setList = jest.fn((value) => {
      if (typeof value === "function") {
        updatedList = (value as (prev: QuestionObject[]) => QuestionObject[])(updatedList);
      } else {
        updatedList = value;
      }
    });

    setQIndex = jest.fn((value) => {
      if (typeof value === "function") {
        qIndex = (value as (prev: number) => number)(qIndex);
      } else {
        qIndex = value;
      }
    });
  });

  test("renders prompt, answers, points, and delete button", () => {
    render(
      <FillInTheBlankTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    // Question input
    expect(screen.getByDisplayValue(list[0].Question)).toBeInTheDocument();

    // First answer input
    expect(screen.getByDisplayValue(list[0].Answer[0])).toBeInTheDocument();

    // Points input
    expect(screen.getByDisplayValue(list[0].Points.toString())).toBeInTheDocument();

    // Buttons
    expect(screen.getByText("Add Answer")).toBeInTheDocument();
    expect(screen.getByText("Delete Question")).toBeInTheDocument();
  });

  test("updates the question text", () => {
    render(
      <FillInTheBlankTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    const questionInput = screen.getByDisplayValue(list[0].Question);
    fireEvent.change(questionInput, { target: { value: "The capital of Germany is ___" } });

    expect(updatedList[0].Question).toBe("The capital of Germany is ___");
  });

  test("updates points value", () => {
    render(
      <FillInTheBlankTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    const pointsInput = screen.getByDisplayValue(list[0].Points.toString());
    fireEvent.change(pointsInput, { target: { value: "5" } });

    expect(updatedList[0].Points).toBe(5);
  });

  test("changes the answer text", () => {
    render(
      <FillInTheBlankTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    const answerInput = screen.getByDisplayValue(list[0].Answer[0]);
    fireEvent.change(answerInput, { target: { value: "Berlin" } });

    expect(updatedList[0].Answer[0]).toBe("Berlin");
  });

  test("adds a new answer field", () => {
    render(
      <FillInTheBlankTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    fireEvent.click(screen.getByText("Add Answer"));

    expect(updatedList[0].Answer).toHaveLength(2);
    expect(updatedList[0].Answer[1]).toBe("");
  });

  test("removes an answer field", () => {
    render(
      <FillInTheBlankTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    fireEvent.click(screen.getByText("X"));

    expect(updatedList[0].Answer).toHaveLength(0);
  });

  test("deletes the question and updates QIndex", () => {
    render(
      <FillInTheBlankTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    fireEvent.click(screen.getByText("Delete Question"));

    expect(updatedList).toHaveLength(0);
    expect(qIndex).toBe(0);
  });
});
