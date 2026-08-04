<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import type {
  EditorRepository,
  ValidationError,
  VulnerabilityRecord,
} from "./contracts";

const props = withDefaults(
  defineProps<{
    repository?: EditorRepository;
    mode?: "create" | "edit";
    recordId?: string;
    profile?: string;
  }>(),
  {
    mode: "create",
    profile: "cve-5.2.0",
  },
);

const emit = defineEmits<{
  ready: [];
  saved: [record: VulnerabilityRecord];
  error: [error: Error];
}>();

const source = ref("{}");
const loading = ref(false);
const saving = ref(false);
const validationErrors = ref<ValidationError[]>([]);

const parsedRecord = computed<VulnerabilityRecord | null>(
  () => {
    try {
      return JSON.parse(source.value);
    } catch {
      return null;
    }
  },
);

onMounted(async () => {
  try {
    if (!props.repository) {
      throw new Error(
        "No editor repository has been configured.",
      );
    }

    if (
      props.mode === "edit"
      && props.recordId
    ) {
      loading.value = true;

      const record =
        await props.repository.loadRecord(
          props.recordId,
        );

      source.value = JSON.stringify(
        record,
        null,
        2,
      );
    }

    emit("ready");
  } catch (error) {
    emit("error", normalizeError(error));
  } finally {
    loading.value = false;
  }
});

async function validate(): Promise<boolean> {
  if (!props.repository) {
    return false;
  }

  const record = parsedRecord.value;

  if (!record) {
    validationErrors.value = [{
      path: [],
      schemaPath: [],
      message: "The record is not valid JSON.",
    }];

    return false;
  }

  const result =
    await props.repository.validateRecord(
      record,
      props.profile,
    );

  validationErrors.value = result.errors;

  return result.valid;
}

async function save(): Promise<void> {
  if (!props.repository) {
    return;
  }

  const record = parsedRecord.value;

  if (!record) {
    await validate();
    return;
  }

  saving.value = true;

  try {
    const saved =
      props.mode === "edit" && props.recordId
        ? await props.repository.updateRecord(
            props.recordId,
            record,
            props.profile,
          )
        : await props.repository.createRecord(
            record,
            props.profile,
          );

    emit("saved", saved);
  } catch (error) {
    emit("error", normalizeError(error));
  } finally {
    saving.value = false;
  }
}

function normalizeError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error("Unexpected editor error.");
}
</script>

<template>
  <main class="vulniverse-editor">
    <p v-if="loading">Loading record…</p>

    <template v-else>
      <textarea
        v-model="source"
        class="vulniverse-editor__source"
        spellcheck="false"
        aria-label="Vulnerability record JSON"
      />

      <section
        v-if="validationErrors.length"
        class="vulniverse-editor__errors"
        aria-live="polite"
      >
        <h2>Validation errors</h2>

        <ul>
          <li
            v-for="error in validationErrors"
            :key="`${error.path.join('.')}-${error.message}`"
          >
            <code>
              {{ error.path.join(".") || "record" }}
            </code>
            — {{ error.message }}
          </li>
        </ul>
      </section>

      <div class="vulniverse-editor__actions">
        <button type="button" @click="validate">
          Validate
        </button>

        <button
          type="button"
          :disabled="saving"
          @click="save"
        >
          {{ saving ? "Saving…" : "Save draft" }}
        </button>
      </div>
    </template>
  </main>
</template>

<style>
:host {
  display: block;

  --vulniverse-text: #212529;
  --vulniverse-border: #ced4da;
  --vulniverse-error: #b02a37;

  color: var(--vulniverse-text);
  font-family:
    var(--vulniverse-font-family, sans-serif);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.vulniverse-editor__source {
  width: 100%;
  min-height: 32rem;
  padding: 1rem;
  border: 1px solid var(--vulniverse-border);
  font-family: monospace;
}

.vulniverse-editor__errors {
  margin-block: 1rem;
  padding: 1rem;
  border: 1px solid var(--vulniverse-error);
}

.vulniverse-editor__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
