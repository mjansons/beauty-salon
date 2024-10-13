<script setup lang="ts"></script>

<template>
  <div class="main-wrapper">
    <h1>How it works</h1>
    <div class="info-box-wrapper">
      <div class="info-box">
        <img src="../assets/images/search.svg" alt="search icon" />
        <div class="box-texts">
          <h3>Select Your Service & Time</h3>
          <p>
            Choose the beauty or wellness service you need and the time that
            works best for you—whether it’s today, next month, or within a
            specific time frame.
          </p>
        </div>
      </div>
      <div class="info-box">
        <img src="../assets/images/personalcard.svg" alt="search icon" />
        <div class="box-texts">
          <h3>View Available Salons & Prices</h3>
          <p>
            Instantly see a list of salons that match your selected times,
            complete with pricing for each service.
          </p>
        </div>
      </div>
      <div class="info-box">
        <img src="../assets/images/calendar-tick.svg" alt="search icon" />
        <div class="box-texts">
          <h3>Book with Ease</h3>
          <p>
            Pick your preferred salon and time, and confirm your booking with a
            tap. You're all set!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-wrapper {
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  padding: 64px;
}

h1 {
  font-family: Calistoga, sans-serif;
  font-size: var(--extra-extra-large);
  text-align: center;
}

.info-box-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 48px;
}

.info-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  max-width: 300px;
}

.box-texts {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  margin: 0px;
}

h3 {
  font-family: Calistoga, sans-serif;
  font-size: var(--large);
  text-align: center;
  margin: 0;
}

p {
  font-size: var(--small);
  text-align: center;
  font-weight: 300;
}
</style>
