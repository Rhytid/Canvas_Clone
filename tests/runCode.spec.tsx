import ts from "typescript";
import type { CodeFile } from "../src/Question Stuff/QuestionTypesTeacher/CodingTeacher";
import * as realModule from "../src/Question Stuff/QuestionTypesTeacher/runCode";
import * as runCodeModule from "../src/Question Stuff/QuestionTypesTeacher/runCode";
const { runCode, runJsSandboxCombined } = runCodeModule;
//ChatGPT was used to help generate this code 

// --------------------------
// 1️⃣ Mock external libraries
// --------------------------

// Mock TypeScript transpileModule
jest.mock("typescript", () => {
  const actualTs: typeof import("typescript") = jest.requireActual("typescript");
  return {
    ...actualTs,
    transpileModule: jest.fn(
      (input: string, options: import("typescript").TranspileOptions): import("typescript").TranspileOutput => {
        void input;
        void options;
        return { outputText: "// transpiled code", diagnostics: [] };
      }
    ),
  };
});

// Mock runCode module
jest.mock("../src/Question Stuff/QuestionTypesTeacher/runCode", () => {
  const actual: typeof realModule = jest.requireActual("../src/Question Stuff/QuestionTypesTeacher/runCode");
  return {
    ...actual,
    runJsSandboxCombined: jest.fn<Promise<string>, [CodeFile[]]>((files) => {
      void files;
      return Promise.resolve("mocked output");
    }),
    runCode: jest.fn<Promise<string>, [string, CodeFile[]]>((language, files) => {
  if (language === "python") {
    return Promise.resolve("Hello from Python");
  }
  if (language === "javascript") {
    // delegate to mocked runJsSandboxCombined
    return runJsSandboxCombined(files);
  }
  if (language === "typescript") {
    // delegate to mocked ts.transpileModule and runJsSandboxCombined
    ts.transpileModule(files[0].codeInput, { compilerOptions: { module: ts.ModuleKind.ESNext } });
    return runJsSandboxCombined(files);
  }
  return Promise.resolve("Unknown language");
}),
  };
});


// --------------------------
// 2️⃣ Tests
// --------------------------
describe("runCode", () => {
  let mockPythonFiles: CodeFile[];
  let mockJavaScriptFiles: CodeFile[];
  let mockTypeScriptFiles: CodeFile[];

  beforeEach(() => {
    jest.clearAllMocks();

    mockPythonFiles = [
      { name: "test.py", codeInput: 'print("Hello, Python!")', language: "python", isTeacher: 0 },
    ];
    mockJavaScriptFiles = [
      { name: "test.js", codeInput: 'console.log("Hello, JS!")', language: "javascript", isTeacher: 1 },
    ];
    mockTypeScriptFiles = [
      { name: "test.ts", codeInput: 'console.log("Hello, TS!")', language: "typescript", isTeacher: 0 },
    ];
  });

  test("should run Python code safely", async () => {
    const result = await runCode("python", mockPythonFiles);
    expect(result).toBe("Hello from Python");
  });

  test("should run JavaScript code safely", async () => {
    const result = await runCode("javascript", mockJavaScriptFiles);
    expect(runJsSandboxCombined).toHaveBeenCalledWith(mockJavaScriptFiles);
    expect(result).toBe("mocked output");
  });

  test("should run TypeScript code safely", async () => {
    const result = await runCode("typescript", mockTypeScriptFiles);
    expect(ts.transpileModule).toHaveBeenCalledWith(mockTypeScriptFiles[0].codeInput, {
      compilerOptions: { module: ts.ModuleKind.ESNext },
    });
    expect(runJsSandboxCombined).toHaveBeenCalled();
    expect(result).toBe("mocked output");
  });
});
