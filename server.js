const express = require('express');
const getPairMappings = require('./decryptPairMapping.js').getPairMappings;
const constructQuery = require('./queryConstructor.js').constructQuery;
const GithubQuery = require('./githubQuery.js');
const Stagger = require('./stagger.js');

const PORT=process.env.PORT || 8080;
const pairMapFile=process.env.PAIR_MAP || "./users";
const pairMap=getPairMappings(pairMapFile);
const org=process.env.ORG || "STEP-tw";
const token=process.env.GITHUB_TOKEN;
const interval=+(process.env.INTERVAL || 15*60)

const query=constructQuery(pairMap,org,"./graphql_query");

let data={data:{}};
const githubQuery=new GithubQuery(token,query,(body)=>{
  console.log("Received update...");
  data=JSON.parse(body);
});

let fetcher=new Stagger(interval,()=>{githubQuery.fetch()});

if(!process.env.SERVE_DATA_LOCAL)
  fetcher.firstTrigger();


const app = express();
app.use(express.static("public"));
if(process.env.SERVE_DATA_LOCAL) {
  console.log("serving data locally");
  app.get('/data.json',express.static("public/data"));
}
app.get('/data.json',(req,res)=>{
  res.setHeader("Content-Type","application/json");
  res.write(JSON.stringify(data));
  res.end();
})
app.post('/trigger',(req,res)=>{
  fetcher.trigger();
  res.end();
})
app.listen(PORT,()=>console.log(`listening on ${PORT}`));
