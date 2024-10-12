<script setup lang="ts">
import { ref } from 'vue'
import HeaderNotAuth from '@/components/headers/HeaderNotAuth.vue'
import SpecialistSearch from '@/components/booking/SpecialistSearch.vue'

const searchClicked = ref(false)
</script>

<template>
  <HeaderNotAuth></HeaderNotAuth>
  <div v-if="!searchClicked">
    <div class="main-text">
      <h1>Book your next beauty appointment in a Wink</h1>
      <p>
        No calls—just a few taps. Browse available appointments, view real-time
        pricing, and choose a time that suits you.
      </p>
    </div>
  </div>
  <SpecialistSearch
    @response="(msg) => (searchClicked = msg)"
  ></SpecialistSearch>
</template>

<style scoped>
h1 {
  font-family: Calistoga, sans-serif;
  font-size: var(--extra-extra-large);
  text-align: center;
  margin-bottom: 8px;
}

p {
  font-family: Roboto, sans-serif;
  font-weight: 300;
  font-size: var(--medium);
  text-align: center;
  margin-bottom: 32px;
}

.main-text {
  margin: 0 64px;
}
</style>
