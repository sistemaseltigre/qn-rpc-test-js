const { Connection } = require('@solana/web3.js');
dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const axios = require('axios');

// Quicknode RPC URL
const quickNodeUrl = process.env.QUICKNODE_RPC_URL;
const devnetEndpoint = 'https://api.devnet.solana.com';
const walletAddress = "GKzwank3rqV73sJPM1QWbmDN4sL9tcy3KTNhTnZDVaoT";



async function getTransactions(address, cant, endpoint) {
  try {
    const startTime = performance.now();
    const response = await axios.post(endpoint, {
      jsonrpc: '2.0',
      id: 1,
      method: 'getConfirmedSignaturesForAddress2',
      params: [address, { limit: cant }],
    });

    const transactions = await Promise.all(response.data.result.map(async transaction => {
      const signature = transaction.signature;
      const slot = transaction.slot;
      const blockTimeResponse = await axios.post(endpoint, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getConfirmedBlock', // Use 'getConfirmedBlock' method to get block time
        params: [slot],
      });

      const blockTime = blockTimeResponse.data.result.blockTime;
      const txResponse = await axios.post(endpoint, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [signature],
      });

      const sender = txResponse.data.result.transaction.message.accountKeys[0];
      const receiver = txResponse.data.result.transaction.message.accountKeys[1];
      const status = txResponse.data.result.meta.err === null ? 'Success' : 'Failed';
      const amount = (txResponse.data.result.meta.postBalances[0] - txResponse.data.result.meta.preBalances[0]) / 1000000000;

      return {
        signature,
        sender,
        receiver,
        status,
        amount,
        blockTime
      };
    }));

    const endTime = performance.now();
    console.log(`Time to get tx: ${endTime - startTime} miliseconds`);

    return transactions;
  } catch (error) {
    throw new Error(`Error getting transactions: ${error}`);
  }
}


async function main(){
    console.log('Getting transactions Public RPC...');
    const transactions = await getTransactions(walletAddress, 10, devnetEndpoint);
    transactions.forEach(transaction => {
        console.log(`Signature: ${transaction.signature}`);
        console.log(`Sender: ${transaction.sender}`);
        console.log(`Receiver: ${transaction.receiver}`);
        console.log(`Status: ${transaction.status}`);
        console.log(`Amount: ${transaction.amount}`);
        console.log(`Timestamp: ${transaction.blockTime}`);
        console.log('---');
    });
    // ------ Quicknode RPC ------
    console.log('Getting transactions Public RPC...');
    const qn_transactions = await getTransactions(walletAddress, 10, quickNodeUrl);
    qn_transactions.forEach(transaction => {
        console.log(`Signature: ${transaction.signature}`);
        console.log(`Sender: ${transaction.sender}`);
        console.log(`Receiver: ${transaction.receiver}`);
        console.log(`Status: ${transaction.status}`);
        console.log(`Amount: ${transaction.amount}`);
        console.log(`Timestamp: ${transaction.blockTime}`);
        console.log('---');
    });
}

main();