import { render, screen } from "@testing-library/react";
import React from "react";
import type { QuestionObject } from "../src/Question Stuff/QuestionParent";
import { MultipleChoiceStudent } from "../src/Question Stuff/QuestionTypesStudent/MultipleChoiceStudent";
//ChatGPT was used to help generate this code 

/* ---------- helpers ---------- */

function makeMCQuestion(
  overrides?: Partial<QuestionObject>
): QuestionObject {
  return {
    Type: "Multiple Choice",
    Question: "What is the capital of France?",
    Answers: ["Paris", "Berlin"],
    Answer: ["Paris"],
    StudentAnswer: "",
    Points: 1,
    MultipleAnswers: false,
    ...overrides,
  } as QuestionObject;
}

/* ---------- tests ---------- */

describe("MultipleChoiceStudent", () => {
  let list: QuestionObject[];
  let updatedList: QuestionObject[];

  const setList: jest.MockedFunction<
    React.Dispatch<React.SetStateAction<QuestionObject[]>>
  > = jest.fn();

  beforeEach(() => {
    list = [makeMCQuestion()];
    updatedList = [...list];

    setList.mockImplementation((value) => {
      if (typeof value === "function") {
        updatedList = value(updatedList);
      } else {
        updatedList = value;
      }
    });
  });

  afterEach(() => {
    setList.mockClear();
  });

  /*test("selects and replaces answer in single-answer (radio) mode", () => {
    render(
      <MultipleChoiceStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={false}
      />
    );

    fireEvent.click(screen.getByLabelText("Paris"));
    fireEvent.click(screen.getByLabelText("Berlin"));

    expect(updatedList[0].StudentAnswer).toBe("Berlin");
  });

  test("allows multiple answers when MultipleAnswers is true", () => {
    list = [makeMCQuestion({ MultipleAnswers: true })];
    updatedList = [...list];

    render(
      <MultipleChoiceStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={false}
      />
    );

    fireEvent.click(screen.getByLabelText("Paris"));
    fireEvent.click(screen.getByLabelText("Berlin"));

    expect(updatedList[0].StudentAnswer).toEqual(
      expect.arrayContaining(["Paris", "Berlin"])
    );
  });*/

  test("disables inputs when submitted is true", () => {
    render(
      <MultipleChoiceStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={true}
      />
    );

    expect(screen.getByLabelText("Paris")).toBeDisabled();
    expect(screen.getByLabelText("Berlin")).toBeDisabled();
  });

  /*test("loads existing StudentAnswer when submitted becomes true", () => {
    list = [
      makeMCQuestion({
        StudentAnswer: "Berlin",
      }),
    ];
    updatedList = [...list];

    const { rerender } = render(
      <MultipleChoiceStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={false}
      />
    );

    rerender(
      <MultipleChoiceStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={true}
      />
    );

    expect(screen.getByLabelText("Berlin")).toBeChecked();
  });*/

  test("renders fallback text when no answers are available", () => {
    list = [
      makeMCQuestion({
        Answers: [],
      }),
    ];

    render(
      <MultipleChoiceStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={false}
      />
    );

    expect(
      screen.getByText(
        "No answer options available for this question at this time."
      )
    ).toBeInTheDocument();
  });
});
