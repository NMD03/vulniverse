<script setup lang="ts">
import {
  computed,
} from "vue";

import {
  useEditorContext,
} from "../use-editor-context";

import type {
  CveMetadata,
} from "../contracts";

const editor = useEditorContext();

const metadata = computed<CveMetadata>(() => {
  const record = editor.record.value;

  if (!record) {
    throw new Error(
      "No vulnerability record is loaded.",
    );
  }

  if (!record.cveMetadata) {
    record.cveMetadata = {};
  }

  return record.cveMetadata;
});

const displayedIdentifier = computed({
  get(): string {
    return (
      metadata.value.vulnId ??
      metadata.value.cveId ??
      ""
    );
  },

  set(value: string): void {
    if (
      metadata.value.vulnId !== undefined
    ) {
      metadata.value.vulnId = value;
    } else {
      metadata.value.cveId = value;
    }
  },
});
</script>

<template>
  <section>
    <header>
      <h2>Metadata</h2>

      <p>
        Basic identity and lifecycle information
        for the vulnerability record.
      </p>
    </header>

    <div class="field-grid">
      <label>
        Identifier

        <input
          v-model="displayedIdentifier"
          type="text"
        >
      </label>

      <label>
        Record state

        <select
          v-model="metadata.state"
        >
          <option value="">
            Select a state
          </option>

          <option value="PUBLISHED">
            Published
          </option>

          <option value="REJECTED">
            Rejected
          </option>
        </select>
      </label>

      <label>
        Data type

        <input
          v-model="editor.record.value!.dataType"
          type="text"
        >
      </label>

      <label>
        Data version

        <input
          v-model="editor.record.value!.dataVersion"
          type="text"
        >
      </label>
    </div>
  </section>
</template>

<style scoped>
.field-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

input,
select {
  min-height: 2.5rem;
  padding: 0.5rem;
}
</style>
