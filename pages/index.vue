<template>
  <div>
    <div class="text-center">
      <IamLogo />
    </div>
    <h1 class="text-center">Empower your trades, conquer the market.</h1>
    <div class="text-center">
      <p>
	Precision data, powerful strategies. Fuel your crypto success.
      </p>
      <div class="more-buttons">
        <NxButton
          class="learn-more-button"
          theme="warning"
          size="large"
          @click="navigateTo('/orderbook')"
          >Orderbook</NxButton
        >
        <NxButton theme="primary" size="large" @click="navigateTo('/markets')"
          >Markets</NxButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Home Page - Nuxt IAM Sample app",
});
</script>

<style scoped>
.text-center {
  text-align: center;
}

.more-buttons {
  display: flex;
  justify-content: center;
}

.learn-more-button {
  margin-right: 1rem;
}
</style>
