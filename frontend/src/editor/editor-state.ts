import {
  computed,
  reactive,
  ref,
} from "vue";

import type {
  ValidationError,
  VulnerabilityRecord,
} from "./contracts";

export function useEditorState() {
  const record = reactive<VulnerabilityRecord>({});
  const originalRecord = ref<VulnerabilityRecord>({});

  const validationErrors =
    ref<ValidationError[]>([]);

  const loading = ref(false);
  const saving = ref(false);

  const dirty = computed(() => {
    return JSON.stringify(record) !==
      JSON.stringify(originalRecord.value);
  });

  function replaceRecord(
    nextRecord: VulnerabilityRecord,
  ): void {
    for (const key of Object.keys(record)) {
      delete record[key];
    }

    Object.assign(
      record,
      structuredClone(nextRecord),
    );

    originalRecord.value =
      structuredClone(nextRecord);

    validationErrors.value = [];
  }

  function markSaved(
    savedRecord: VulnerabilityRecord,
  ): void {
    replaceRecord(savedRecord);
  }

  return {
    record,
    validationErrors,
    loading,
    saving,
    dirty,
    replaceRecord,
    markSaved,
  };
}

export type EditorState =
  ReturnType<typeof useEditorState>;
