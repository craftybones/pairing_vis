const express = require('express');
const getPairMappings = require('./decryptPairMapping.js').getPairMappings;
const constructQuery = require('./queryConstructor.js').constructQuery;

const PORT=process.env.PORT || 8080;
const pairMapFile=process.env.PAIR_MAP || "./users";
const pairMap=getPairMappings(pairMapFile);
const org=process.env.ORG || "STEP-tw";

const query=constructQuery(pairMap,org,"./graphql_query");
console.log(query);

const app = express();
app.use(express.static("public"));

app.listen(PORT,()=>console.log(`listening on ${PORT}`));
