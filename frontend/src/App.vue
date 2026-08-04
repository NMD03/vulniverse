<script setup lang="ts">
import VulniverseEditor from
  "./editor/VulniverseEditor.ce.vue";

import { HttpRepository } from
  "./repositories/HttpRepository";

const repository =
  new HttpRepository("/api/v1");
</script>

<template>
  <VulniverseEditor
    :repository="repository"
    mode="create"
    profile="cve-5.2.0"
    @saved="record => console.log('Saved', record)"
  />
</template>

