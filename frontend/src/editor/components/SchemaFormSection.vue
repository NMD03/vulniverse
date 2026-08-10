<script setup lang="ts">
import {
  computed,
  shallowRef,
} from "vue";

import {
  JsonForms,
} from "@jsonforms/vue";

import {
  vanillaRenderers,
} from "@jsonforms/vue-vanilla";

import type {
  JsonSchema,
  UISchemaElement,
} from "@jsonforms/core";

import authoringSchema from
  "@/generated/schemas/cve-5.2.0/authoring.schema.json";

import editorUiSchema from
  "@/generated/schemas/cve-5.2.0/ui.schema.json";

import {
  useEditorContext,
} from "../use-editor-context";

import type {
  VulnerabilityRecord,
} from "../contracts";

const editor = useEditorContext();

const schema = authoringSchema as JsonSchema;
const uiSchema = editorUiSchema as UISchemaElement;

const renderers = shallowRef(
  Object.freeze([
    ...vanillaRenderers,
  ]),
);

const formData = computed(() => {
  return editor.record.value ?? {};
});

function handleChange(event: {
  data: VulnerabilityRecord;
  errors?: unknown[];
}): void {
  editor.record.value = event.data;
}
</script>

<template>
  <JsonForms
    :data="formData"
    :schema="schema"
    :uischema="uiSchema"
    :renderers="renderers"
    validation-mode="ValidateAndShow"
    @change="handleChange"
  />
</template>
