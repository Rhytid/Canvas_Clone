
// tests/Assignment.spec.tsx
import type { SetStateAction } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import userEvent from "@testing-library/user-event";
import { Assignment } from "../src/Assignment-Components/Assignment";
import type { Assign } from "../src/Assignment-Components/Dashboard";
//ChatGPT was used to help generate this code 

// Sample assignment for testing
const sampleAssignment: Assign = {
  editMode: true,
  Title: "Test Assignment",
  dueDate: new Date(),
  Totalpoints: 10,
  time: "30 mins",
  notes: "Some notes",
  description: "Some description",
  showMetadata: true,
  Questions: [],
  QIndex: 0,
  collaborators: [],
  Attempts: 1,
  StudentAttempts: 0,
  Grade: -1,
  Published: false,
};

// Fully typed setAlist mock
const mockSetAlist = jest.fn() as jest.Mock<void, [SetStateAction<Assign[]>]>;

describe("Assignment Component - full input coverage", () => {
  beforeEach(() => {
    mockSetAlist.mockClear();
  });

  test("updates description, time, notes, attempts and showMetadata", () => {
    const Alist: Assign[] = [sampleAssignment];
    render(
      <MemoryRouter>
        <Assignment Alist={Alist} setAlist={mockSetAlist} />
      </MemoryRouter>
    );

    // Description
    const descriptionInput = screen.getByPlaceholderText(
      "Enter assignment description here"
    );
    fireEvent.change(descriptionInput, { target: { value: "Updated Description" } });

    // Time
    const timeInput = screen.getByPlaceholderText("Enter estimated time here");
    fireEvent.change(timeInput, { target: { value: "45 mins" } });

    // Notes
    const notesInput = screen.getByPlaceholderText("Add notes here");
    fireEvent.change(notesInput, { target: { value: "Updated Notes" } });

    // Attempts
    const attemptsInput = screen.getByPlaceholderText("Enter Points Value Here");
    fireEvent.change(attemptsInput, { target: { value: 3 } });

    // Toggle showMetadata
    const checkbox = screen.getByLabelText(/Show Metadata/i);
    fireEvent.click(checkbox);

    expect(mockSetAlist).toHaveBeenCalledTimes(5);

    // Check functional updates using deepClone
    const lastCall = mockSetAlist.mock.calls[4][0];
    if (typeof lastCall === "function") {
      const updated = lastCall(Alist);
      expect(updated[0].description).toBe("Updated Description");
      expect(updated[0].time).toBe("45 mins");
      expect(updated[0].notes).toBe("Updated Notes");
      expect(updated[0].Attempts).toBe(3);
      expect(updated[0].showMetadata).toBe(false); // toggled off
    }
  });

  test("updates due date using DatePicker", () => {
  const Alist: Assign[] = [sampleAssignment];
  render(
    <MemoryRouter>
      <Assignment Alist={Alist} setAlist={mockSetAlist} />
    </MemoryRouter>
  );

  // get the input by placeholder
  const dateInput = screen.getByPlaceholderText("Select due date and time");

  // Use userEvent to clear and type a new date string
  userEvent.clear(dateInput);
  userEvent.type(dateInput, "12/25/2025 12:30 PM");

  // Simulate blur to trigger the DatePicker onChange
  fireEvent.blur(dateInput);

  expect(mockSetAlist).toHaveBeenCalled();

  const call = mockSetAlist.mock.calls[0][0];
  if (typeof call === "function") {
    const updated = call(Alist);
    expect(updated[0].dueDate!.toISOString()).toBe(
      new Date("2025-12-25T12:30:00").toISOString()
    );
  }
});

  test("updates title field", () => {
    const Alist: Assign[] = [sampleAssignment];
    render(
      <MemoryRouter>
        <Assignment Alist={Alist} setAlist={mockSetAlist} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Enter Assignment Title Here");
    fireEvent.change(input, { target: { value: "New Title" } });

    const call = mockSetAlist.mock.calls[0][0];
    if (typeof call === "function") {
      const updated = call(Alist);
      expect(updated[0].Title).toBe("New Title");
    }
  });
});
