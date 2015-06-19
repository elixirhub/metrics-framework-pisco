var environmentconf = require('../config/configenvironment.js')
	,schedule = require('node-schedule')
	,fs = require('fs')
    ,xml2js = require('xml2js')
    ,COMPONENT = require('./component.js');
   


/**
 * Object to admin Components Scheduling .
 * @constructor
 */
var MonitoringSchedule = function () { 
	 this.listjobs = {}; 
}

/**
 * ScheduleComponent module.
 * @module lib/schedulecomponent
 */

 MonitoringSchedule.prototype ={
	/**
	* Push a new component execution into jobs list
	* @param {string} id - Component ID.
	* @param {object} job - job schedule for this component.
	* @memberOf  MonitoringSchedule
	*/
	push: function(id, job) {
		this.listjobs[id] = job;
	},
	/**
	* Get one component execution from jobs list
	* @param {string} id - Component ID.
	* @memberOf  MonitoringSchedule
	*/
	get: function(id) {
		//console.log(this.listjobs);
		return this.listjobs[id];
	},
	/**
	* Run one component following a schedule
	* @param {string} frequency - Time interval of component execution in Cron format.
	* @param {string} id - Component ID.
	* @param {string} executable - File name of the executable component.
	* @param {string} input - list of params used in the execution.
	* @memberOf  MonitoringSchedule
	*/
	scheduleJob: function (frequency,id,executable,input) {
		var component = new COMPONENT();
		var job = schedule.scheduleJob(frequency, function() {
					component.run(executable,input, function(response){
						if (response){
							console.log('component ' + id + ' was executed');
						}else {console.log('component ' + id + 'failed execution');}
					});	// component.run end
		}); //schedule.scheduleJob end
		this.push(id,job);
		
	},	
	
	
/**
* Run the components following a schedule
* @memberOf  MonitoringSchedule
*/

  scheduleJobs: function () {
	var parser = new xml2js.Parser();
	var mschedule = this;
	fs.readFile(environmentconf.SELECTEDCOMPONENTSXML, function(err, data) {
		parser.parseString(data, function (err, dataparsed) {
			 if (err) {console.log(err);}
			 for(var i = 0; i < dataparsed.selectedcomponents.component.length; i++) {
				var installed = dataparsed.selectedcomponents.component[i].installed;
				if(installed == 'false'){continue;}
				var id = ''; id += dataparsed.selectedcomponents.component[i].id;
				var freq = dataparsed.selectedcomponents.component[i].frequency;
				var executable = dataparsed.selectedcomponents.component[i].executable;
				var input = dataparsed.selectedcomponents.component[i].input;
				
				executable = environmentconf.SOURCEPATH + '/' + id + '/' + executable; // path where is the js executable
				console.log(executable + ' ' + environmentconf.frequency[freq]);
				mschedule.scheduleJob(environmentconf.frequency[freq],id,executable,input);
			 } //for end
		});//parser.parseString end
	}); //fs.readFile end
  },

/**
* Cancel the component execution
* @param {string} id - Component ID.
* @memberOf  MonitoringSchedule
*/
 cancelJob: function (id){
	var job = this.get(id); 
	job.cancel();	
 },

  /**
 * Cancel all components execution
 * @memberOf  MonitoringSchedule
 */
 cancelAllJobs: function (){
	for (var id in listjobs) {
		cancelJob(id);	
	}
 }

},
/** Do accesible module MonitoringSchedule */
module.exports = MonitoringSchedule;



