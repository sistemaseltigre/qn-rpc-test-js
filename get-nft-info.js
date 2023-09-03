const { Connection, PublicKey } = require('@solana/web3.js');
dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const axios = require('axios');

// URL del RPC de QuickNode
const quickNodeUrl = process.env.QUICKNODE_RPC_URL;

// Public RPC Solana Devnet
const devnetEndpoint = 'https://api.devnet.solana.com';

// NFT address
const nftAccountAddress = "EKtEsv41fPXB1U3zgkNB3Sc5CBWTVuSeYxXDW8ZyEkym";

// Wallet address
const walletAddress = "GKzwank3rqV73sJPM1QWbmDN4sL9tcy3KTNhTnZDVaoT";

async function getNFTHistory(nftAddress, endpoint) {
  try {
    const connection = new Connection(endpoint, 'confirmed');
    const publicKey = new PublicKey(nftAddress);
    const accountInfo = await connection.getAccountInfo(publicKey);
    if (!accountInfo) {
      console.error('La cuenta de NFT no existe');
      return;
    }
    const data = Buffer.from(accountInfo.data, 'base64');
    console.log(data);

  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

async function getNFTqn(wallet, endpoint) {
    try {
      const requestData = {
        id: 67,
        jsonrpc: "2.0",
        method: "qn_fetchNFTs",
        params: {
          wallet: wallet,
          omitFields: ["provenance", "traits"],
          page: 1,
          perPage: 10,
        },
      };

      const response = await axios.post(endpoint, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'x-qn-api-version': '1',
        },
      });
  
      
      const nftData = response.data;  
      console.log('Información de los NFT:');
      console.log(nftData.result.assets);
  
    } catch (error) {
      console.error('Error:', error);
    }
  }

async function main() {
  console.log('Get NFT info using public RPC...');
  await getNFTHistory(nftAccountAddress, devnetEndpoint);

  console.log('Get NFT info using QuickNode RPC and API...');
  await getNFTqn(walletAddress, quickNodeUrl);
}

main();
