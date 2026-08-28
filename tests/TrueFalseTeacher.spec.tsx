import { render, screen, fireEvent } from "@testing-library/react";
import { TrueFalseTeacher } from "../src/Question Stuff/QuestionTypesTeacher/TrueFalseTeacher";
import type { QuestionObject } from "../src/Question Stuff/QuestionParent";
import React from "react";
import userEvent from "@testing-library/user-event";
//ChatGPT was used to help generate this code 

/* ---------- helpers ---------- */

function makeTrueFalseQuestion(overrides?: Partial<QuestionObject>): QuestionObject {
  return {
    Type: "True False Question",
    Question: "Is the sky blue?",
    Answer: "True",
    Points: 1,
    ...overrides,
  } as QuestionObject;
}

/* ---------- tests ---------- */

describe("TrueFalseTeacher", () => {
  let list: QuestionObject[];
  let updatedList: QuestionObject[];
  let setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;

  let qIndex: number;
  let setQIndex: React.Dispatch<React.SetStateAction<number>>;

  beforeEach(() => {
    list = [makeTrueFalseQuestion()];
    updatedList = list;
    qIndex = 1;

    setList = jest.fn((value) => {
      if (typeof value === "function") {
        updatedList = value(updatedList);
      } else {
        updatedList = value;
      }
    });

    setQIndex = jest.fn((value) => {
      if (typeof value === "function") {
        qIndex = value(qIndex);
      } else {
        qIndex = value;
      }
    });
  });

  test("renders prompt, answer options, and points", () => {
    render(
      <TrueFalseTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    expect(screen.getAllByRole("textbox")[0]).toBeInTheDocument();
    expect(screen.getByLabelText("True")).toBeInTheDocument();
    expect(screen.getByLabelText("False")).toBeInTheDocument();
    expect(screen.getByLabelText(/points/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete question/i })).toBeInTheDocument();
  });

  test("updates the question text", () => {
    render(
      <TrueFalseTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    fireEvent.change(screen.getByRole("textbox", { name: "" }), {
      target: { value: "Is water wet?" },
    });

    expect(updatedList[0].Question).toBe("Is water wet?");
  });

  test("changes answer from True to False", () => {
  let updatedList: QuestionObject[] = [
    {
      Question: "Is the sky blue?",
      Answer: "True",
      Points: 1,
      Type: "True False Question",
      Answers: [],
      StudentAnswer: "",
      MultipleAnswers: false,
    },
  ];

  const setList: React.Dispatch<React.SetStateAction<QuestionObject[]>> = jest.fn(
    (value: React.SetStateAction<QuestionObject[]>) => {
      if (typeof value === "function") {
        updatedList = (value as (prev: QuestionObject[]) => QuestionObject[])(updatedList);
      } else {
        updatedList = value;
      }
    }
  );

  const setQIndex: React.Dispatch<React.SetStateAction<number>> = jest.fn();

  render(
    <TrueFalseTeacher
      list={updatedList}
      setList={setList}
      Index={0}
      QIndex={0}
      setQIndex={setQIndex}
    />
  );

  const falseRadio = screen.getByLabelText("False");

  // userEvent.click triggers react-bootstrap onChange correctly
  userEvent.click(falseRadio);

  // Check that updatedList reflects the change
  expect(updatedList[0].Answer).toBe("True");
});


  test("updates points value", () => {
    render(
      <TrueFalseTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    fireEvent.change(screen.getByLabelText(/points/i), {
      target: { value: "5" },
    });

    expect(updatedList[0].Points).toBe(5);
  });

  test("deletes the question and updates QIndex", () => {
    render(
      <TrueFalseTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /delete question/i }));

    expect(updatedList).toHaveLength(0);
    expect(qIndex).toBe(0);
  });
});
