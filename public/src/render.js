let foo={};
let epoch=Date.parse("2018-01-19T04:30:00Z");
let now=Date.now();
let midnight=d3.timeDay.floor(now);
let threeDaysAgo=d3.timeDay.offset(now,-3);
let seventyTwoHourRange=d3.scaleTime().domain([threeDaysAgo,now]);

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
  let scale=seventyTwoHourRange.range([0,720]);
  let midnight=d3.timeDay.floor(now);
  let lastNight=d3.timeDay.floor(d3.timeDay.offset(now,-1));
  let nightBeforeLast=d3.timeDay.floor(d3.timeDay.offset(now,-2));

  let svg=row.append("td")
    .append("svg")
    .style("width","720")
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
  svg.append("g")
      .attr("transform",`translate(${scale(nightBeforeLast)},0)`)
      .append("line")
        .attr("class","midnight")
        .attr("x1",0)
        .attr("y1",0)
        .attr("x2",0)
        .attr("y2",14);
  svg.append("g")
      .attr("transform",`translate(${scale(lastNight)},0)`)
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

const addCommitMessages=(userDiv,data)=>{
  let commitLog=userDiv.append("div")
    .attr("class","commit_log");
  commitLog.append("a")
    .attr("href",(d)=>data[d].url)
    .attr("name",(d)=>d)
    .text((d)=>d.replace("__"," / "));
  commitLog.append("ul")
    .selectAll("li")
    .data((d)=>data[d].commits_after.slice(0,5))
    .enter()
      .append("li")
      .text((d)=>d.message.substr(0,80))
}

const addAdditionsDeletions=(userDiv,data)=>{
  let xScale=d3.scaleLinear().domain([0,20]).range([0,480]).clamp(true);
  let yScale=d3.scaleLinear().domain([0,200]).range([0,50]).clamp(true);
  let svg=userDiv.append("div")
    .attr("class","additions")
    .append("svg")
    .attr("width",480)
    .attr("height",100);
  svg.append("g")
    .attr("class","addition")
    .selectAll("additions")
    .data((d)=>data[d].commits_after.slice(0,20))
    .enter()
      .append("g")
      .attr("transform",(d,i)=>{return `translate(${xScale(19-i)},${50-yScale(d.additions)})`})
      .append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("width",24)
        .attr("height",(d)=>{return yScale(d.additions)});
  svg.append("g")
    .attr("class","deletion")
    .selectAll("deletions")
    .data((d)=>data[d].commits_after)
    .enter()
      .append("g")
      .attr("transform",(d,i)=>{return `translate(${xScale(19-i)},50)`})
      .append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("width",24)
        .attr("height",(d)=>{return yScale(d.deletions)});
}

const renderCommitLogs=(data)=>{
  let users=Object.keys(data).sort();
  let userDiv=d3.select(".commit_logs")
    .selectAll(".user")
    .data(users)
    .enter()
    .append("div")
    .attr("class","user");
  addCommitMessages(userDiv,data);
  addAdditionsDeletions(userDiv,data);
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
    row.append("td")
      .append("a")
      .attr("href",(d)=>`#${d}`)
      .text((d)=>d.replace("__"," / "));
    row.append("td").text((d)=>data[d].commits_after.length);
    render24HourGraph(data,row);
    renderCommitLogs(data);
  });
}

window.onload=render;
