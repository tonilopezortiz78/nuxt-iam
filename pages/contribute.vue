<template>
    <div>
        <div style="text-align:center">

            <h2 style="color:burlywood">Gracias por tu valiosa contribución financiera. Todas las aportaciones serán tenidas en cuenta en nuestro próximo airdrop de tokens.</h2>
            <h3>Thanks for your generous financial contribution. We will take into consideration all contributions in the upcoming token airdrop.</h3>
        </div>

        <wallet v-for="(wallet, index) in wallets" :key="index" :coin="wallet.coin" :color="wallet.color" :standard="wallet.standard" :wallet="wallet.address" :qr="wallet.qr" :alt="wallet.coin" />
    </div>
</template>

<script setup>
import BitcoinInfo from '~/components/wallet.vue';

    const wallets=[
        {
            coin:"BITCOIN",
            network:"BITCOIN",
            standard:"BITCOIN",
            address:"15NEUwYNAVahrAJeTz2GnmmAptrku2gLds",
            qr:"/img/BTC.png",
            color:"orange"
        },
        {
            coin:"USDT",
            network:"TRON",
            standard:"TRC20",
            address:"TSpYwM3dJZ7bH54u4BWBmrxQanttt2wVeM",
            qr:"/img/USDT_TRC20.png",
            color:"green"
        },
        {
            coin:"USDT",
            network:"BINANACE SMART CHAIN",
            standard:"BEP20(BSC)",
            address:"0xb1047c198a31e92304b375f9d7e6f7d596c22d1e",
            qr:"/img/USDT_BEP20(BSC).png",
            color:"green"
        },
        {
            coin:"USDT",
            network:"ETHEREUM",
            standard:"ERC20",
            address:"0xb1047c198a31e92304b375f9d7e6f7d596c22d1e",
            qr:"/img/USDT_ERC20.png",
            color:"green"
        },
        {
            coin:"USDT",
            network:"POLYGON",
            standard:"POLYGON",
            address:"0xb1047c198a31e92304b375f9d7e6f7d596c22d1e",
            qr:"/img/USDT_POLYGON.png",
            color:"green"
        },
    ]
</script>

