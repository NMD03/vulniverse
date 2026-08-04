<script setup lang="ts">
import {
  computed,
} from "vue";

import type {
  CnaContainer,
  Description,
} from "../contracts";

import {
  useEditorContext,
} from "../use-editor-context";

const editor = useEditorContext();

const cna = computed<CnaContainer>(() => {
  const record = editor.record.value;

  if (!record) {
    throw new Error(
      "No vulnerability record is loaded.",
    );
  }

  if (!record.containers) {
    record.containers = {};
  }

  if (!record.containers.cna) {
    record.containers.cna = {};
  }

  return record.containers.cna;
});

const descriptions =
  computed<Description[]>(() => {
    if (!Array.isArray(cna.value.descriptions)) {
      cna.value.descriptions = [];
    }

    return cna.value.descriptions;
  });

function addDescription(): void {
  descriptions.value.push({
    lang: "en",
    value: "",
  });
}

function removeDescription(
  index: number,
): void {
  descriptions.value.splice(index, 1);
}
</script>

<template>
  <section>
    <header
      class="d-flex align-items-start
             justify-content-between gap-3 mb-3"
    >
      <div>
        <h2 class="h4">Descriptions</h2>

        <p class="text-secondary">
          Describe the vulnerability and its
          security impact.
        </p>
      </div>

      <button
        type="button"
        class="btn btn-primary"
        @click="addDescription"
      >
        Add description
      </button>
    </header>

    <p
      v-if="descriptions.length === 0"
      class="text-secondary"
    >
      This record has no descriptions.
    </p>

    <div
      v-for="(
        description,
        index
      ) in descriptions"
      :key="index"
      class="card mb-3"
    >
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">
            Language
          </label>

          <input
            v-model="description.lang"
            type="text"
            placeholder="en"
            class="form-control"
          >
        </div>

        <div class="mb-3">
          <label class="form-label">
            Description
          </label>

          <textarea
            v-model="description.value"
            rows="8"
            class="form-control"
          />
        </div>

        <button
          type="button"
          class="btn btn-outline-danger btn-sm"
          @click="removeDescription(index)"
        >
          Remove description
        </button>
      </div>
    </div>
  </section>
</template>
