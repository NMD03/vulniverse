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
    <header class="mb-3">
      <h2 class="h4">Metadata</h2>

      <p class="text-secondary">
        Basic identity and lifecycle information
        for the vulnerability record.
      </p>
    </header>

    <div class="row g-3">
      <div class="col-md-6 col-lg-3">
        <label class="form-label">
          Identifier
        </label>

        <input
          v-model="displayedIdentifier"
          type="text"
          class="form-control"
        >
      </div>

      <div class="col-md-6 col-lg-3">
        <label class="form-label">
          Record state
        </label>

        <select
          v-model="metadata.state"
          class="form-select"
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
      </div>

      <div class="col-md-6 col-lg-3">
        <label class="form-label">
          Data type
        </label>

        <input
          v-model="editor.record.value!.dataType"
          type="text"
          class="form-control"
        >
      </div>

      <div class="col-md-6 col-lg-3">
        <label class="form-label">
          Data version
        </label>

        <input
          v-model="editor.record.value!.dataVersion"
          type="text"
          class="form-control"
        >
      </div>
    </div>
  </section>
</template>
