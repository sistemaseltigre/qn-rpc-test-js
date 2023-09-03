const axios = require('axios');
dotenv = require('dotenv');
dotenv.config({ path: './.env' });

// RPC QuickNode
const quickNodeUrl = process.env.QUICKNODE_RPC_URL;

// Public RPC Solana Devnet
const devnetEndpoint = 'https://api.devnet.solana.com';

// Wallet address
const walletAddress = "GKzwank3rqV73sJPM1QWbmDN4sL9tcy3KTNhTnZDVaoT";

async function getSolanaBalance(address, endpoint) {
  try {
    const startTime = performance.now(); 

    const response = await axios.post(endpoint, {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [address],
    });

    const balance = response.data.result.value / 1000000000; 

    const endTime = performance.now(); 

    console.log(`Balance ${address}: ${balance} SOL`);
    console.log(`Tieme: ${endTime - startTime} miliseconds`);
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

async function main() {
  console.log('Get balance using public RPC...');
  await getSolanaBalance(walletAddress, devnetEndpoint);
  console.log('Get balance using QuickNode RPC...');
  await getSolanaBalance(walletAddress, quickNodeUrl);
}

main();