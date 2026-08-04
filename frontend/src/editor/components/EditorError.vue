<script setup lang="ts">
defineProps<{
  error: Error;
}>();

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <section
    class="editor-error"
    role="alert"
  >
    <h2>Unable to open record</h2>

    <p>{{ error.message }}</p>

    <button
      type="button"
      @click="$emit('retry')"
    >
      Try again
    </button>
  </section>
</template>

<style scoped>
.editor-error {
  padding: 1rem;
  border: 1px solid
    var(--vulniverse-error, #dc3545);
  border-radius: 0.375rem;
}
</style>
