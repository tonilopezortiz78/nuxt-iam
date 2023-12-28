<template>
  <div style="color:white; text-align:center">
    <h1>LIVE ORDERBOOK BINANCE PERPETUAL FUTURES</h1> 
    <div v-if="isLoading"> 
      <p>Loading symbols...</p>
    </div>
    <div id="selector-container">
      <div>
        <label style="margin:10px; text-align: center;">Selected symbol: {{ selectedSymbol }}</label>
        <select style="margin:10px;  text-align:center; font-size:1.3rem; " v-model="selectedSymbol">
          <option v-for="option in symbols"
            :key="option"
            :value="option" >
            {{ option }} 
          </option>
        </select>
      </div>
    
      <button style="display:none" @click="connectWebSocket">Load symbol</button>

      <div >
          <label style="margin:10px">Filter by qty(coin) >: </label>
          <input style="margin:10px; width:150px; text-align:center; font-size:1.3rem"
          type="float"
          v-model="filterQty"
          />
      </div>
    </div>
      <div id="overview-table-container"> 
        <h1 style="margin:0; color:burlywood">Overview:</h1>
        <table id="overview-table">
        <thead>
            <tr>
                <th>Side</th>
                <th>Update</th>
                <th>Cancel or execute</th>
                <th>deletes/updates %</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Asks:</td>
                <td>{{ aggOrderbook.a.summary.updates}}</td>
                <td>{{ aggOrderbook.a.summary.deletes}}</td>
                <td>{{numeral(aggOrderbook.a.summary.deletes/aggOrderbook.a.summary.updates*100).format("0")}}</td>
            </tr>
            <tr>
                <td>Bids:</td>
                <td>{{ aggOrderbook.b.summary.updates}}</td>
                <td>{{ aggOrderbook.b.summary.deletes}}</td>
                <td>{{numeral(aggOrderbook.b.summary.deletes/aggOrderbook.b.summary.updates*100).format("0")}}</td>
            </tr>
            <tr style="font-weight: bold; font-size=1rem">
                <td>Total:</td>
                <td>{{ aggOrderbook.summary.updates}}</td>
                <td>{{ aggOrderbook.summary.deletes }}</td>
                <td>{{numeral(aggOrderbook.summary.deletes/aggOrderbook.summary.updates*100).format("0")}}</td>
            </tr>
        </tbody>
        </table>
      </div>
      <div id="tables-container" style="margin-top:30px;">
        <div id="asks-table-container"> 
          <h1 style="margin:0; color:red">Asks:</h1>
          <table id="asks-table">
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
                  <td>{{key}}</td>
                  <td>{{ numeral(a.qty).format("0.0a") }}</td>
                  <td>{{ numeral(a.usdt).format("0.0a") }}</td>
                  <td>{{ numeral(a.accqty).format("0.0a")}}</td>
                  <td>{{ numeral(a.accusdt).format("0.0a") }}</td>
              </tr>
          </tbody>
          </table>
        </div>
        <div id="bids-table-container" >
          <h1 style="margin:0; color:green">Bids:</h1>
          <table id="bids-table">
          <thead >
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
                  <td>{{ key}}</td>
                  <td>{{ numeral(a.qty).format("0.0a") }}</td>
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
let deletes_a=0
let deletes_b=0

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
      a:{summary:{updates:"",deletes:""},data:{}},
      b:{summary:{updates:"",deletes:""},data:{}},
    });
    deletes_a=0;
    deletes_b=0;
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

    aggOrderbook.value.a.summary.updates=Object.keys(aggOrderbook.value["a"]["data"]).length 
    aggOrderbook.value.b.summary.updates=Object.keys(aggOrderbook.value["b"]["data"]).length 

    const total=aggOrderbook.value.a.summary.updates+aggOrderbook.value.b.summary.updates
    aggOrderbook.value.summary.updates=total

    //console.log(aggOrderbook.value["a"])
    //console.log(aggOrderbook.value["b"])
    // Initialize variables
    let accQty = 0;
    let accUsdt = 0;
    for (const [price,askData] of Object.entries(aggOrderbook.value["a"]["data"])){
        if(askData.qty===0){
            delete aggOrderbook.value.a.data[price]
            deletes_a+=1
            aggOrderbook.value.a.summary.deletes=deletes_a;
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
            deletes_b+=1
            aggOrderbook.value.b.summary.deletes=deletes_b
        }
        else{
            //acc qty
            accQty=accQty+askData.qty
            aggOrderbook.value.b.data[price].accqty=accQty
            accUsdt=accUsdt+askData.usdt
            aggOrderbook.value.b.data[price].accusdt=accUsdt
        }
    }
    aggOrderbook.value.summary.deletes=aggOrderbook.value.a.summary.deletes+aggOrderbook.value.b.summary.deletes
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
}

#tables-container {
  display: flex; /* Side-by-side on larger screens */
  flex-wrap: wrap; /* Wrap tables if needed */
  align-items: flex-start;
  justify-content: space-evenly;
  text-align: center;
}
#selector-container{
  display: flex; /* Side-by-side on larger screens */
  flex-wrap: wrap; /* Wrap tables if needed */
  justify-content: space-evenly;
  text-align: center;
}

#asks-table-container,#bids-table-container{
  margin:10px;
}

#overview-table-container{
  margin:10px
}

#bids-table{
  margin:1px;
  /* Other table styles */
}
#asks-table{
  margin:1px;
}
#overview-table{
  margin:0 auto;
}

#asks-table th, #asks-table td{
  border:1px solid red;
 
}

#bids-table th, #bids-table td {
  border:1px solid green;
}
#overview-table th, #overview-table td {
  border:1px solid burlywood;
}
/*
tr:nth-child(even){
  background-color: blue;
}
tr:nth-child(odd){
  background-color: gray;
}
*/

</style>
