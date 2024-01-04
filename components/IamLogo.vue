<template>
  <img style="border-radius:100%" src="/img/tmlogo.jpg" width="200px" />
</template>

<style scoped>
img {
  animation: spin 20s linear infinite; /* Creates a 5-second spinning animation */
}

@keyframes spin {
  0% { transform: rotate(0deg) scale(1) }
  50% { transform: rotate(180deg) scale(1.1) }
  100% { transform: rotate(360deg) scale(1) }
}
</style>
