const fs = require('fs');

// Function to load data from a JSON file
function loadDataFromFile() {
  try {
    // Read data from the file
    const jsonData = fs.readFileSync('cryptoData.json', 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error loading data from file:', error.message);
    return null;
  }
}

// Main function to use the loaded data
function processLoadedData(data) {
  if (data) {
    console.log('Loaded data:', data);
    // Perform additional processing with the loaded data if needed
  } else {
    console.log('No data loaded.');
  }
  const ids = data.map(obj => obj.categories);

  // Log the result
  console.log(ids,ids.length);

}


// Main function to orchestrate the process
function main() {
  // Load data from the file
  const loadedData = loadDataFromFile();

  // Process the loaded data
  processLoadedData(loadedData);
}

// Run the main function
main();