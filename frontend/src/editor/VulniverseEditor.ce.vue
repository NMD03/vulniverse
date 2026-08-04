<script setup lang="ts">
import {
  computed,
  onMounted,
  provide,
  ref,
  watch,
} from "vue";

import type {
  Component,
} from "vue";

import type {
  EditorRepository,
} from "./contracts";

import {
  editorStateKey,
} from "./editor-context";

import {
  useEditorState,
} from "./use-editor-state";

import EditorError from
  "./components/EditorError.vue";

import EditorHeader from
  "./components/EditorHeader.vue";

import EditorNavigation from
  "./components/EditorNavigation.vue";

import MetadataSection from
  "./sections/MetadataSection.vue";

import DescriptionsSection from
  "./sections/DescriptionsSection.vue";

import JsonSection from
  "./sections/JsonSection.vue";

const props = withDefaults(
  defineProps<{
    repository?: EditorRepository;
    mode?: "create" | "edit";
    recordId?: string;
  }>(),
  {
    mode: "create",
  },
);

const emit = defineEmits<{
  ready: [];
  loaded: [
    identifier: string,
  ];
  error: [
    error: Error,
  ];
  dirtyChange: [
    dirty: boolean,
  ];
}>();

const state = useEditorState();

provide(
  editorStateKey,
  state,
);

const activeSection = ref("metadata");

const navigationItems = [
  {
    id: "metadata",
    label: "Metadata",
  },
  {
    id: "descriptions",
    label: "Descriptions",
  },
  {
    id: "json",
    label: "Advanced JSON",
  },
];

const sectionComponents:
  Record<string, Component> = {
    metadata: MetadataSection,
    descriptions: DescriptionsSection,
    json: JsonSection,
  };

const currentSection = computed(() => {
  return (
    sectionComponents[activeSection.value] ??
    MetadataSection
  );
});

async function loadRecord(): Promise<void> {
  if (props.mode !== "edit") {
    state.clear();

    state.replaceRecord({
      identifier: "",
      profile: "cve-5.2.0",
      isDraft: true,
      record: {
        dataType: "CVE_RECORD",
        dataVersion: "5.2.0",
        cveMetadata: {},
        containers: {
          cna: {
            descriptions: [],
            affected: [],
            references: [],
          },
        },
      },
    });

    emit("ready");
    return;
  }

  if (!props.recordId) {
    const error = new Error(
      "Edit mode requires a record identifier.",
    );

    state.loadError.value = error;
    emit("error", error);
    return;
  }

  if (!props.repository) {
    const error = new Error(
      "No repository has been configured.",
    );

    state.loadError.value = error;
    emit("error", error);
    return;
  }

  state.loading.value = true;
  state.loadError.value = null;

  try {
    const loaded =
      await props.repository.loadRecord(
        props.recordId,
      );

    state.replaceRecord(loaded);

    emit(
      "loaded",
      loaded.identifier,
    );

    emit("ready");
  } catch (error) {
    const normalized =
      error instanceof Error
        ? error
        : new Error(
            "Unable to load vulnerability record.",
          );

    state.loadError.value = normalized;
    emit("error", normalized);
  } finally {
    state.loading.value = false;
  }
}

watch(
  () => props.recordId,
  async (
    current,
    previous,
  ) => {
    if (current !== previous) {
      await loadRecord();
    }
  },
);

watch(
  state.dirty,
  (dirty) => {
    emit(
      "dirtyChange",
      dirty,
    );
  },
);

onMounted(loadRecord);
</script>

<template>
  <div class="vulniverse-editor">
    <EditorHeader
      :identifier="state.identifier.value"
      :profile="state.profile.value"
      :is-draft="state.isDraft.value"
      :dirty="state.dirty.value"
      :loading="state.loading.value"
      @reload="loadRecord"
    />

    <div
      v-if="state.loading.value"
      class="editor-status"
    >
      Loading vulnerability record…
    </div>

    <EditorError
      v-else-if="state.loadError.value"
      :error="state.loadError.value"
      @retry="loadRecord"
    />

    <div
      v-else-if="state.record.value"
      class="editor-layout"
    >
      <EditorNavigation
        v-model="activeSection"
        :items="navigationItems"
      />

      <main class="editor-content">
        <component
          :is="currentSection"
        />
      </main>
    </div>

    <div
      v-else
      class="editor-status"
    >
      No vulnerability record is loaded.
    </div>
  </div>
</template>

<style>
:host {
  display: block;

  --vulniverse-text: #212529;
  --vulniverse-border: #ced4da;
  --vulniverse-selected: #e9ecef;
  --vulniverse-error: #dc3545;

  color: var(--vulniverse-text);
  font-family:
    var(--vulniverse-font-family, sans-serif);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.vulniverse-editor {
  min-width: 0;
}

.editor-layout {
  display: grid;
  grid-template-columns:
    minmax(11rem, 15rem)
    minmax(0, 1fr);
  gap: 1.5rem;
  padding: 1rem;
}

.editor-content {
  min-width: 0;
}

.editor-status {
  padding: 2rem;
  text-align: center;
}

@media (max-width: 48rem) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
}
</style>
