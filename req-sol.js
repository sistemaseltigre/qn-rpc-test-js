const axios = require('axios');

const solanaRpcUrl = 'https://api.mainnet-beta.solana.com';
// request number
const numRequests = 10; // You can adjust this number according to your needs

async function makeRequest() {
  try {
    const response = await axios.post(solanaRpcUrl, {
      jsonrpc: '2.0',
      id: 1,
      method: 'getRecentBlockhash',
      params: [],
    });
    return response.data;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

async function main() {
  const requests = Array.from({ length: numRequests }, makeRequest);

  try {
    const results = await Promise.all(requests);    
    console.log(`Done ${results.length} request at the same time`);
  } catch (error) {
    console.error('one request failed.');
  }
}

main();