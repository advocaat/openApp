var scheduler = require('node-schedule');

var functions = {};

functions.schedulePost = function(date, job, message){

   scheduler.scheduleJob(date, function(m){
          return job(m);
   }.bind(null, message)
   )
}

functions.scheduleUploadSoundcloud = function(date, job, title, mongoId, list, description, genre){
   scheduler.scheduleJob(date, function(t, m, l, d, g){
      return job(t, m ,l ,d, g);
   }.bind(null,title, mongoId, list, description, genre ));
}

functions.scheduleFBPostWithPhoto = function(date, job, message, photoId){
   scheduler.scheduleJob(date, function(p,m){
      return job(p, m);
   }.bind(null,photoId,  message));

}

functions.scheduleDaily = function(offset, job){
   var rule = new scheduler.RecurrenceRule();
   rule.dayOfWeek =[0, new scheduler.Range(1, 6)];
   rule.hour = 5;
   rule.minute = offset;

   var j = scheduler.scheduleJob(rule, function(){
      return job();

   });
   console.log("job " + JSON.stringify(j));
}
functions.scheduleUploadYoutube = function(date, job, mongoId, title ,description, keywords){
   scheduler.scheduleJob(date, function(m, t, d, k){
      return job(m,t,d,k);
   }.bind(null, mongoId, title,description, keywords ));
}


functions.scheduleRegularAction = function(job, service){
   var rule = new scheduler.RecurrenceRule();
   rule.minute = [0, new scheduler.Range(1, 59, 3)];

   scheduler.scheduleJob(rule, function(s){
      return job(s);
   }.bind(null, service));
}

module.exports = functions;