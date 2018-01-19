const https=require('https');
const fs=require('fs');

let queryTemplate=fs.readFileSync("graphql_query","utf8");
let repositoryTemplate=`PAIR:repository(owner:"ORG",name:"USERNAME") {
  ...firstNCommits
}`;

let username=process.env["GITHUB_USERNAME"];
let token=process.env["GITHUB_TOKEN"];
let org=process.argv[2] || "STEP-tw";
let usersFile=process.argv[3] || "./users";

const constructQuery=function(usersFile,org,queryTemplate) {
  let lines=fs.readFileSync(usersFile,"utf8").split("\n").slice(0,-1);
  let templates=lines.map(function(line){
    let pairAndLogin=line.split(",");
    let template=repositoryTemplate;
    return template.replace("PAIR",pairAndLogin[0])
      .replace("ORG",org)
      .replace("USERNAME",pairAndLogin[1]);
  });
  let templateLines=templates.join("\n");
  return queryTemplate.replace("PLACEHOLDER",templateLines);
}

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

let query=constructQuery(usersFile,org,queryTemplate);

fetchRepoNames(options,query);
