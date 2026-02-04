import loader from "@monaco-editor/loader";
import { getConfigJsonSchema } from "@renderer/config/config-json-schema";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  createTrustedTypesPolicy(): undefined | monaco.ITrustedTypePolicy {
    return undefined;
  },
  getWorker(_: unknown, label: string): Worker {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    return new editorWorker();
  },
};

export async function initializeJsonSchema(): Promise<void> {
  try {
    // Get the JSON Schema generated from Zod
    const schema = getConfigJsonSchema();

    // Configure JSON validation with the config schema
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [
        {
          uri: "config-schema.json",
          fileMatch: ["*"],
          schema: schema,
        },
      ],
      enableSchemaRequest: false, // We provide the schema directly
    });

    // Configure completion settings for better intellisense
    monaco.languages.json.jsonDefaults.setModeConfiguration({
      documentFormattingEdits: true,
      documentRangeFormattingEdits: true,
      completionItems: true,
      hovers: true,
      documentSymbols: true,
      tokens: true,
      colors: true,
      foldingRanges: true,
      diagnostics: true,
    });
  } catch (error) {
    console.error("Error configuring JSON schema validation:", error);
  }
}

export async function initializeMonaco(): Promise<typeof monaco> {
  loader.config({ monaco });
  await initializeJsonSchema();

  return loader.init();
}
