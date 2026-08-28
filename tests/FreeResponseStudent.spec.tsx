import { render, screen, fireEvent } from "@testing-library/react";
import type { QuestionObject } from "../src/Question Stuff/QuestionParent";
import React from "react";
import { FreeResponseStudent } from "../src/Question Stuff/QuestionTypesStudent/FreeResponseStudent";
//ChatGPT was used to help generate this code 

/* ---------- helpers ---------- */
function makeFRQuestion(overrides?: Partial<QuestionObject>): QuestionObject {
  return {
    Type: "Free Response",
    Question: "Explain gravity",
    Answer: "",
    Points: 0,
    Answers: [],
    StudentAnswer: "",
    MultipleAnswers: false,
    rubric: {
      title: "Rubric",
      criteria: [
        {
          title: "Content",
          description: "Explanation accuracy",
          points: 5,
          ratings: [
            { title: "Excellent", description: "Perfect answer", points: 5 },
            { title: "Good", description: "Mostly correct", points: 3 },
          ],
        },
      ],
    },
    rubricVisibility: "always",
    ...overrides,
  } as QuestionObject;
}

/* ---------- tests ---------- */
describe("FreeResponseStudent", () => {
  let list: QuestionObject[];
  let updatedList: QuestionObject[];
  let setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  const submitted = false;

  beforeEach(() => {
    list = [makeFRQuestion()];
    updatedList = [...list];

    setList = jest.fn((value) => {
      if (typeof value === "function") {
        updatedList = (value as (prev: QuestionObject[]) => QuestionObject[])(updatedList);
      } else {
        updatedList = value;
      }
    });
  });

  test("renders answer textarea and rubric", () => {
    render(
      <FreeResponseStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={submitted}
      />
    );

    // Answer textarea
    expect(screen.getByPlaceholderText(/type your answer here/i)).toBeInTheDocument();

    // Rubric title
    expect(screen.getByText("Rubric")).toBeInTheDocument();

    // Criteria title and description
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Explanation accuracy")).toBeInTheDocument();

    // Ratings
    expect(screen.getByText("Excellent")).toBeInTheDocument();
    expect(screen.getByText("Perfect answer")).toBeInTheDocument();
    expect(screen.getByText("5 pts")).toBeInTheDocument();
  });

  test("updates StudentAnswer on typing", () => {
    render(
      <FreeResponseStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={submitted}
      />
    );

    const textarea = screen.getByPlaceholderText(/type your answer here/i);
    fireEvent.change(textarea, { target: { value: "Gravity pulls objects down" } });

    expect(updatedList[0].StudentAnswer).toBe("Gravity pulls objects down");
  });

  test("does not show rubric if visibility is hidden", () => {
    list[0].rubricVisibility = "hidden";
    render(
      <FreeResponseStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={submitted}
      />
    );

    expect(screen.queryByText("Rubric")).not.toBeInTheDocument();
  });

  test("shows rubric only after submission if visibility is afterSubmit", () => {
    list[0].rubricVisibility = "afterSubmit";

    // Not submitted yet
    render(
      <FreeResponseStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={false}
      />
    );
    expect(screen.queryByText("Rubric")).not.toBeInTheDocument();

    // Submitted
    render(
      <FreeResponseStudent
        list={list}
        setList={setList}
        Q={list[0]}
        Index={0}
        submitted={true}
      />
    );
    expect(screen.getByText("Rubric")).toBeInTheDocument();
  });
});
