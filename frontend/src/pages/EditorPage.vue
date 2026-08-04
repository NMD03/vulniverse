<script setup lang="ts">
import {
  computed,
} from "vue";

import {
  useRoute,
} from "vue-router";

import VulniverseEditor from
  "@/editor/VulniverseEditor.ce.vue";

import {
  HttpRepository,
} from "@/repositories/HttpRepository";

const route = useRoute();

const repository =
  new HttpRepository("/api/v1");

const recordId = computed(() => {
  const parameter =
    route.params.recordId;

  if (Array.isArray(parameter)) {
    return parameter[0] ?? "";
  }

  return parameter ?? "";
});

function handleLoaded(
  identifier: string,
): void {
  console.info(
    "Opened vulnerability record:",
    identifier,
  );
}

function handleError(
  error: Error,
): void {
  console.error(
    "Editor error:",
    error,
  );
}
</script>

<template>
  <VulniverseEditor
    :repository="repository"
    mode="edit"
    :record-id="recordId"
    @loaded="handleLoaded"
    @error="handleError"
  />
</template>
