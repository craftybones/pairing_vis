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

exports.getPairMappings=getPairMappings;
