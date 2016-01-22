var DB = require('./database');
var db = new DB();

/**
 * Object to admin ManagementGraphics.
 * @constructor
 */
var ManagementGraphics = function () {}

/**
 * ManagementGraphics module.
 * @module lib/ManagementGraphics
 */

ManagementGraphics.prototype ={ 

/**
* get the number of monitoring records for a scpecific component.
* @param {string} idcomponent - compenent id to find into database.
* @param {function} callback - Callback function (return true or false and msg execution).
* @memberOf  MonitoringInterface
*/
getMonitoringrecordnumber: function (idcomponent, callback) {
	db.monitoringRecordnumber(idcomponent, function(records,response){
		if(!response) {callback(null,null,false);}
		else{callback(records,response);}
	});
	
}, 

/**
* Redirect to specific graphic method according to the imput data.
* @param {string} idcomponent - compenent id to find into database.
* @param {string} datestart - initial date.
* @param {string} dateend - end date.
* @param {function} callback - Callback function (return true or false and msg execution).
* @memberOf  ManagementGraphics
*/
graphicComponentsdata: function (idcomponent, datestart, dateend, callback){
		if( typeof idcomponent === 'undefined'){ // this comparision can be change
			this.graphicAllComponents(callback);
		}
		if(typeof idcomponent !== 'object'){
			this.graphicComponent(idcomponent, datestart, dateend, callback)
		}
},




/**
 * Extract all components data to graph metrics.
* @param {function} callback - Callback function (return true or false and msg execution).
* @memberOf  ManagementGraphics
*/
graphicAllComponents: function (callback) {
	db.monitoringAllComponents( function(resources,response){
		if(!response){callback(null,null,null,null,false);}
		if(resources.length == 0){callback(new Array([0,0],[0,0]), new Array ([0,""],[0,""]),'','',true);} // empty graph
		callback(resourcesbytime,xlabels,ytitle,title,response);
	});
}, 

/**
 * Extract component data to do metric graphics by date.
* @param {string} idcomponent - compenent id to find into database.
* @param {string} datestart - initial date.
* @param {string} dateend - end date.
* @param {function} callback - Callback function (return true or false and msg execution).
* @memberOf  ManagementGraphics
*/
graphicComponent: function (idcomponent, datestart, dateend, callback) {
	db.monitoringComponentbydate(idcomponent, datestart, dateend, function(resources,response){ 
		
		if(resources.length == 0 ){callback(new Array([0,0],[0,0]), new Array ([0,""],[0,""]),'','',true);} // empty graph 
		else{
			var resourcesbytime = new Array();
			var validvalues = 0; // control all null values in resources.frequencies.
			var xlabels = new Array();
			var ytitle = resources[0].metric.replace('metrics-module-','').replace(/-.*/g,'');
			var title = 'Resource - ' + resources[0].type + ': ' + resources[0].name; 
			
			for(var i in resources[0].frequencies) { 
				validvalues++;
				var value = parseInt(resources[0].frequencies[i].value);
				var date = resources[0].frequencies[i].date;
				date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'-'+date.getHours()+'-'+date.getMinutes()+'-'+date.getSeconds();
				xlabels.push([parseInt(i),date]);
				resourcesbytime.push([parseInt(i),value]);
			}

			if(validvalues == 1){resourcesbytime.unshift([-1,0]);}// only one value. This grapich do not have print with one point.
			//empty values in resources[0].frequencies :[null,null,null,null,null,null,null,null,null,null,null]}]
			if(resourcesbytime.length == 0 || validvalues == 0){callback(new Array([0,0],[0,0]), new Array ([0,""],[0,""]),'','',true);}  
			else {callback(resourcesbytime,xlabels,ytitle,title,response);}
		}//end else
	});
},


/**
 * Extract component grouped data to do metric graphics by metric/resource group and date.
* @param {object} idsselectdcomponents - list of selected compenents to graphc.
* @param {string} grouptype - type of grouped data (by Metric or by Resource).
* @param {string} datestart - initial date.
* @param {string} dateend - end date.
* @param {function} callback - Callback function (return true or false and msg execution).
* @memberOf  ManagementGraphics
*/
graphicComponentbygroup: function (idsselectdcomponents, grouptype, datestart, dateend, callback) {
	var finalgroupeddata = {};
	var index = 0;
	for(var idcomponent in idsselectdcomponents) { 
		var currentmetric = idsselectdcomponents[idcomponent].name;
		var currentresource = idsselectdcomponents[idcomponent].resource.name;
		db.monitoringComponentbygroup(idcomponent, grouptype, currentmetric, currentresource, datestart, dateend,
		 function(datagrouped, keygrouped, response){
			if(!response){callback([],[],'','',false);}
			else{
				if(typeof finalgroupeddata[keygrouped] === 'undefined') {finalgroupeddata[keygrouped] = [datagrouped];}
				else{finalgroupeddata[keygrouped].push(datagrouped);}
			}
			if (++index == Object.keys(idsselectdcomponents).length) { //control asynchronous iteration
				var resultgroupeddata = formatDatatoGroupGraphic(grouptype,finalgroupeddata);
				callback(resultgroupeddata,[],'','',true);
			} //if end to control asynchronous iteration
		});// db.monitoring end
	}// main for end
	
}
 
}
/** Do accesible module Graphic */
module.exports = ManagementGraphics;


/** This fuction format the grouped result verifying if the group type is by Metric or by Resource:
 			[{"Resource":"Blast","Citation":"2704659","Social Media":"4499890"},
			{"Resource":"Blast","Citation":"704659","Social Media":"499890"},]; **/

function formatDatatoGroupGraphic(grouptype,finalgroupeddata) {
	var resultgroupeddata = [];
	for(var element in finalgroupeddata){
		var formatgroupeddata;
		if(grouptype == 'Metric'){ formatgroupeddata ='{"Metric" :'+'"'+element+'"';}
		else{formatgroupeddata ='{"Resource" :'+'"'+element+'"';}
		for( var i in Object.keys(finalgroupeddata[element]) ){
			var elementvalue = JSON.stringify(finalgroupeddata[element][i]);
			elementvalue = elementvalue.replace('{',''); elementvalue = elementvalue.replace('}','');
			formatgroupeddata+= ','+elementvalue;	
		} //for end
		formatgroupeddata+= '}';
		resultgroupeddata.push(JSON.parse(formatgroupeddata));
	} //for end
	return resultgroupeddata;
}
