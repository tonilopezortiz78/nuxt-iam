<template>
  <div style="color:white; text-align:center">
    <div class="text-center">
      <h1>Cryptocurrency Symbol Select</h1>
  
      <div class="text-white text-3xl" v-if="isLoading">
        <p>Loading symbols...</p>
      </div>
  
      <select v-model="selectedSymbol">
        <option v-for="option in symbols"
          :key="option"
          :value="option" >
          {{ option }} 
        </option>
      </select>
  
      <p>Selected symbol: {{ selectedSymbol }}</p>
  
      <button @click="connectWebSocket">Connect WebSocket</button>
    </div>

    <div class=" pt-6 text-gray-800 text-3xl text-bold text-center text-white">
          <h1>ORDERBOOK</h1> 
      </div>
      <div class=" text-gray-800 text-xl text-bold text-center text-white p-2">
          <h1>BITCOIN USDT BINANCE PERPETUAL FUTURES</h1>
          <h1> live orderbook, orders > {{filterQty}} btc</h1>
          <h1> orders: {{ aggOrderbook.summary.total }}</h1>
          <h1> total cancel/execute orders: {{ aggOrderbook.summary.deletes }}</h1>
          <label >Filter by qty(coin) >: </label>
          <input
          type="float"
          v-model="filterQty"
          />
      </div>
      <div>
          <!-- <BtcChart class="center"/> -->
      </div>
      <div id="tables-container" style="margin-top:30px;">
        <div id="asks-table"> 
          <h1 class="text-center">asks:</h1>
          <table  class="text-center mx-auto m-4">
          <thead>
              <tr>
                  <th>Lastupdate</th>
                  <th>Price</th>
                  <th>{{ selectedSymbol.slice(0,-4) }}</th>
                  <th>usdt</th>
                  <th>accBtc</th>
                  <th>accUsdt</th>
              </tr>
          </thead>
          <tbody v-for="(a,key) in aggOrderbook.a.data" :key="key">
              <tr v-if="parseFloat(a.qty)>filterQty">
                  <td>{{ new Date(a.lastUpdate*1).toLocaleString('es-ES') }}</td>
                  <td>{{ parseFloat(key)}}</td>
                  <td>{{ a.qty}}</td>
                  <td>{{ numeral(a.usdt).format("0.0a") }}</td>
                  <td>{{ numeral(a.accqty).format("0.0a")}}</td>
                  <td>{{ numeral(a.accusdt).format("0.0a") }}</td>
              </tr>
          </tbody>
          </table>
        </div>
        <div id="bids-table" >
          <h1 class="text-center">bids:</h1>
          <table class="text-center mx-auto m-4">
          <thead>
              <tr>
                  <th>Lastupdate</th>
                  <th>Price</th>
                  <th>{{ selectedSymbol.slice(0,-4) }}</th>
                  <th>usdt</th>
                  <th>accBtc</th>
                  <th>accUsdt</th>
              </tr>
          </thead>
          <tbody v-for="(a,key) in aggOrderbook.b.data" :key="key">
              <tr v-if="parseFloat(a.qty)>filterQty">
                  <td>{{ new Date(a.lastUpdate*1).toLocaleString('es-ES') }}</td>
                  <td>{{ parseFloat(key)}}</td>
                  <td>{{ a.qty}}</td>
                  <td>{{ numeral(a.usdt).format("0.0a") }}</td>
                  <td>{{ numeral(a.accqty).format("0.0a")}}</td>
                  <td>{{ numeral(a.accusdt).format("0.0a") }}</td>
              </tr>
          </tbody>
          </table>
        </div>
      </div>
  </div>
</template>

<script setup>
import numeral from 'numeral';

const selectedSymbol = ref('btcusdt');
const price = ref('0');
const quantity = ref('0');
const isLoading = ref(true);
const symbols = ref([]);
let webSocket=null;
const binanceInfo='https://fapi.binance.com/fapi/v1/exchangeInfo'
const now=new Date();
const startLocalTime=now.toLocaleDateString() + " " +now.toLocaleTimeString();

//const { data: symbols}=await useFetch(binanceInfo);
let orderbookTick=ref({});
let filterQty=ref(200.0);
connectWebSocket();

let aggOrderbook=ref({
  summary:{},
  a:{summary:{total:"",deletes:""},data:{}},
  b:{summary:{total:"",deletes:""},data:{}},
});
let deletes=0

async function fetchSymbols() {
  const response = await fetch(binanceInfo);
  const data = await response.json();

  // Extract the symbols from the response data
  const symbols = data.symbols.map((symbol) => symbol.symbol.toLowerCase());

  return symbols;
}

async function connectWebSocket() {
  isLoading.value = true;
  console.log("----", webSocket)
  if (webSocket) {
    await webSocket.close(); // wait for the WebSocket to close completely
    //console.log(webSocket)
    orderbookTick=ref({});
    aggOrderbook=ref({
    summary:{},
      a:{summary:{total:"",deletes:""},data:{}},
      b:{summary:{total:"",deletes:""},data:{}},
    });
    deletes=0
  }
   webSocket=new WebSocket(`wss://fstream.binance.com/stream?streams=${selectedSymbol.value}@depth@100ms`);

  //webSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedSymbol.value}@trade`);

  webSocket.onmessage = (event) => {
    isLoading.value = false;

    orderbookTick.value=JSON.parse(event.data);
    // Convert epoch time to human-readable with milliseconds
    const epochTimeMs = orderbookTick.value.data.E;
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 3 ,timeZoneName: 'short' };
    const humanReadableTime = new Date(epochTimeMs).toLocaleString('es-ES', options);

    // Display raw JSON data with human-readable time
    const times= `${humanReadableTime}\n\n`;
    //orderbookTick.value.a=orderbookTick.value.a.reverse();
    // Handle asks
    for (let ask of orderbookTick.value.data.a) {
        let price = parseFloat(ask[0]);
        let qty = parseFloat(ask[1]);
        aggOrderbook.value["a"]["data"][price]= {lastUpdate: orderbookTick.value.data.E,qty: qty, usdt: price*qty};
    }
    for (let ask of orderbookTick.value.data.b) {
        let price = parseFloat(ask[0]);
        let qty = parseFloat(ask[1]);
        aggOrderbook.value["b"]["data"][price]= {lastUpdate: orderbookTick.value.data.E,qty: qty, usdt: price*qty};
    }

    aggOrderbook.value["a"]["summary"]=Object.keys(aggOrderbook.value["a"]["data"]).length 
    aggOrderbook.value["b"]["summary"]=Object.keys(aggOrderbook.value["b"]["data"]).length 

    const total=aggOrderbook.value["a"]["summary"]+aggOrderbook.value["b"]["summary"]
    aggOrderbook.value.summary.total=total

    //console.log(aggOrderbook.value["a"])
    //console.log(aggOrderbook.value["b"])
    // Initialize variables
    let accQty = 0;
    let accUsdt = 0;
    for (const [price,askData] of Object.entries(aggOrderbook.value["a"]["data"])){
        if(askData.qty===0){
            delete aggOrderbook.value.a.data[price]
            deletes+=1
            aggOrderbook.value.summary.deletes=deletes
        }
        else{
            //acc qty
            accQty=accQty+askData.qty
            aggOrderbook.value.a.data[price].accqty=accQty
            accUsdt=accUsdt+askData.usdt
            aggOrderbook.value.a.data[price].accusdt=accUsdt
        }
    }
    accQty = 0;
    accUsdt = 0;
    for (const [price,askData] of Object.entries(aggOrderbook.value["b"]["data"])){
        if(askData.qty===0){
            delete aggOrderbook.value.b.data[price]
            deletes+=1
            aggOrderbook.value.summary.deletes=deletes
        }
        else{
            //acc qty
            accQty=accQty+askData.qty
            aggOrderbook.value.b.data[price].accqty=accQty
            accUsdt=accUsdt+askData.usdt
            aggOrderbook.value.b.data[price].accusdt=accUsdt
        }
    }
}
    };
  
    webSocket.onerror = (error) => {
      console.error(error);
    };
  
    webSocket.onclose = () => {
      console.log('onclose');
    };

  // Update the symbols when the page is mounted
  onMounted(async () => {
symbols.value = await fetchSymbols();
});

// Update the selected symbol when the select element changes
watch(selectedSymbol, () => {
  connectWebSocket();
});
</script>
<style scoped>
table {
  border-collapse: collapse; /* Avoid double borders */
}

th, td {
  padding: 3px;
  border: 1px solid #ddd;
}

#tables-container {
  display: flex; /* Side-by-side on larger screens */
  flex-wrap: wrap; /* Wrap tables if needed */
  align-items: flex-start;
  justify-content: space-evenly;
}

#bids-table {
  margin-left:30px;
  /* Other table styles */
}

</style>
