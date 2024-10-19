<script setup lang="ts">
import HeaderAuth from '@/components/headers/HeaderAuth.vue'
import SpecialistSearch from '@/components/booking/SpecialistSearch.vue'
import FooterElement from '@/components/FooterElement.vue'
import { ref } from 'vue'

const searchClicked = ref(false)
</script>

<template>
  <div class="main">
    <HeaderAuth></HeaderAuth>
    <div v-if="!searchClicked">
      <div>
        <h1>Welcome back, nice to see you again!</h1>
        <p>
          Feel free to browse available appointments and browse competition.
        </p>
      </div>
    </div>
    <SpecialistSearch
      @response="(msg) => (searchClicked = msg)"
    ></SpecialistSearch>
    <FooterElement></FooterElement>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  justify-content: flex-start;
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

</style>
