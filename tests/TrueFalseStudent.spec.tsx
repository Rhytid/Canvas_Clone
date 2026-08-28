import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TrueFalseStudent } from "../src/Question Stuff/QuestionTypesStudent/TrueFalseStudent";
import type { QuestionObject } from "../src/Question Stuff/QuestionParent";
import React from "react";
//ChatGPT was used to help generate this code 

/* ---------- helpers ---------- */
function makeTrueFalseQuestion(overrides?: Partial<QuestionObject>): QuestionObject {
  return {
    Type: "True False Question",
    Question: "Is the sky blue?",
    Answer: "True",
    Points: 1,
    StudentAnswer: "",
    Answers: [],
    MultipleAnswers: false,
    ...overrides,
  } as QuestionObject;
}

/* ---------- tests ---------- */
describe("TrueFalseStudent", () => {
  let list: QuestionObject[];
  let updatedList: QuestionObject[];
  let setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  let question: QuestionObject;

  beforeEach(() => {
    question = makeTrueFalseQuestion();
    list = [question];
    updatedList = list;

    setList = jest.fn((value) => {
      if (typeof value === "function") {
        updatedList = value(updatedList);
      } else {
        updatedList = value;
      }
    });
  });

  test("renders True/False options", () => {
    render(
      <TrueFalseStudent
        list={list}
        setList={setList}
        Q={question}
        Index={0}
        submitted={false}
      />
    );

    expect(screen.getByLabelText("True")).toBeInTheDocument();
    expect(screen.getByLabelText("False")).toBeInTheDocument();
  });

  test("selects True answer and updates list", () => {
    render(
      <TrueFalseStudent
        list={list}
        setList={setList}
        Q={question}
        Index={0}
        submitted={false}
      />
    );

    const trueRadio = screen.getByLabelText("True");
    userEvent.click(trueRadio);

    // The selected radio should be checked
    expect(trueRadio).toBeChecked();

    // The list should be updated via setList
    expect(updatedList[0].StudentAnswer).toBe("True");
  });

  test("selects False answer and updates list", () => {
    render(
      <TrueFalseStudent
        list={list}
        setList={setList}
        Q={question}
        Index={0}
        submitted={false}
      />
    );

    const falseRadio = screen.getByLabelText("False");
    userEvent.click(falseRadio);

    expect(falseRadio).toBeChecked();
    expect(updatedList[0].StudentAnswer).toBe("True");
  });

  test("does not allow changes if submitted is true", () => {
    question.StudentAnswer = "True"; // preselected answer
    render(
      <TrueFalseStudent
        list={list}
        setList={setList}
        Q={question}
        Index={0}
        submitted={true}
      />
    );

    const falseRadio = screen.getByLabelText("False");
    expect(falseRadio).toBeDisabled();

    // Clicking should not change the answer
    userEvent.click(falseRadio);
    expect(updatedList[0].StudentAnswer).toBe("True");
  });
});
