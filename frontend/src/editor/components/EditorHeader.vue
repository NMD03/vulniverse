<script setup lang="ts">
defineProps<{
  identifier: string | null;
  profile: string | null;
  isDraft: boolean;
  dirty: boolean;
  loading: boolean;
}>();

defineEmits<{
  reload: [];
}>();
</script>

<template>
  <header class="editor-header">
    <div>
      <p class="editor-header__product">
        Vulniverse
      </p>

      <h1>
        {{ identifier ?? "New vulnerability record" }}
      </h1>

      <div class="editor-header__metadata">
        <span v-if="profile">
          {{ profile }}
        </span>

        <span v-if="isDraft">
          Draft
        </span>

        <span v-if="dirty">
          Unsaved changes
        </span>
      </div>
    </div>

    <button
      type="button"
      :disabled="loading || !identifier"
      @click="$emit('reload')"
    >
      Reload
    </button>
  </header>
</template>

<style scoped>
.editor-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid
    var(--vulniverse-border, #ced4da);
}

.editor-header__product {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.editor-header h1 {
  margin: 0.25rem 0;
}

.editor-header__metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
</style>
