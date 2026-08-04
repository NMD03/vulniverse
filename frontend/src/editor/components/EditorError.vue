<script setup lang="ts">
defineProps<{
  error: Error;
}>();

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div
    class="alert alert-danger m-3"
    role="alert"
  >
    <h2 class="h5">Unable to open record</h2>

    <p class="mb-3">{{ error.message }}</p>

    <button
      type="button"
      class="btn btn-outline-danger btn-sm"
      @click="$emit('retry')"
    >
      Try again
    </button>
  </div>
</template>
