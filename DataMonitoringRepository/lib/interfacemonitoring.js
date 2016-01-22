var MC = require('./managementcomponents.js');
var managementcomponents = new MC();

var MS = require('./monitoringschedule.js');
mschedule = new MS();

var MG = require('./managementgraphics.js');
managementgraphics = new MG();


var environmentconf = require('../config/configenvironment.js')
							,xml2js = require('xml2js')
							,fs = require('fs')
							,libxslt = require('libxslt')
		 					,libxmljs = require('libxmljs')
							,jstoxml = require("js2xmlparser");

/**
 * Object to manage all actions at the Data Monitoring Component using an Interface.
 * @constructor
 */
var MonitoringInterface = function () {
 
}


/**
 * MonitoringInterface module.
 * @module lib/MonitoriingInterface
 */

MonitoringInterface.prototype ={
  /**
 * Install all Components.
 * @param {function} callback - Callback function (return true or false).
 * @memberOf  MonitoringInterface
 */
 install: function (callback) {
		managementcomponents.installComponents(callback);
 },
 /**
 * Run all Components.
 * @param {function} callback - Callback function (return true or false and msg execution).
 * @memberOf  MonitoringInterface
 */
 run: function () {
		mschedule.scheduleJobs();
 },


/**
 * Call mangement graphics to build graphics.
* @param {string} idcomponent - compenent id to find into database.
* @param {string} datestart - initial date.
* @param {string} dateend - end date.
* @param {function} callback - Callback function (return true or false and msg execution).
* @memberOf  MonitoringInterface
*/
graphicComponentsdata: function (idcomponent, datestart, dateend, callback) {
	managementgraphics.graphicComponentsdata(idcomponent, datestart, dateend, function(resourcesbytime,xlabels,ytitle,title,response){
		if(!response) {callback(null,null,null,null,false);}
		else{callback(resourcesbytime,xlabels,ytitle,title,response);}
	});
}, 

/**
 * Call mangement graphics to build graphics by group metric/resource.
* @param {Object} idsselectdsomponents - compenents ids to find into database.
* @param {string} grouptype - type of grouped data (by Metric or by Resource).
* @param {string} datestart - initial date.
* @param {string} dateend - end date.
* @param {function} callback - Callback function (return true or false and msg execution).
* @memberOf  MonitoringInterface
*/
graphicComponentbygroup: function (idsselectdsomponents, grouptype, datestart, dateend, callback) {
	managementgraphics.graphicComponentbygroup(idsselectdsomponents, grouptype, datestart, dateend, 
		function(result,xlabels,ytitle,title,response){
			if(!response) {callback(null,null,null,null,false);}
			else{callback(result,xlabels,ytitle,title,response);}
		});
}, 


/**
 * create selectedcomponents XML from registry components data.
 * @param {JSON} newselectedcomponents - JSON structure with the selected components from manage selected components.
 * @param {function} callback - Callback function (return true or false and msg execution).
 * @memberOf  MonitoringInterface
 */

createselectedcomponentsXML: function (newselectedcomponents,callback) {

		var parser = new xml2js.Parser();
		fs.readFile(environmentconf.SELECTEDCOMPONENTSXML, function(err, data) {
		 	parser.parseString(data, function (err, result) {
				 if (err) {console.log(err);} 
				 var originallength = result.selectedcomponents.component.length;
				 for(var i = 0; i < newselectedcomponents.selectedcomponents.length; i++) { 
							result.selectedcomponents.component.push(newselectedcomponents.selectedcomponents[i].component);
				 			//console.log('-----------------');
			 	}
				//console.log(result);
				var builder = new xml2js.Builder();
				var finalcomponentsxml = builder.buildObject(result);
				//console.log(finalcomponentsxml);
		 	 	fs.writeFile(environmentconf.SELECTEDCOMPONENTSXML,finalcomponentsxml, function (err) {
		 			if (err ) {console.log(err);callback(err,false);}
					else {
						createselectedcomponentsHTML(callback); //craete selectedcomponents.HTML
					}
		 		});//fs.writeFile end
			 });//parser.parseString end
		}); //fs.readFile end


},

/**
 * create selectedcomponents HTML from registry schema data.
 * @param {function} callback - Callback function (return true or false and msg execution).
 * @memberOf  MonitoringInterface
 */
createselectedcomponentsHTML: function (callback){

	var xhtml = environmentconf.MANAGECOMPONENTSHTML;//'./views/manageselectedcomponents.html';
	var encoding = 'utf8';

	var docSource = fs.readFileSync(environmentconf.REGISTRYSCHEMAXML, encoding);  
	var stylesheetSource = fs.readFileSync(environmentconf.REGISTRYTOSELECTEDCOMPONENTSXSL, encoding);

	var stylesheet = libxslt.parse(stylesheetSource);
	var result = stylesheet.apply(docSource);

	//console.log(result);

	fs.writeFile(xhtml , result, encoding, function (err) {
				if (err){callback(err,false);}
				else {callback('data save into > ' + xhtml,true);}
	});

},

/**
 * create available components HTML from availablecomponents xml.
 * @param {function} callback - Callback function (return true or false and msg execution).
 * @memberOf  MonitoringInterface
 */
createavailablecomponentsHTML: function (callback){
	var xhtml = environmentconf.AVAILABLECOMPONENTSHTML;//'views/availablecomponents.html';
	var encoding = 'utf8';

	var docSource = fs.readFileSync(environmentconf.AVAILABLECOMPONENTSXML, encoding);  
	var stylesheetSource = fs.readFileSync(environmentconf.AVAILABLECOMPONENTSXSL, encoding);

	var stylesheet = libxslt.parse(stylesheetSource);

	var parser = new xml2js.Parser();
	parser.parseString(docSource, function (err, result) {
		 if (err) {console.log(err);} 
		 for(var index in result.availablecomponents.component) {
				var idcomponent = String(result.availablecomponents.component[index].id); 
				(function(index){
					managementgraphics.getMonitoringrecordnumber(idcomponent, function(records,response){
						if(!response) {callback(null,false);}
						else{result.availablecomponents.component[index]['records'] = records;}
						if (parseInt(index)+1 == Object.keys(result.availablecomponents.component).length) { //control asynchronous iteration
								var xmlresult = jstoxml("availablecomponents",result.availablecomponents);	
								var htmlresult = stylesheet.apply(xmlresult);
								fs.writeFile(xhtml , htmlresult, encoding, function (err) {
									if (err) callback(err,false);
									else {callback('data save into > ' + xhtml,true);}
								});// fs end
						} //if end to control asynchronous iteration
					}); // managementgraphics end

				}(index));// function end
			
		 }// for end
	});

},
/**
 * get available components from availablecomponents XML file.
 * @param {function} callback - Callback function (return true or false and available components).
 * @memberOf  MonitoringInterface
 */
getAvailableComponents: function (callback){
	var parser = new xml2js.Parser({explicitArray: false});
	fs.readFile(environmentconf.AVAILABLECOMPONENTSXML, function(err, data) {
	 	parser.parseString(data, function (err, result) {
			if (err) {callback(undefined, false);}
			else{ 
				callback(JSON.stringify(result.availablecomponents.component),true);
			}
			
		 });//parser.parseString end
	}); //fs.readFile end
}
 
}
/** Do accesible module MonitoringInterface */
module.exports = MonitoringInterface;


function createselectedcomponentsHTML(callback){
		var libxslt = require('libxslt')
		,libxmljs = require('libxmljs');
		
		var xhtml = environmentconf.SELECTEDCOMPONENTSHTML;
		var encoding = 'utf8';

		var docSource = fs.readFileSync(environmentconf.SELECTEDCOMPONENTSXML, encoding);  
		var stylesheetSource = fs.readFileSync(environmentconf.SELECTEDCOMPONENTSXSL, encoding);

		var stylesheet = libxslt.parse(stylesheetSource);
		var result = stylesheet.apply(docSource);

		//console.log(result);

		fs.writeFile(xhtml , result, encoding, function (err) {
					if (err){console.log(err);callback(err,false);}
					else {console.log('data save into > ' + xhtml); callback('data save into > ' + xhtml, true);}
		});

}


 
