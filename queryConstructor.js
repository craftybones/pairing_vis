const fs=require('fs');

let repositoryTemplate=`PAIR:repository(owner:"ORG",name:"REPO") {
  ...firstNCommits
}`;

const constructQuery=function(usersMap,org,queryTemplateFile) {
  let queryTemplate=fs.readFileSync(queryTemplateFile,"utf8");
  let templates=usersMap.map(function(r){
    let template=repositoryTemplate;
    return template.replace("PAIR",r.pair)
      .replace("ORG",org)
      .replace("REPO",r.repo);
  });
  let templateLines=templates.join("\n");
  return queryTemplate.replace("PLACEHOLDER",templateLines);
}

exports.constructQuery=constructQuery;
