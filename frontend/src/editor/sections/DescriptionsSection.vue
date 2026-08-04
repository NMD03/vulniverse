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
    <header class="section-header">
      <div>
        <h2>Descriptions</h2>

        <p>
          Describe the vulnerability and its
          security impact.
        </p>
      </div>

      <button
        type="button"
        @click="addDescription"
      >
        Add description
      </button>
    </header>

    <p v-if="descriptions.length === 0">
      This record has no descriptions.
    </p>

    <article
      v-for="(
        description,
        index
      ) in descriptions"
      :key="index"
      class="description-card"
    >
      <label>
        Language

        <input
          v-model="description.lang"
          type="text"
          placeholder="en"
        >
      </label>

      <label>
        Description

        <textarea
          v-model="description.value"
          rows="8"
        />
      </label>

      <button
        type="button"
        @click="removeDescription(index)"
      >
        Remove description
      </button>
    </article>
  </section>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.description-card {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid
    var(--vulniverse-border, #ced4da);
  border-radius: 0.375rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
</style>
