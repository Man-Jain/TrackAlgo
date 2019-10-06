const algosdk = require('algosdk');
const config = {
  mnemonic : "damp rapid network trumpet dog story portion ten neglect kick search other device park gaze define deposit either pet between giant school helmet absent there",
  server : "https://testnet-algorand.api.purestake.io/ps1",
  port : "",
  token: {
  'X-API-Key': 'oDxsIjQzrhMfcfttgykX9xifgRYjhRO8EdPQWjV9'
  },
  ptoken: {
  'X-API-Key': 'oDxsIjQzrhMfcfttgykX9xifgRYjhRO8EdPQWjV9',
  'Content-Type' : 'application/x-binary'
  },
  serverkmd: 'http://127.0.0.1/',
  port2: 25856,
  token2: '48fb9b4267aee2196f152cf4fae1eba2fa6798c82b9af8da96a8519d67980f74'
};

var recoveredAccount = algosdk.mnemonicToSecretKey(config.mnemonic);
console.log(recoveredAccount.addr);
let algodclient = new algosdk.Algod(config.token, config.server, config.port);
let postalgodclient = new algosdk.Algod(config.ptoken, config.server, config.port);

(async() => {
  let params = await algodclient.getTransactionParams();
  let endRound = params.lastRound + parseInt(1000);
  let txn = {
    "from": recoveredAccount.addr,
    "to": recoveredAccount.addr,
    "fee": 0,
    "amount": 0,
    "firstRound": params.lastRound,
    "lastRound": endRound,
    "genesisID": params.genesisID,
    "genesisHash": params.genesishashb64,
    "note": algosdk.encodeObj({items:[{id: 'FGYHJ56DCVHJ',name: 'Paracetamol',latlng: {lat: 51.505,lng: -0.09,},temp: 34,timestamp: '2018-8-3 11:12:40'}]}),
  };
  let signedTxn = algosdk.signTransaction(txn, recoveredAccount.sk);
  let tx = (await postalgodclient.sendRawTransaction(signedTxn.blob));
  console.log(tx.txId);
})().catch(e => {
  console.log(e);
});
