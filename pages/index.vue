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
        <NxButton theme="primary" size="large" @click="navigateTo('/Contribute')"
          >Contribute</NxButton
        >
      </div>
        <a href="https://www.youtube.com/channel/UCo20pDW308WBWmM0txFl-5w">Check our youtube channel for further information</a>
        <iframe width="400" height="315" src="https://www.youtube.com/embed/IzyG7F0OriU" title="Cómo Operar Futuros Criptomonedas Rápido y Fácil 🚀 en 10 minutos | Sin KYC, desde cualquier país 🌎" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
  </div>
</template>
<script setup>
useHead({
  title: "Home transcend money",
});
</script>

<style scoped>
.text-center {
  text-align: center;
  color:white;
}

.more-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.learn-more-button {
  margin-right: 1rem;
}
</style>
