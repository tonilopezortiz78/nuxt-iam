<template>
  <div>
    <div class="text-center2">
      <IamLogo />
    </div>
    <h1 style="margin: 1px; text-shadow: 2px 2px 4px blue, 4px 4px 8px yellow;"  class="text-center2">Empower your trades</h1>
    <h1 style=" margin: 1px; text-shadow: 2px 2px 4px blue, 4px 4px 8px yellow;"  class="text-center2">Conquer the market</h1>
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
    </div>
      <div class="container">
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

.container{
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  align-items: center; /* Center elements horizontally */
  justify-content: center; /* Center elements vertically within the container */
}
.text-center {
  text-align: center;
  color:white;
}
.text-center2 {
  animation: zoom 1s ease-out; /* Creates a 5-second spinning animation */
  text-align: center;
  color:white;
}

h1:hover{
  transform:scale(1.2);
}
img:hover{
  transform:scale(1.2);

}
@keyframes zoom{
  0% { transform:  scale(1.3) }
  100% { transform: scale(1.1) }
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
