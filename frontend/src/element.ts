import { defineCustomElement } from "vue";

import VulniverseEditor from
  "./editor/VulniverseEditor.ce.vue";

const VulniverseEditorElement =
  defineCustomElement(VulniverseEditor);

if (!customElements.get("vulniverse-editor")) {
  customElements.define(
    "vulniverse-editor",
    VulniverseEditorElement,
  );
}

export type {
  EditorCapabilities,
  EditorRepository,
  ValidationError,
  ValidationResult,
  VulnerabilityRecord,
} from "./editor/contracts";
