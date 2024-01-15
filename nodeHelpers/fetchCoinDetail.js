const axios = require('axios');
const fs = require('fs');

const marketsApiUrl='https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=1h%2c24h%2c7d&locale=en'
// API endpoints for Bitcoin and Ethereum
//const coinApiUrl=`https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`;
let coins=['']
// Function to fetch data from a given API
async function fetchData(apiUrl) {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${apiUrl}:`, error.message);
    throw error;
  }
}

async function fetchCoins(marketsApiUrl) {
    try {
      const response = await axios.get(marketsApiUrl);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${apiUrl}:`, error.message);
      throw error;
    }
  }

// Function to save data to a JSON file
function saveDataToFile(data) {
  try {
    // Read existing data from the file
    const existingData = fs.existsSync('cryptoDataDetail.json')
      ? JSON.parse(fs.readFileSync('cryptoDataDetail.json', 'utf-8'))
      : [];

    // Append new data to the existing data
    existingData.push(data);

    // Write the combined data back to the file
    fs.writeFileSync('cryptoDataDetail.json', JSON.stringify(existingData, null, 2));

    console.log('Data saved to cryptoDataDetail.json');
  } catch (error) {
    console.error('Error saving data to file:', error.message);
  }
}

// Main function to orchestrate the process

async function main() {
  try {
    console.log("loading coins from markets (250coins)")
    const markets= await fetchCoins(marketsApiUrl)
    coins= markets.map(obj=> obj.id.toLowerCase());
    console.log("total coins",coins.length)
    for(let i=0; i<coins.length; i++){
        console.log("==================fetching coin,", i+1,":",coins[i]," //// coins to finish: ",coins.length-i-1,"===========================")
        //const data = await fetchData(`https://api.coingecko.com/api/v3/coins/${coins[i]}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`);
        const data = await fetchData(`https://api.coingecko.com/api/v3/coins/${coins[i]}`);
        saveDataToFile(data);  
        console.log('------------------------now pause 10 sec----------------------------')
        // Pause for 10 seconds
        await delay(61000);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Helper function for pausing
const delay = (ms) => new Promise((resolve) => setTimeout(resolve,ms));
// Run the main function
main();

