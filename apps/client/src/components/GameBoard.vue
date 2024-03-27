<template>
  <div class="grid grid-cols-12">
    <div v-for="place in places" class="col-span-3">
      {{ place }}
    </div>
  </div>
</template>

<script setup lang="ts">
const places = ['black', 'green', 'red']
</script>

<style scoped></style>
