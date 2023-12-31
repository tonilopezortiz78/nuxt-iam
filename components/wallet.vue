<template>
    <div style="border: 1px dashed burlywood; margin: 10px; padding: 10px; text-align: center;">
      <div >
        <span class="hover:text-7xl text-center text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-100">
          {{ coin }} - {{ standard }}
        </span>
        <p class="text-center align-text-bottom text-bold">{{ standard }} NETWORK: {{ wallet }}</p>
      </div>
      <img :src="qrCodeSrc" :alt="qrCodeAlt" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6" />
    </div>
  </template>
  
  <script setup>
  const props = defineProps(['coin', 'color', 'standard', 'qr', 'wallet', 'alt']);
  const qrCodeSrc = props.qr; // Assuming qr is the prop for the image source
  const qrCodeAlt = props.alt; // Assuming alt is the prop for the image alt text

  </script>
  
  <style scoped>
  img {
    animation: spin 6s linear infinite; /* Creates a 5-second spinning animation */
  }
  
  @keyframes spin {
    0% { transform: scale(0.95) }
    50% { transform: scale(1) }
    100% { transform: scale(0.95) }
  }
  </style>