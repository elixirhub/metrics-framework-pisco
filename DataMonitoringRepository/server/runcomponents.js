
var MS = require('../lib/monitoringschedule.js');
mschedule = new MS();
mschedule.scheduleJobs();



//var timeout = 3 * 60 * 100000;
//for(i=0;i<timeout;i++){console.log('.');}
//mschedule.cancelJob('metrics-module-tweets-NJxd-lk7E');
// var timeout = 3 * 60 * 1000;
//mschedule.cancelJob('metrics-module-tweets-NJxd-lk7E');
//    
//       setTimeout(function() {
//         mschedule.cancelJob('metrics-module-tweets-NJxd-lk7E');
//       }, timeout);


//cancelAllJobs
