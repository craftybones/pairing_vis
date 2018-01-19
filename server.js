const express = require('express');
const getPairMappings = require('./decryptPairMapping.js').getPairMappings;
const pairMapFile=process.env.PAIR_MAP||"./users";
const pairMap=getPairMappings(pairMapFile);
const fs=require('fs');

const app = express();
app.use(express.static("public"));
// app.get('/',)

// app.listen(8080,()=>console.log("listening on 8080"));
