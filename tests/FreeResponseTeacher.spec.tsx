import { render, screen } from "@testing-library/react";
import React from "react";
import { FreeResponseTeacher } from "../src/Question Stuff/QuestionTypesTeacher/FreeResponseTeacher";
import type { QuestionObject } from "../src/Question Stuff/QuestionParent";
import type { Rubric } from "../src/Question Stuff/RubricEditor";
//ChatGPT was used to help generate this code 

// Mock RubricEditor so we can trigger onRubricChange
jest.mock("../src/Question Stuff/RubricEditor", () => ({
  __esModule: true,
  default: ({ onRubricChange }: { onRubricChange: (r: Rubric) => void }) => {
    // simple button to trigger rubric change in tests
    return <button onClick={() => onRubricChange({
        criteria: [{
            description: "Test", points: 3,
            title: "",
            ratings: []
        }],
        title: ""
    })}>Update Rubric</button>;
  },
}));

describe("FreeResponseTeacher", () => {
  let list: QuestionObject[];
  let updatedList: QuestionObject[];
  let setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  let qIndex: number;
  let setQIndex: React.Dispatch<React.SetStateAction<number>>;

  beforeEach(() => {
    list = [
  {
    Type: "Free Response",
    Question: "Explain gravity",
    Answer: "",
    Points: 0,
    Answers: [],
    StudentAnswer: "",
    MultipleAnswers: false,
    rubric: { 
      title: "Default Rubric", // required
      criteria: [],            // empty array is fine
    },
    rubricVisibility: "hidden",
  } as QuestionObject,
];
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

  test("updates rubric and adjusts points", () => {
    render(
      <FreeResponseTeacher
        list={list}
        setList={setList}
        Index={0}
        QIndex={qIndex}
        setQIndex={setQIndex}
      />
    );

    // Click the mocked RubricEditor button to trigger onRubricChange
    const updateButton = screen.getByText("Update Rubric");
    updateButton.click();

    // The rubric points should now be updated in updatedList
    expect(updatedList[0].Points).toBe(3);
    expect(updatedList[0].rubric!.criteria[0].description).toBe("Test");
  });
});
