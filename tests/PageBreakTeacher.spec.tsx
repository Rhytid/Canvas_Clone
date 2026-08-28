import { render, screen, fireEvent } from "@testing-library/react";
import { PagerBreak } from "../src/Question Stuff/QuestionTypesTeacher/PageBreakTeacher";
import type { QuestionObject } from "../src/Question Stuff/QuestionParent";
//ChatGPT was used to help generate this code 

describe("PagerBreak (Teacher View)", () => {
  const makeQuestion = (type: string): QuestionObject =>
    ({
      Question: "",
      Answers: [],
      Answer: "",
      Points: 0,
      Type: type,
      StudentAnswer: "",
      MultipleAnswers: false,
    } as QuestionObject);

  test("renders PAGE BREAK label and delete button", () => {
    const list: QuestionObject[] = [makeQuestion("Page Break")];

    let updatedList: QuestionObject[] = list;

  const setList: React.Dispatch<React.SetStateAction<QuestionObject[]>> =
    jest.fn((value) => {
      if (typeof value === "function") {
        updatedList = value(updatedList);
      } else {
        updatedList = value;
      }
    });

    render(<PagerBreak list={list} setList={setList} Index={0} />);

    expect(screen.getByText("PAGE BREAK")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete page break/i })
    ).toBeInTheDocument();
  });

  test("removes the page break when delete button is clicked", () => {
  const list: QuestionObject[] = [
    makeQuestion("Multiple Choice Question"),
    makeQuestion("Page Break"),
    makeQuestion("True False Question"),
  ];

  let updatedList: QuestionObject[] = list;

  const setList: React.Dispatch<React.SetStateAction<QuestionObject[]>> =
    jest.fn((value) => {
      if (typeof value === "function") {
        updatedList = value(updatedList);
      } else {
        updatedList = value;
      }
    });

  render(<PagerBreak list={list} setList={setList} Index={1} />);

  fireEvent.click(
    screen.getByRole("button", { name: /delete page break/i })
  );

  expect(updatedList).toHaveLength(2);
  expect(updatedList[0].Type).toBe("Multiple Choice Question");
  expect(updatedList[1].Type).toBe("True False Question");
});
});
