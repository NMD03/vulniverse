<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import VulniverseEditor from
  "@/editor/VulniverseEditor.ce.vue";

import {
  HttpRepository,
} from "@/repositories/HttpRepository";

const route = useRoute();

const repository =
  new HttpRepository("/api/v1");

const recordId = computed(() => {
  const value = route.params.recordId;

  return Array.isArray(value)
    ? value[0] ?? ""
    : value ?? "";
});
</script>

<template>
  <main class="standalone-page">
    <VulniverseEditor
      :repository="repository"
      mode="edit"
      :record-id="recordId"
    />
  </main>
</template>
