<script setup>
/**
 * This is web application consuming Counter Api
 * for Siemens Energy Working Student Job Application of Deniz Mert Tecimer.
 * By clicking on the increment button, you can increment
 * the current value on the api. If the value is chanced by someone else,
 * it will update automatically for you, too.
 */
import CounterView from "./components/CounterView.vue";
</script>

<template>
  <main>
    <div class="center-screen">
      <div id="container" class="card">
        <img
          alt="Vue logo"
          class="logo"
          src="./assets/Siemens-energy-logo.png"
          height="150"
        />
        <div class="divider"></div>
        <CounterView />
      </div>
    </div>
  </main>
</template>

<style scoped>
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-right: 20px;
  padding-left: 20px;
}
.card {
  padding: 12px;
  padding-top: 8px;
  box-shadow: 0 3px 10px rgb(0 153 153 / 0.6);
  border-radius: 8px;
}
.divider {
  height: 1px;
  border-bottom: 1px solid #bababa;
  margin-left: 16px;
  margin-right: 16px;
}
.container {
  width: fit-content;
  margin: auto;
}

.center-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
}
</style>
