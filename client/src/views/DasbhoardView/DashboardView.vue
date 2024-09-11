<script setup lang="ts">
import HeaderAuth from '@/components/headers/HeaderAuth.vue';
import { isOnboarded } from '@/stores/user';

</script>

<template>
  <HeaderAuth></HeaderAuth>
  <h1>Authorised Landing Page</h1>
  {{ isOnboarded }}
</template>

<style scoped></style>
