import type {
  InjectionKey,
} from "vue";

import type {
  EditorState,
} from "./use-editor-state";

export const editorStateKey:
  InjectionKey<EditorState> =
    Symbol("vulniverse-editor-state");
