import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToolbarPlugin from "../src/Question Stuff/QuestionTypesTeacher/plugins/ToolbarPlugin";
//ChatGPT was used to help generate this code 

/* -------------------- types -------------------- */

interface MockEditor {
  dispatchCommand: jest.Mock<void, [symbol, string | undefined]>;
  registerUpdateListener: jest.Mock<() => void, [RegisterUpdateListenerPayload]>;
  registerCommand: jest.Mock<
    () => void,
    [symbol, (payload: boolean) => boolean, number]
  >;
}

interface RegisterUpdateListenerPayload {
  editorState: {
    read: (fn: () => void, options: { editor: MockEditor }) => void;
  };
}

/* -------------------- mocks -------------------- */

const mockEditor: MockEditor = {
  dispatchCommand: jest.fn<void, [symbol, string | undefined]>(),
  registerUpdateListener: jest.fn<
    () => void,
    [RegisterUpdateListenerPayload]
  >(() => () => {}),
  registerCommand: jest.fn<
    () => void,
    [symbol, (payload: boolean) => boolean, number]
  >(() => () => {}),
};

jest.mock("@lexical/react/LexicalComposerContext", () => ({
  useLexicalComposerContext: (): [MockEditor] => [mockEditor],
}));

jest.mock("@lexical/utils", () => ({
  mergeRegister:
    (...fns: Array<() => void>): (() => void) =>
    () => {
      fns.forEach((fn) => fn());
    },
}));

jest.mock("lexical", () => ({
  $getSelection: (): null => null,
  $isRangeSelection: (): boolean => false,

  CAN_UNDO_COMMAND: Symbol("CAN_UNDO_COMMAND"),
  CAN_REDO_COMMAND: Symbol("CAN_REDO_COMMAND"),
  UNDO_COMMAND: Symbol("UNDO_COMMAND"),
  REDO_COMMAND: Symbol("REDO_COMMAND"),
  FORMAT_TEXT_COMMAND: Symbol("FORMAT_TEXT_COMMAND"),
  FORMAT_ELEMENT_COMMAND: Symbol("FORMAT_ELEMENT_COMMAND"),
  SELECTION_CHANGE_COMMAND: Symbol("SELECTION_CHANGE_COMMAND"),

  COMMAND_PRIORITY_LOW: 1,
}));

/* -------------------- tests -------------------- */

describe("ToolbarPlugin", () => {
  beforeEach(() => {
    mockEditor.dispatchCommand.mockClear();
  });

  test("undo and redo buttons are disabled initially", () => {
    render(<ToolbarPlugin />);

    expect(
      screen.getByRole("button", { name: /undo/i })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: /redo/i })
    ).toBeDisabled();
  });

  test("clicking disabled undo button does not dispatch command", () => {
    render(<ToolbarPlugin />);

    userEvent.click(
          screen.getByRole("button", { name: /undo/i })
      );

    expect(mockEditor.dispatchCommand).not.toHaveBeenCalled();
  });

  test("clicking disabled redo button does not dispatch command", () => {
    render(<ToolbarPlugin />);

    userEvent.click(
          screen.getByRole("button", { name: /redo/i })
      );

    expect(mockEditor.dispatchCommand).not.toHaveBeenCalled();
  });

  test("dispatches format commands when format buttons are clicked", () => {
    render(<ToolbarPlugin />);

    userEvent.click(
          screen.getByRole("button", { name: /format bold/i })
      );

    userEvent.click(
          screen.getByRole("button", { name: /format italics/i })
      );

    expect(mockEditor.dispatchCommand).toHaveBeenCalled();
  });

  test("dispatches alignment commands when alignment buttons are clicked", () => {
    render(<ToolbarPlugin />);

    userEvent.click(
          screen.getByRole("button", { name: /left align/i })
      );

    userEvent.click(
          screen.getByRole("button", { name: /center align/i })
      );

    expect(mockEditor.dispatchCommand).toHaveBeenCalled();
  });
});
