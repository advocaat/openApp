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

module.exports = functions;