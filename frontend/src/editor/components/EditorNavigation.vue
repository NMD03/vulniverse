<script setup lang="ts">
interface NavigationItem {
  id: string;
  label: string;
}

defineProps<{
  modelValue: string;
  items: NavigationItem[];
}>();

defineEmits<{
  "update:modelValue": [
    value: string,
  ];
}>();
</script>

<template>
  <nav
    class="editor-navigation"
    aria-label="Editor sections"
  >
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      :class="{
        'editor-navigation__item--active':
          modelValue === item.id,
      }"
      @click="
        $emit(
          'update:modelValue',
          item.id,
        )
      "
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<style scoped>
.editor-navigation {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.editor-navigation button {
  padding: 0.75rem;
  text-align: left;
  background: transparent;
  border: 0;
  border-radius: 0.375rem;
  cursor: pointer;
}

.editor-navigation__item--active {
  font-weight: 600;
  background:
    var(--vulniverse-selected, #e9ecef);
}
</style>
