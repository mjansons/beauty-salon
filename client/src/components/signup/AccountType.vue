<script lang="ts" setup>
import { ref } from 'vue'

const isSpecialistAccount = ref(true)
const emit = defineEmits(['isSpecialistAccount', 'nextStep', 'previousStep'])

const emitValues = () => {
  emit('isSpecialistAccount', isSpecialistAccount.value)
  emit('nextStep')
}

const emitPreviousStep = () => {
  emit('previousStep')
}
</script>

<template>
  <div class="background">
    <div class="modal-wrapper">
      <div class="back-button-wrapper">
        <div class="back-button" @click="emitPreviousStep">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#3604C4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.6536 16.4928C11.3814 16.8051 10.9076 16.8375 10.5954 16.5653L6.00715 12.5653C5.84377 12.4229 5.75 12.2167 5.75 12C5.75 11.7832 5.84377 11.5771 6.00715 11.4347L10.5954 7.43466C10.9076 7.16247 11.3814 7.19491 11.6536 7.50714C11.9258 7.81936 11.8933 8.29312 11.5811 8.56532L8.50161 11.25L17.5 11.25C17.9142 11.25 18.25 11.5858 18.25 12C18.25 12.4142 17.9142 12.75 17.5 12.75L8.50161 12.75L11.5811 15.4347C11.8933 15.7069 11.9258 16.1806 11.6536 16.4928Z"
              fill="#6C38FF"
            />
          </svg>

          <p>Back</p>
        </div>
      </div>
      <h1>Choose an account type</h1>
      <p class="disclaimer">
        By signing up you agree to Winks’ Privacy Policy & Terms of Service
      </p>
      <div class="specialist-business-container">
        <div
          class="specialist type-button"
          :class="{ selected: isSpecialistAccount }"
          @click="isSpecialistAccount = true"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M34 43.5H14C5.18 43.5 2.5 40.82 2.5 32V16C2.5 7.18 5.18 4.5 14 4.5H34C42.82 4.5 45.5 7.18 45.5 16V32C45.5 40.82 42.82 43.5 34 43.5ZM14 7.5C6.84 7.5 5.5 8.86 5.5 16V32C5.5 39.14 6.84 40.5 14 40.5H34C41.16 40.5 42.5 39.14 42.5 32V16C42.5 8.86 41.16 7.5 34 7.5H14Z"
              fill="#6B6A99"
            />
            <path
              d="M38 17.5H28C27.18 17.5 26.5 16.82 26.5 16C26.5 15.18 27.18 14.5 28 14.5H38C38.82 14.5 39.5 15.18 39.5 16C39.5 16.82 38.82 17.5 38 17.5Z"
              fill="#6B6A99"
            />
            <path
              d="M38 25.5H30C29.18 25.5 28.5 24.82 28.5 24C28.5 23.18 29.18 22.5 30 22.5H38C38.82 22.5 39.5 23.18 39.5 24C39.5 24.82 38.82 25.5 38 25.5Z"
              fill="#6B6A99"
            />
            <path
              d="M38 33.5H34C33.18 33.5 32.5 32.82 32.5 32C32.5 31.18 33.18 30.5 34 30.5H38C38.82 30.5 39.5 31.18 39.5 32C39.5 32.82 38.82 33.5 38 33.5Z"
              fill="#6B6A99"
            />
            <path
              d="M17.0009 24.08C14.1809 24.08 11.8809 21.78 11.8809 18.96C11.8809 16.14 14.1809 13.84 17.0009 13.84C19.8209 13.84 22.1209 16.14 22.1209 18.96C22.1209 21.78 19.8209 24.08 17.0009 24.08ZM17.0009 16.84C15.8409 16.84 14.8809 17.8 14.8809 18.96C14.8809 20.12 15.8409 21.08 17.0009 21.08C18.1609 21.08 19.1209 20.12 19.1209 18.96C19.1209 17.8 18.1609 16.84 17.0009 16.84Z"
              fill="#6B6A99"
            />
            <path
              d="M23.9998 34.16C23.2398 34.16 22.5798 33.58 22.4998 32.8C22.2798 30.64 20.5398 28.9 18.3598 28.7C17.4398 28.62 16.5198 28.62 15.5998 28.7C13.4198 28.9 11.6798 30.62 11.4598 32.8C11.3798 33.62 10.6398 34.24 9.81981 34.14C8.99981 34.06 8.39981 33.32 8.47981 32.5C8.83981 28.9 11.6998 26.04 15.3198 25.72C16.4198 25.62 17.5398 25.62 18.6398 25.72C22.2398 26.06 25.1198 28.92 25.4798 32.5C25.5598 33.32 24.9598 34.06 24.1398 34.14C24.0998 34.16 24.0398 34.16 23.9998 34.16Z"
              fill="#6B6A99"
            />
          </svg>

          <p>Specialist</p>
        </div>
        <div
          class="business type-button"
          :class="{ selected: !isSpecialistAccount }"
          @click="isSpecialistAccount = false"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.7501 34.1249H6.12008C3.76508 34.1249 1.83008 32.2349 1.83008 29.8949V7.63492C1.83008 5.33992 2.68508 3.55491 4.24508 2.57991C5.82008 1.58991 7.86008 1.61991 9.97508 2.66991L16.6351 5.93991C18.4501 6.83992 19.8751 9.10492 19.8751 11.1149V32.9999C19.8751 33.6149 19.3651 34.1249 18.7501 34.1249ZM6.84008 4.12491C6.31508 4.12491 5.83508 4.24491 5.43008 4.49991C4.56008 5.03991 4.08008 6.16492 4.08008 7.63492V29.8949C4.08008 30.9899 4.99508 31.8749 6.12008 31.8749H17.6251V11.1149C17.6251 9.95992 16.6951 8.47492 15.6301 7.96492L8.97008 4.69492C8.20508 4.31992 7.48508 4.12491 6.84008 4.12491Z"
              fill="#6B6A99"
            />
            <path
              d="M28.215 34.125H18.75C18.135 34.125 17.625 33.615 17.625 33V15.63C17.625 15.285 17.775 14.97 18.045 14.76C18.315 14.55 18.645 14.46 18.99 14.535L19.695 14.685L29.505 16.875C32.49 17.535 33.99 19.29 34.08 22.275C34.095 22.275 34.095 22.425 34.095 22.59V28.26C34.08 32.1 32.055 34.125 28.215 34.125ZM19.875 31.875H28.215C30.855 31.875 31.83 30.9 31.83 28.26V22.47C31.755 20.415 30.975 19.5 29.01 19.065L19.875 17.025V31.875Z"
              fill="#6B6A99"
            />
            <path
              d="M13.455 14.625H8.25C7.635 14.625 7.125 14.115 7.125 13.5C7.125 12.885 7.635 12.375 8.25 12.375H13.455C14.07 12.375 14.58 12.885 14.58 13.5C14.58 14.115 14.085 14.625 13.455 14.625Z"
              fill="#6B6A99"
            />
            <path
              d="M13.455 20.625H8.25C7.635 20.625 7.125 20.115 7.125 19.5C7.125 18.885 7.635 18.375 8.25 18.375H13.455C14.07 18.375 14.58 18.885 14.58 19.5C14.58 20.115 14.085 20.625 13.455 20.625Z"
              fill="#6B6A99"
            />
            <path
              d="M22.8301 26.625C20.3551 26.625 18.3301 24.6 18.3301 22.125V15.78C18.3301 15.435 18.4801 15.12 18.7501 14.895C19.0201 14.67 19.3651 14.595 19.6951 14.67L26.4451 16.185C26.9551 16.305 27.3301 16.755 27.3301 17.28V22.11C27.3301 24.6 25.3201 26.625 22.8301 26.625ZM20.5801 17.19V22.125C20.5801 23.37 21.5851 24.375 22.8301 24.375C24.0751 24.375 25.0801 23.37 25.0801 22.125V18.195L20.5801 17.19Z"
              fill="#6B6A99"
            />
            <path
              d="M29.5801 26.625C27.1051 26.625 25.0801 24.6 25.0801 22.125V17.295C25.0801 16.95 25.2301 16.635 25.5001 16.425C25.7701 16.215 26.1151 16.125 26.4451 16.2L29.4901 16.875C32.4751 17.535 33.9751 19.29 34.0651 22.275C34.0651 22.305 34.0651 22.335 34.0651 22.365C33.9451 24.75 31.9801 26.625 29.5801 26.625ZM27.3301 18.69V22.125C27.3301 23.37 28.3351 24.375 29.5801 24.375C30.7651 24.375 31.7401 23.4599 31.8151 22.2899C31.7401 20.3999 30.9601 19.5 29.0101 19.065L27.3301 18.69Z"
              fill="#6B6A99"
            />
          </svg>

          <p>Business</p>
        </div>
      </div>

      <div class="button-wrapper">
        <button type="button" @click="emitValues" class="btn-primary">
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-family: Calistoga, sans-serif;
  margin-bottom: 16px;
}
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--gray);
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  overflow: auto;
}

.modal-wrapper {
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  background-color: var(--white);
  width: 550px;
}

.specialist-business-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 16px;
  border-radius: 16px;

  & svg {
    width: 36px;
    height: 36px;
    margin-bottom: 24px;
  }
}

div.selected {
  border: 1px solid var(--purple-500);
  border-radius: 16px;

  & path {
    fill: var(--purple-500);
  }

  & p {
    color: var(--purple-500);
  }
}

.type-button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 1 0;
  border: 1px solid transparent;
  font-size: var(--medium);
  padding: 24px;
  background-color: var(--gray);
  border-radius: 16px;
}

.type-button:hover {
  background-color: var(--purple-100);
}

.button-wrapper {
  width: 100%;
}

.back-button-wrapper {
  display: flex;
  justify-content: flex-start;
}

.btn-primary {
  margin-top: 32px;
  padding-left: 40px;
  padding-right: 40px;
  margin-left: auto;
}

.disclaimer {
  font-size: var(--small);
  color: var(--gray-500);
  display: flex;
  justify-content: flex-start;
  margin-bottom: 32px;
  text-align: left;
}
</style>
