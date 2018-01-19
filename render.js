let foo={};
let epoch=Date.parse("2018-01-19T04:30:00Z");
let now=Date.now();
let midnight=d3.timeDay.floor(now);
let yesterday=d3.timeDay.offset(now,-1);
let twentyFourHourRange=d3.scaleTime().domain([yesterday,now]);

let filterCommits=(commits)=>{
  return commits.filter((c)=>{
    let date=Date.parse(c.authoredDate);
    return epoch<date;
  })
}

const moveCommitsToData=(data)=> {
  Object.keys(data).forEach((p)=>{
    data[p].commits_after=filterCommits(data[p].master.head.history.commits);
  });
}

const getPushTimes=(commits)=> {
  let pushTimes=commits.reduce((pt,c)=>{
    if(c.pushedDate)
      pt[c.pushedDate]=true;
    return pt;
  },{});
  return Object.keys(pushTimes);
}

const render24HourGraph=(data,row)=> {
  let scale=twentyFourHourRange.range([0,240]);

  let svg=row.append("td")
    .append("svg")
    .style("width","240")
    .style("height","14");

  let group=svg.selectAll("g")
    .data((d)=>data[d].commits_after)
    .enter()
      .append("g")
      .attr("transform",(c)=>`translate(${scale(Date.parse(c.authoredDate))},0)`);

  group.append("line")
      .attr("x1",0)
      .attr("y1",0)
      .attr("x2",0)
      .attr("y2",14);
  svg.append("g")
      .attr("transform",`translate(${scale(midnight)},0)`)
      .append("line")
        .attr("class","midnight")
        .attr("x1",0)
        .attr("y1",0)
        .attr("x2",0)
        .attr("y2",14);
  let pushGroups=svg.selectAll("pushes")
      .data((d)=>getPushTimes(data[d].commits_after))
      .enter()
      .append("g")
      .attr("transform",(c)=>`translate(${scale(Date.parse(c))},0)`);

  pushGroups.append("line")
      .attr("class","push")
      .attr("x1",1)
      .attr("y1",0)
      .attr("x2",1)
      .attr("y2",14);
}

const renderCommitLogs=(data)=>{
  let users=Object.keys(data).sort();
  let userDiv=d3.select(".commit_logs")
    .selectAll(".user")
    .data(users)
    .enter()
    .append("div")
    .attr("class","user");
  userDiv.append("h4").text((d)=>d.replace("__"," / "));
  userDiv.append("ul")
    .selectAll("li")
    .data((d)=>data[d].commits_after.slice(0,5))
    .enter()
      .append("li")
      .text((d)=>d.message.substr(0,80))
}

const render=()=>{
  d3.json("data.json",(d)=>{
    foo=d;
    let data=d.data;
    moveCommitsToData(data);
    let users=Object.keys(data).sort(function(a,b){
      return data[a].commits_after.length - data[b].commits_after.length;
    });
    let row=d3.select(".summary")
      .selectAll("p")
      .data(users)
      .enter()
        .append("tr");
    row.append("td").text((d)=>d.replace("__"," / "));
    row.append("td").text((d)=>data[d].commits_after.length);
    render24HourGraph(data,row);
    renderCommitLogs(data);
  });
}

window.onload=render;
