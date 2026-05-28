import fs from 'fs';

async function runFetch() {
  const url = 'https://api.thecatapi.com/v1/images/search?limit=10&has_breeds=1';
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'DEMO-API-KEY'
    }
  };

  try {
    console.log('Fetching cats from API...');
    const res = await fetch(url, options);
    const data = await res.json();
    
    const outputFilename = 'cats_response_output.json';
    fs.writeFileSync(outputFilename, JSON.stringify(data, null, 4), 'utf-8');
    
    console.log(`Success! Response has been saved to "${outputFilename}".`);
    console.log(`Fetched ${data.length} cats.`);
  } catch (error) {
    console.error('Error during fetch operation:', error);
  }
}

runFetch();
