import { render, screen, fireEvent } from "@testing-library/react";
import type { Rubric, } from "../src/Question Stuff/RubricEditor";
import RubricEditor from "../src/Question Stuff/RubricEditor";
//ChatGPT was used to help generate this code 

/* -------------------- helpers -------------------- */

function makeRubric(): Rubric {
  return {
    title: "Initial Rubric",
    criteria: [
      {
        title: "Criterion 1",
        description: "Description 1",
        points: 10,
        ratings: [
          {
            title: "Full Credit",
            description: "All points",
            points: 10,
          },
          {
            title: "No Credit",
            description: "Zero points",
            points: 0,
          },
        ],
      },
    ],
  };
}

function getLatestRubric(
  mockFn: jest.Mock<void, [Rubric]>
): Rubric {
  const calls = mockFn.mock.calls;
  return calls[calls.length - 1][0];
}

/* -------------------- tests -------------------- */

describe("RubricEditor", () => {
  test("renders rubric title and total points", () => {
    const onRubricChange = jest.fn<void, [Rubric]>();

    render(
      <RubricEditor
        rubric={makeRubric()}
        onRubricChange={onRubricChange}
      />
    );

    expect(
      screen.getByDisplayValue("Initial Rubric")
    ).toBeInTheDocument();

    expect(
  screen.getByText(/total points:/i)).toBeInTheDocument();

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("updates rubric title when edited", () => {
    const onRubricChange = jest.fn<void, [Rubric]>();

    render(
      <RubricEditor
        rubric={makeRubric()}
        onRubricChange={onRubricChange}
      />
    );

    const titleInput: HTMLInputElement = screen.getByPlaceholderText(
      /enter title here/i
    );

    fireEvent.change(titleInput, {
      target: { value: "Updated Rubric Title" },
    });

    expect(onRubricChange).toHaveBeenCalled();

    const updatedRubric = getLatestRubric(onRubricChange);

    expect(updatedRubric.title).toBe("Updated Rubric Title");
  });

  test("adds a new criterion when Add Criterion is clicked", () => {
    const onRubricChange = jest.fn<void, [Rubric]>();

    render(
      <RubricEditor
        rubric={makeRubric()}
        onRubricChange={onRubricChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /add criterion/i })
    );

    const updatedRubric = getLatestRubric(onRubricChange);

    expect(updatedRubric.criteria.length).toBe(2);
  });

  test("updates criterion title", () => {
    const onRubricChange = jest.fn<void, [Rubric]>();

    render(
      <RubricEditor
        rubric={makeRubric()}
        onRubricChange={onRubricChange}
      />
    );

    const criterionTitleInput: HTMLInputElement = screen.getByPlaceholderText(
      /criterion title/i
    );

    fireEvent.change(criterionTitleInput, {
      target: { value: "Updated Criterion" },
    });

    const updatedRubric = getLatestRubric(onRubricChange);

    expect(updatedRubric.criteria[0].title).toBe(
      "Updated Criterion"
    );
  });

  test("updates criterion points and auto-updates full credit rating", () => {
  const onRubricChange = jest.fn<void, [Rubric]>();

  render(
    <RubricEditor
      rubric={makeRubric()}
      onRubricChange={onRubricChange}
    />
  );

  const textboxes: HTMLInputElement[] =
    screen.getAllByRole("textbox");

  const criterionPointsInput =
    textboxes[textboxes.length - 1];

  fireEvent.change(criterionPointsInput, {
    target: { value: "25" },
  });

  const updatedRubric = getLatestRubric(onRubricChange);

  expect(updatedRubric.criteria[0].points).toBe(25);
  expect(updatedRubric.criteria[0].ratings[0].points).toBe(25);
});

  test("adds a rating to a criterion", () => {
    const onRubricChange = jest.fn<void, [Rubric]>();

    render(
      <RubricEditor
        rubric={makeRubric()}
        onRubricChange={onRubricChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /add rating/i })
    );

    const updatedRubric = getLatestRubric(onRubricChange);

    expect(
      updatedRubric.criteria[0].ratings.length
    ).toBe(3);
  });
});
