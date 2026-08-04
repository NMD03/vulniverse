import {
  inject,
} from "vue";

import {
  editorStateKey,
} from "./editor-context";

import type {
  EditorState,
} from "./use-editor-state";

export function useEditorContext(): EditorState {
  const state = inject(editorStateKey);

  if (!state) {
    throw new Error(
      "This component must be rendered inside "
      + "VulniverseEditor.",
    );
  }

  return state;
}
