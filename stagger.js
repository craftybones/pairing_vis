class Stagger {
  constructor(interval,callback) {
    this.epoch=Date.now();
    this.latest=this.epoch;
    this.interval=interval;
    this.callback=callback;
    this.firstTriggerDone=false;
  }
  firstTrigger() {
    if(this.firstTriggerDone)
      return;
    this.callback();
    this.latest=Date.now();
    this.firstTriggerDone=true;
  }
  trigger() {
    let now=Date.now();
    let difference=now-this.latest;
    if(difference>this.interval*1000) {
      this.callback();
      this.latest=now;
    }
  }
}

module.exports=Stagger;
