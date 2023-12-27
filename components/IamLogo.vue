<template>
  <img style="border-radius:100%" src="~~/iam/ui/img/tmlogo.jpg/" width="200px" />
</template>

<style>
img {
  animation: spin 20s linear infinite; /* Creates a 5-second spinning animation */
}

@keyframes spin {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
</style>
