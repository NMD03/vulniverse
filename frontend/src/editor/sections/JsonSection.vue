<script setup lang="ts">
import {
  computed,
  ref,
  watch,
} from "vue";

import {
  useEditorContext,
} from "../use-editor-context";

import type {
  VulnerabilityRecord,
} from "../contracts";

const editor = useEditorContext();

const source = ref("");
const parseError = ref<string | null>(null);

const formattedRecord = computed(() => {
  return JSON.stringify(
    editor.record.value,
    null,
    2,
  );
});

/*
 * Refresh the temporary JSON text whenever the
 * canonical record changes and the user is not
 * currently applying an invalid JSON document.
 */
watch(
  formattedRecord,
  (value) => {
    if (!parseError.value) {
      source.value = value;
    }
  },
  {
    immediate: true,
  },
);

function reset(): void {
  source.value = formattedRecord.value;
  parseError.value = null;
}

function apply(): void {
  try {
    const parsed: unknown =
      JSON.parse(source.value);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error(
        "The record must be a JSON object.",
      );
    }

    editor.record.value =
      parsed as VulnerabilityRecord;

    parseError.value = null;
  } catch (error) {
    parseError.value =
      error instanceof Error
        ? error.message
        : "Invalid JSON.";
  }
}
</script>

<template>
  <section>
    <header>
      <h2>Advanced JSON</h2>

      <p>
        Review or replace the complete record.
        Changes are only applied after pressing
        Apply JSON.
      </p>
    </header>

    <textarea
      v-model="source"
      class="json-source"
      rows="30"
      spellcheck="false"
    />

    <p
      v-if="parseError"
      role="alert"
    >
      {{ parseError }}
    </p>

    <div class="json-actions">
      <button
        type="button"
        @click="reset"
      >
        Reset
      </button>

      <button
        type="button"
        @click="apply"
      >
        Apply JSON
      </button>
    </div>
  </section>
</template>

<style scoped>
.json-source {
  box-sizing: border-box;
  width: 100%;
  padding: 1rem;
  font-family: monospace;
}

.json-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
