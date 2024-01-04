<template>
  <MexcPromotion/>
  <div style="text-align:center">
    <h1>FUTURES BINANCE LAST 24H</h1>
    <table >
      <thead>
        <tr>
          <th>rank</th>
          <th>logo</th>
          <th>symbol</th>
          <th>name</th>
          <th>price</th>
          <th @click="sortBy('price_change_percentage_24h')" class="sortable-header">%</th>
          <th @click="sortBy('total_volume')" class="sortable-header">volume</th>
          <th @click="sortBy('market_cap')" class="sortable-header">market cap</th>
          <th>vol/cap(%)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="symbol in tickerData" :key="tickerData.market_cap_rank">
          <td>{{symbol.market_cap_rank}}</td>
          <td><img :src='symbol.image'/></td>
          <td>{{symbol.symbol}}</td>
          <td>{{symbol.name}}</td>
          <td>{{symbol.current_price}}</td>
          <td>{{numeral(symbol.price_change_percentage_24h).format("0.0a")+"%"}}</td>
          <td>{{numeral(symbol.total_volume).format("0a")}}</td>
          <td>{{numeral(symbol.market_cap).format("0a")}}</td>
          <td>{{numeral(symbol.total_volume/symbol.market_cap*100).format("0a")+"%"}} </td>
        </tr>

      </tbody>
    </table>
    <!--
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
-->
</div>
</template>

<script setup>
import numeral from 'numeral';
//import DataTable from 'primevue/datatable';
//import Column from 'primevue/column';
//import ColumnGroup from 'primevue/columngroup';   // optional
//import Row from 'primevue/row';                   // optional

let tickerData = ref({});
tickerData.value.direction='asc'

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

function sortBy(property){
  tickerData.value.property=property;
  tickerData.value.direction=tickerData.value.direction==='asc'? 'desc':'asc';
  tickerData.value.sort((a,b)=>{
    if(tickerData.value.direction==='asc'){
      return a[property]-b[property]
    }else{
      return b[property]-a[property]
    }
  });
  console.log(tickerData.value.property, tickerData.value.direction,tickerData.value)
};
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


[ { "id": "bitcoin", "symbol": "btc", "name": "Bitcoin", "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400", "current_price": 45217, "market_cap": 885892237676, "market_cap_rank": 1, "fully_diluted_valuation": 949736898699, "total_volume": 29288523090, "high_24h": 45863, "low_24h": 44717, "price_change_24h": -628.8359879632771, "price_change_percentage_24h": -1.37163, "market_cap_change_24h": -11280147773.40149, "market_cap_change_percentage_24h": -1.2573, "circulating_supply": 19588306, "total_supply": 21000000, "max_supply": 21000000, "ath": 69045, "ath_change_percentage": -34.48655, "ath_date": "2021-11-10T14:24:11.849Z", "atl": 67.81, "atl_change_percentage": 66607.38826, "atl_date": "2013-07-06T00:00:00.000Z", "roi": null, "last_updated": "2024-01-03T09:01:27.472Z", "price_change_percentage_1h_in_currency": 0.3803638703581821, "price_change_percentage_24h_in_currency": -1.3716292845078197, "price_change_percentage_7d_in_currency": 5.841737518849793 }, { "id": "ethereum"
*/ 
useHead({
  title: "markets",
});
</script>

<style scoped>
/* Add styles for your logo if needed */
/* Add styles for your logo if needed */
th.sortable-header {
  cursor: pointer;
}
th.sortable-header:hover {
  transform:scale(1.1)

}
img {
  animation: spin 1s ease-out; /* Creates a 5-second spinning animation */
  width: 35px; /* Adjust the width as needed */
  height: auto;
}
img:hover{
  transform:scale(1.2);
  color:blanchedalmond;
  font-weight: bold;
  
}
@keyframes spin {
  0% { transform:  scale(1.3) }
  100% { transform: scale(1) }
}
table {
  border-collapse: collapse; /* Avoid double borders */
  margin: 0 auto;
  overflow-x:auto;
  margin-top:10px;
}

th, td {
  border:2px solid burlywood;
  padding: 3px;
}

</style>

