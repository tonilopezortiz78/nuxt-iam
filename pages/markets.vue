<template>
  <MexcPromotion/>
  <div style="text-align:center ">
    <h2>last 24h since: {{ today }}</h2>
  </div>
    <div style="text-align:center">
      <input style="color:burlywood; font-size: 25px; background-color: black;" type="text" v-model="searchQuery" placeholder="Search symbols or names">
      <table >
        <thead>
          <tr>
            <th @click="sortBy('market_cap_rank')" class="sortable-header">rank</th>
            <th>logo</th>
            <th @click="sortByName('symbol')" class="sortable-header">symbol</th>
            <th @click="sortByName('name')" class="sortable-header">name</th>
            <th>price</th>
            <th @click="sortBy('price_change_percentage_24h')" class="sortable-header">%</th>
            <th @click="sortBy('total_volume')" class="sortable-header">volume</th>
            <th @click="sortBy('market_cap')" class="sortable-header">market cap</th>
            <th @click="sortBy('volMarketcap')" class="sortable-header">vol/cap</th>
            <th @click="sortBy('ath')" class="sortable-header">ath</th>
            <th @click="sortBy('ath_change_percentage')" class="sortable-header">ath%</th>
            <th @click="sortBy('circulating_supply')" class="sortable-header">circulating supply</th>
            <th @click="sortBy('total_supply')" class="sortable-header">total supply</th>
            <th @click="sortBy('max_supply')" class="sortable-header">max supply</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="symbol in filteredTickerData" :key="filteredTickerData.market_cap_rank" :style="{color: symbol.price_change_percentage_24h > 0 ? 'green' : 'red'}">
            <td>{{symbol.market_cap_rank}}</td>
            <td><img :src='symbol.image'/></td>
            <td>{{symbol.symbol}}</td>
            <td>{{symbol.name}}</td>
            <td>{{symbol.current_price}}</td>
            <td>{{numeral(symbol.price_change_percentage_24h).format("0.0a")+"%"}}</td>
            <td>{{numeral(symbol.total_volume).format("0a")}}</td>
            <td>{{numeral(symbol.market_cap).format("0a")}}</td>
            <td>{{numeral(symbol.volMarketcap).format("0a")+"%"}} </td>
            <td>{{numeral(symbol.ath).format("0.0a")}} </td>
            <td>{{numeral(symbol.ath_change_percentage).format("0a")+"%"}} </td>
            <td>{{numeral(symbol.circulating_supply).format("0a")}}</td>
            <td>{{numeral(symbol.total_supply).format("0a")}}</td>
            <td>{{numeral(symbol.max_supply).format("0a")}}</td>
          </tr>

        </tbody>
      </table>
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
  let searchQuery = ref('');
  let filteredTickerData = ref({});
  let color=ref('white')

  const marketsurl='https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=1h%2c24h%2c7d&locale=en'
  
  async function fetchmarket() {
    const response = await fetch(marketsurl);
    const data = await response.json();

    // extract the symbols from the response data
    //const symbols = data.symbols.map((symbol) => symbol.symbol.towercase());
    getVolMarketcap(data)
    return data;
  }

  const fetchcoindetails = async (coinid) => {
  const coinresponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coinid}`);
  const coindata = await coinresponse.json();
  return coindata;

  }
  tickerData.value= await fetchmarket();
  filteredTickerData.value=tickerData.value;

/*
  function Search(searchQuery){
    filteredTickerData.value=tickerData.value.filter
    (symbol => 
    symbol.name.toLowerCase().includes(searchQuery.toLowerCase()) || symbol.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
  }
*/

  function Search(searchQuery) {
  // Split the search query into an array of individual coin names/symbols
  const searchTerms = searchQuery.toLowerCase().split(',');

  filteredTickerData.value = tickerData.value.filter(symbol => {
    // Check if any of the search terms match either name or symbol
    return searchTerms.some(term =>
      symbol.name.toLowerCase().includes(term) ||
      symbol.symbol.toLowerCase().includes(term)
    );
  });
}

  function sortBy(property){
    filteredTickerData.value.property=property;
    filteredTickerData.value.direction=filteredTickerData.value.direction==='asc'? 'desc':'asc';
    filteredTickerData.value.sort((a,b)=>{
      if(filteredTickerData.value.direction==='asc'){
        return a[property]-b[property]
      }else{
        return b[property]-a[property]
      }
    });
  };
  function sortByName(property){
    filteredTickerData.value.property=property;
    filteredTickerData.value.direction=filteredTickerData.value.direction==='asc'? 'desc':'asc';
    filteredTickerData.value.sort((a,b)=>{
      if(filteredTickerData.value.direction==='asc'){
        return a[property].localeCompare(b[property])
      }else{
        return b[property].localeCompare(a[property])
      }
    });
  };

  function getVolMarketcap(symbols){
    for(const symbol of symbols){
      symbol.volMarketcap=symbol.total_volume/symbol.market_cap*100
    }


  }

  const nuxtApp = useNuxtApp();
  const today = nuxtApp.today;
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

watch(searchQuery, () => {
  Search(searchQuery.value);
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

.gainColor{
  color: v-bind(color);
}
</style>

