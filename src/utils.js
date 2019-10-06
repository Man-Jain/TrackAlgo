const crypto = require('crypto');

  const config = {
    mnemonic : "damp rapid network trumpet dog story portion ten neglect kick search other device park gaze define deposit either pet between giant school helmet absent there",
    server : " https://testnet-algorand.api.purestake.io/ps1",
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


function encrypt(text){
  var cipher = crypto.createCipher('aes-256-cbc',config.mnemonic);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher('aes-256-cbc',config.mnemonic)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

export {config, encrypt, decrypt};
