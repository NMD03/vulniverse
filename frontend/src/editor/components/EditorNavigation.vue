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
    class="nav nav-pills flex-column editor-sidebar"
    aria-label="Editor sections"
  >
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="nav-link text-start"
      :class="{
        active: modelValue === item.id,
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
