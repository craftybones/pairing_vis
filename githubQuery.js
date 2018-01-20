const https=require('https');

let createOptions=(token)=>{
  return {
    host:"api.github.com",
    method:"POST",
    path:"/graphql",
    headers:{"User-Agent":"githubqueryfetcher",
    "Transfer-Encoding":"chunked",
    "Authorization":`bearer ${token}`}
  };
}


class GithubQuery {
  constructor(token,query,callback) {
    this.token=token;
    this.query=query;
    this.callback=callback;
    this.options=createOptions(this.token);
  }
  fetch() {
    let req=https.request(this.options,(res)=>{
      let body="";
      res.on("data",(chunk)=>body+=chunk);
      res.on("end",()=>{
        this.callback(body);
      });
    });
    let reqBody={query:this.query};
    req.write(JSON.stringify(reqBody));
    req.end();
  }
}

module.exports=GithubQuery;
