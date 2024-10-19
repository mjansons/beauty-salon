<script setup lang="ts">
import { ref } from 'vue'
import HeaderNotAuth from '@/components/headers/HeaderNotAuth.vue'
import SpecialistSearch from '@/components/booking/SpecialistSearch.vue'
import FooterElement from '@/components/FooterElement.vue'
import HowItWorks from '@/components/HowItWorks.vue'

const searchClicked = ref(false)
</script>

<template>
  <div class="main">
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
    <HowItWorks v-if="!searchClicked"></HowItWorks>
    <FooterElement></FooterElement>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
}

h1 {
  font-family: Calistoga, sans-serif;
  font-size: var(--extra-extra-large);
  text-align: center;
  margin-bottom: 8px;
  margin-top: 64px;
}

p {
  font-family: Roboto, sans-serif;
  font-weight: 300;
  font-size: var(--medium);
  text-align: center;
}

.main-text {
  margin: 0 64px;
}
</style>
