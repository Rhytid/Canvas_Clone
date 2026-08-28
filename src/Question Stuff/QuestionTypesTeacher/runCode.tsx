import { loadPyodide, type PyodideInterface } from "pyodide";
import ts from "typescript";
import type { CodeFile } from "./CodingTeacher";
//ChatGPT was used to help generate this code 

interface PyodideWithFS extends PyodideInterface {
  FS: {
    writeFile: (path: string, data: string) => void;
    readFile: (path: string, opts?: { encoding: "utf8" }) => string | Uint8Array;
  };
  runPythonFile?: (filename: string) => void;
}

// Cache runtimes
let pyodide: PyodideWithFS | null = null;

// ----------------------------
// 1. PYTHON (Pyodide)
// ----------------------------
async function runPython(files: CodeFile[]): Promise<string> {
  if (!pyodide) {
    pyodide = (await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.0/full/"
    }) as PyodideWithFS);
  }

  try {
    // Redirect stdout
    pyodide.runPython(`
    import sys, io
    sys.stdout = io.StringIO()
  `);

  for (const file of files) {
    pyodide.FS.writeFile(file.name, file.codeInput);
  }

    /*files.reduce<string | null>((_, f) => {
      pyodide!.FS.writeFile(f.name, f.codeInput);
      return null;
    }, null);*/

    //const mainFile: CodeFile = files.find(f => f.name === "main") ?? files[0];
    /*if (pyodide.runPythonFile) {
      pyodide.runPythonFile(mainFile.name);
    } else {
      // Fallback: read file contents and run as code
      const code = pyodide.FS.readFile(mainFile.name, { encoding: "utf8" }) as string;
      pyodide.runPython(code);
    }*/

    for (const file of files){
      const code = pyodide.FS.readFile(file.name, {encoding: "utf8"}) as string;
      pyodide.runPython(code);
    }

    // Capture stdout safely (no intermediate any assignment)
    return String(pyodide.runPython("sys.stdout.getvalue()"));
  } catch (err) {
    return "Python Error: " + String(err);
  }
}

// ----------------------------
// 2. JAVASCRIPT (iframe sandbox)
// ----------------------------

// Define the shape of messages we expect from the iframe
/*interface SandboxMessage {
  type: "sandbox_result";
  result: string;
}*/

/*function isSandboxMessage(o: object | null): o is SandboxMessage {
  if (o === null) return false;

  const rec = o as Record<string, never>;

  if (!("type" in rec) || !("result" in rec)) return false;

  const m = o as { type: string; result: string };
  return m.type === "sandbox_result" && typeof m.result === "string";
}*/

 
interface SandboxMessage {
  type: "sandbox_result";
  result: string;
}

export function runJsSandbox(code: string): Promise<string> {
  return new Promise((resolve) => {
    const iframe: HTMLIFrameElement = document.createElement("iframe");
    iframe.sandbox.add("allow-scripts");
    iframe.style.display = "none";

    // Listener is typed to expect SandboxMessage
    const listener = (e: MessageEvent<SandboxMessage>) => {
      //if (e.data.type === "sandbox_result") {
        resolve(e.data.result);
        window.removeEventListener("message", listener);
        iframe.remove();
      //}
    };
    window.addEventListener("message", listener);

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            try {
              let output = "";
              const originalLog = console.log;
              console.log = (...args) => {
                output += args.join(" ") + "\\n";
                originalLog.apply(console, args);
              };

              const result = (() => { ${code.replace(/<\/script>/g, "<\\/script>")} })();

              parent.postMessage(
                { type: "sandbox_result", result: output || String(result) },
                "*"
              );
            } catch(e) {
              parent.postMessage(
                { type: "sandbox_result", result: "JS Error: " + e },
                "*"
              );
            }
          </script>
        </body>
      </html>
    `;

    document.body.appendChild(iframe);
  });
}


export function runJsSandboxCombined(files: CodeFile[]): Promise<string> {
  const combined: string = files
    .map(f => f.codeInput)
    .reduce((acc, cur) => acc + "\n" + cur, "");
  return runJsSandbox(combined);
}


// ----------------------------
// 3. TYPESCRIPT → JS → Sandbox
// ----------------------------
async function runTypeScript(files: CodeFile[]): Promise<string> {
  const jsBundle: string = files
    .map(f => ts.transpileModule(f.codeInput, {
      compilerOptions: { module: ts.ModuleKind.ESNext }
    }).outputText)
    .reduce((acc, cur) => acc + "\n" + cur, "");

  return runJsSandbox(jsBundle);
}

// ----------------------------
// 4. C / C++ (WASM)
// ----------------------------

// Response shape from your WASM compiler API
// Response from your compiler service


/*let wasmInstance: WebAssembly.Instance | null = null;
let memory: WebAssembly.Memory | null = null;

let consoleOutput = "";

async function loadWasm(): Promise<void> {
  if (wasmInstance) return; // Already loaded

  const response = await fetch("/tcc.wasm");
  const bytes = await response.arrayBuffer();

  memory = new WebAssembly.Memory({ initial: 256 });
  const imports: WebAssembly.Imports = {
    env: {
      memory,
      puts: (ptr: number) => {
        const bytesArr = new Uint8Array(memory!.buffer);
        let s = "";
        let i = ptr;
        while (bytesArr[i] !== 0) {
          s += String.fromCharCode(bytesArr[i]);
          i++;
        }
        consoleOutput += s + "\n";
        return 0;
      },
    },
  };

  const wasmModule = await WebAssembly.instantiate(bytes, imports);
  wasmInstance = wasmModule.instance;
}

/**
 * Run C/C++ code in-browser
 * @param code - the source code
 * @param lang - "c" or "cpp"; determines interpreter mode
 */
/*export async function runCOrCpp(
  code: string,
  lang: "c" | "cpp"
): Promise<string> {
  consoleOutput = "";

  await loadWasm();

  if (!wasmInstance || !memory) return "Error: WASM failed to load.";

  try {
    // Grab the WASM function that runs code
    const runCodeFunc = wasmInstance.exports.run_code as (ptr: number, cppMode: number) => number;

    if (typeof runCodeFunc !== "function") {
      return "Error: WASM module missing run_code() export.";
    }

    // Write the code into WASM memory
    const encoder = new TextEncoder();
    const codeBytes = encoder.encode(code + "\0"); // null-terminated
    const buffer = new Uint8Array(memory.buffer, 0, codeBytes.length);
    buffer.set(codeBytes);

    // Pass lang as a flag: 1 = C++, 0 = C
    const modeFlag = lang === "cpp" ? 1 : 0;

    // Run the code
    runCodeFunc(0, modeFlag);

    return consoleOutput.trim() || "Program executed but produced no output.";
  } catch (err) {
    return "C/C++ Runtime Error: " + String(err);
  }
}*/



// ----------------------------
// 5. Unified function
// ----------------------------
export async function runCode(language: string, files: CodeFile[]): Promise<string> {
  console.log(`Received language: ${language}`); 
  switch (language.toLowerCase()) {
    case "python":
      return runPython(files);
    case "javascript":
      return runJsSandboxCombined(files);
    case "typescript":
      return runTypeScript(files);
    /*case "c":
      return runCOrCpp(files, "c");
    case "cpp":
      return runCOrCpp(files, "cpp");*/
    default:
      return "Unknown language: " + language;
  }
}
