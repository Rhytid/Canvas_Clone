import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import type { QuestionObject } from "../src/Question Stuff/QuestionParent";
import { MultipleChoiceTeacher } from "../src/Question Stuff/QuestionTypesTeacher/MultipleChoiceTeacher";
//ChatGPT was used to help generate this code 

/* ---------- helpers ---------- */
function makeMCQuestion(
  overrides?: Partial<QuestionObject>
): QuestionObject {
  return {
    Type: "Multiple Choice",
    Question: "What is 2 + 2?",
    Answers: ["3", "4"],
    Answer: ["4"],
    Points: 1,
    StudentAnswer: "",
    MultipleAnswers: false,
    ...overrides,
  };
}

/* ---------- tests ---------- */
describe("MultipleChoiceTeacher", () => {
  let list: QuestionObject[];
  let updatedList: QuestionObject[];
  let setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;

  let qIndex: number;
  let setQIndex: React.Dispatch<React.SetStateAction<number>>;

  beforeEach(() => {
    list = [makeMCQuestion()];
    updatedList = [...list];
    qIndex = 1;

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

    setQIndex = jest.fn(
      (value: number | ((prev: number) => number)) => {
        if (typeof value === "function") {
          qIndex = value(qIndex);
        } else {
          qIndex = value;
        }
      }
    );
  });

  test("renders prompt, answers, points, and delete button", () => {
    render(
      <MultipleChoiceTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    // Prompt
    expect(
      screen.getByDisplayValue(list[0].Question)
    ).toBeInTheDocument();

    // Answers
    expect(screen.getByDisplayValue("3")).toBeInTheDocument();
    expect(screen.getByDisplayValue("4")).toBeInTheDocument();

    // Points
    expect(
      screen.getByDisplayValue(list[0].Points.toString())
    ).toBeInTheDocument();

    // Buttons
    expect(screen.getByText("Add Answer")).toBeInTheDocument();
    expect(screen.getByText("Delete Question")).toBeInTheDocument();
  });

  test("updates the question prompt", () => {
    render(
      <MultipleChoiceTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    const input = screen.getByDisplayValue(list[0].Question);
    fireEvent.change(input, { target: { value: "What is 3 + 3?" } });

    expect(updatedList[0].Question).toBe("What is 3 + 3?");
  });

  test("adds a new answer option", () => {
    render(
      <MultipleChoiceTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    fireEvent.click(screen.getByText("Add Answer"));

    expect(updatedList[0].Answers).toHaveLength(3);
    expect(updatedList[0].Answers[2]).toBe("");
  });

  test("removes an answer option", () => {
    render(
      <MultipleChoiceTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    fireEvent.click(screen.getAllByText("X")[0]);

    expect(updatedList[0].Answers).toEqual(["4"]);
    expect(updatedList[0].Answer).toEqual(["4"]);
  });

  test("changes an answer text", () => {
    render(
      <MultipleChoiceTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    const answerInput = screen.getByDisplayValue("3");
    fireEvent.change(answerInput, { target: { value: "5" } });

    expect(updatedList[0].Answers[0]).toBe("5");
  });

  test("toggles multiple correct answers mode", () => {
    render(
      <MultipleChoiceTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    const toggle = screen.getByLabelText("Allow multiple correct answers");
    fireEvent.click(toggle);

    expect(updatedList[0].MultipleAnswers).toBe(true);
  });

  test("selects a correct answer (single-answer mode)", () => {
    render(
      <MultipleChoiceTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    fireEvent.click(screen.getByLabelText("3"));

    expect(updatedList[0].Answer).toEqual(["3"]);
  });

  test("updates points value", () => {
    render(
      <MultipleChoiceTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    const pointsInput = screen.getByDisplayValue("1");
    fireEvent.change(pointsInput, { target: { value: "5" } });

    expect(updatedList[0].Points).toBe(5);
  });

  test("deletes the question and updates QIndex", () => {
    render(
      <MultipleChoiceTeacher
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
