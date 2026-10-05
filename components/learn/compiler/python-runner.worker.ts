const PYODIDE_BASE_URL = "https://cdn.jsdelivr.net/pyodide/v0.28.2/full/";

type Pyodide = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStderr: (options: { batched: (message: string) => void }) => void;
  setStdout: (options: { batched: (message: string) => void }) => void;
};

declare const loadPyodide: (options: { indexURL: string }) => Promise<Pyodide>;

let pyodide: Pyodide | null = null;

async function loadPython() {
  if (pyodide) return;

  self.postMessage({ type: "status", text: "Loading Python runtime..." });
  (self as typeof self & { importScripts: (...urls: string[]) => void }).importScripts(`${PYODIDE_BASE_URL}pyodide.js`);
  pyodide = await loadPyodide({ indexURL: PYODIDE_BASE_URL });
  pyodide.setStdout({ batched: (text) => self.postMessage({ type: "output", outputType: "log", text }) });
  pyodide.setStderr({ batched: (text) => self.postMessage({ type: "output", outputType: "error", text }) });
}

self.addEventListener("message", async (event: MessageEvent<{ type: "run"; code: string }>) => {
  if (event.data.type !== "run") return;

  try {
    await loadPython();
    self.postMessage({ type: "ready" });
    await pyodide?.runPythonAsync(event.data.code);
  } catch (error) {
    self.postMessage({ type: "output", outputType: "error", text: error instanceof Error ? error.message : String(error) });
  } finally {
    self.postMessage({ type: "done" });
  }
});
