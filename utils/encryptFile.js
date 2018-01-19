const fs = require('fs');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

const fileToEncrypt = process.argv[2];
const password = process.argv[3];

const usage=`Usage: node ./encryptFile.js <filename> <secret>`;

if(!password || !fileToEncrypt) {
  console.log(usage);
  return;
}

function encrypt(text,algorithm,password){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

try {
  let contents=fs.readFileSync(fileToEncrypt,"utf8");
  fs.writeFileSync(fileToEncrypt+".encrypted",encrypt(contents,algorithm,password));
} catch(e) {
  console.log(e);
}
