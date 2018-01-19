const crypto=require('crypto');
const fs=require('fs');

const secret=process.env['SECRET'];
const algorithm="aes-256-ctr";

const decrypt=(contents,algorithm,secret)=> {
  let decipher = crypto.createDecipher(algorithm,secret)
  let dec = decipher.update(contents,'hex','utf8')
  return dec + decipher.final('utf8');
}

const getPairMappings=(filename)=>{
  let contents=fs.readFileSync(filename,"utf8");
  let decrypted=decrypt(contents,algorithm,secret);
  return JSON.parse(decrypted);
}

function encrypt(text,algorithm,secret){
  var cipher = crypto.createCipher(algorithm,secret)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.getPairMappings=getPairMappings;
