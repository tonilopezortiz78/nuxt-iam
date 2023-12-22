<template>
  <div>
    <DataTable :value="tickerData" sortField="q" :sortOrder="-1"  filterDisplay="Row" stripedRows tableStyle="min-width: 50rem" scrollable scrollHeight="500px" :loading="loading"  :globalFilterFields="['symbol','id']">
        <template #header>
        <MexcPromotion/>
          <div class="flex flex-wrap align-items-center justify-content-between gap-1 mt-3">
              <span class="text-xl text-900 font-bold underline text-white">SPOT MARKETS LAST 24H (usd)</span>
          </div>
        </template>
        <Column field="market_cap_rank" header="rank" sortable ></Column>
        <Column header="Image">
          <template #body="slotProps">
              <img :src="slotProps.data.image" :alt="slotProps.data.image" class="shadow-2 border-round" style="width: 33px" />
          </template>
        </Column>
        <Column field="symbol" header="symbol" sortable ></Column>
        <Column field="id" header="name" sortable ></Column>
        <Column field="current_price" header="price" sortable>
          <template #body="slotProps">
            <span>{{ slotProps.data.current_price? numeral(slotProps.data.current_price).format("0.000a") : '' }}</span>
          </template>
        </Column>

        <Column field="price_change_percentage_24h" header="%" sortable>
          <template #body="slotProps">
            <span>{{ numeral(slotProps.data.price_change_percentage_24h/100).format("0.00%") }}</span>
          </template>
        </Column>
        <Column field="total_volume" header="volume(usd)" sortable>
            <template #body="slotProps">
              <span>{{ slotProps.data.total_volume ? numeral(slotProps.data.total_volume).format("0.0a") : '' }}</span>
            </template>
        </Column>
        <Column field="market_cap" header="market_cap(usd)" sortable>
            <template #body="slotProps">
              <span>{{ slotProps.data.market_cap ? numeral(slotProps.data.market_cap).format("0.0a") : '' }}</span>
            </template>
        </Column>
  </DataTable>
</div>
</template>

<script setup>
import numeral from 'numeral';
//import DataTable from 'primevue/datatable';
//import Column from 'primevue/column';
//import ColumnGroup from 'primevue/columngroup';   // optional
//import Row from 'primevue/row';                   // optional

let tickerData = ref({});
const marketsUrl='https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=1h%2C24h%2C7d&locale=en'

async function fetchMarket() {
  const response = await fetch(marketsUrl);
  const data = await response.json();

  // Extract the symbols from the response data
  //const symbols = data.symbols.map((symbol) => symbol.symbol.toLowerCase());

  return data;
}

const fetchCoinDetails = async (coinId) => {
const coinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
const coinData = await coinResponse.json();
console.log(coinData)
return coinData;

}
tickerData.value= await fetchMarket();
/*
for (const coin of tickerData.value) {
  await new Promise(resolve => setTimeout(resolve, 3000)); // Introduce a 1-second delay
  let data=await fetchCoinDetails(coin.id);
}
*/

/*
// Establish WebSocket connection
const ws = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');

// Listen for incoming messages
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  tickerData.value = data;
};

// Handle WebSocket errors
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
*/
/*
 "e": "24hrTicker",  // Event type
    "E": 123456789,     // Event time
    "s": "BTCUSDT",     // Symbol
    "p": "0.0015",      // Price change
    "P": "250.00",      // Price change percent
    "w": "0.0018",      // Weighted average price
    "c": "0.0025",      // Last price
    "Q": "10",          // Last quantity
    "o": "0.0010",      // Open price
    "h": "0.0025",      // High price
    "l": "0.0010",      // Low price
    "v": "10000",       // Total traded base asset volume
    "q": "18",          // Total traded quote asset volume
    "O": 0,             // Statistics open time
    "C": 86400000,      // Statistics close time
    "F": 0,             // First trade ID
    "L": 18150,         // Last trade Id
    "n": 18151          // Total number of trades
*/ 
useHead({
  title: "markets",
});
</script>

<style scoped>
/* Add styles for your logo if needed */
img {
width: 300px; /* Adjust the width as needed */
height: auto;
}
</style>
