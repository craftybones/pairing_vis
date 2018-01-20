const https=require('https');
const fs=require('fs');

const getPairMappings = require('./decryptPairMapping.js').getPairMappings;
const constructQuery = require('./queryConstructor.js').constructQuery;


let queryTemplate=fs.readFileSync("graphql_query","utf8");
let repositoryTemplate=`PAIR:repository(owner:"ORG",name:"USERNAME") {
  ...firstNCommits
}`;

let username=process.env["GITHUB_USERNAME"];
let token=process.env["GITHUB_TOKEN"];
let org=process.argv[2] || "STEP-tw";
let usersFile=process.argv[3] || "./users";
let pairMap=getPairMappings(usersFile);
let query=constructQuery(pairMap,org,"./graphql_query");

let options={
  host:"api.github.com",
  method:"POST",
  path:"/graphql",
  headers:{"User-Agent":"foo",
  "Transfer-Encoding":"chunked",
  "Authorization":`bearer ${token}`}
};

const fetchRepoNames=function(options,query) {
  let req=https.request(options,function(res){
    console.log(res.statusCode);
    let body="";
    res.on("data",(chunk)=>body+=chunk);
    res.on("end",()=>{
      fs.writeFileSync("data.json",body,"utf8");
    });
  });
  let body={query:query};
  req.write(JSON.stringify(body));
  req.end();
};

fetchRepoNames(options,query);
