const https=require('https');
const fs=require('fs');

const getPairMappings = require('./decryptPairMapping.js').getPairMappings;
const constructQuery = require('./queryConstructor.js').constructQuery;
const GithubQuery = require('./githubQuery.js');

let queryTemplate=fs.readFileSync("graphql_query","utf8");
let repositoryTemplate=`PAIR:repository(owner:"ORG",name:"USERNAME") {
  ...firstNCommits
}`;

let username=process.env["GITHUB_USERNAME"];
let token=process.env["GITHUB_TOKEN"];
let org=process.argv[2] || "STEP-tw";
let usersFile=process.argv[3] || "./users";
let queryFile=process.argv[4] || "./graphql_query";

let pairMap=getPairMappings(usersFile);
let query=constructQuery(pairMap,org,queryFile);

let ghQuery=new GithubQuery(token,query,(payload)=>{
  console.log(payload);
});

ghQuery.fetch();
