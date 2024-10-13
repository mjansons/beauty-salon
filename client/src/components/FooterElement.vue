<script setup lang="ts"></script>

<template>
  <footer>
    <div class="footer-top-content">
      <RouterLink :to="{ name: 'home' }" tabindex="-1">
      <img class="logo" alt="wink logo" src="../assets/images/wink.svg" />
    </RouterLink>
    <div class="footer-links">
      <p>Link One</p>
      <p>Link Two</p>
      <p>Link Three</p>
      <p>Link Four</p>
      <p>Link Five</p>
    </div>
    </div>

    <div class="footer-bottom-content">
      <p>2024 Wink. All right reserved.</p>
      <div class="bottom-right-content">
        <p>Privacy Policy</p>
        <p>Terms of Service</p>
        <p>Cookies Settings</p>
      </div>
    </div>

  </footer>
</template>

<style scoped>

  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--white);
    padding: 64px;
  }

  .footer-top-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;
  }

  .footer-links{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 32px;
    padding-bottom: 32px;
  }

  .footer-bottom-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    border-top: 1px solid var(--purple-900);
    padding-top: 32px;

    & p {
      font-family: Roboto, sans-serif;
      font-weight: 300;
      font-size: var(--small);
      text-align: center;
      margin-bottom: 24px;
    }
  }

  .bottom-right-content{
    display: flex;
    gap: 24px;
    flex-direction: row;
    justify-content: center;
    text-decoration: underline;
  }
</style>
