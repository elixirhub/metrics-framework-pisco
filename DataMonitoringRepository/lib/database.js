//mongodb native drivers.
var mongodb = require('mongodb');
// Connection URL. 
var databaseconf = require('../config/configdatabase.js')


/**
 * Object to admin Components.
 * @constructor
 */
var Database = function () {
	//"MongoClient" interface in order to connect to a mongodb server.
	 this.MongoClient = mongodb.MongoClient;
}


/**
 * Database module.
 * @module lib/Database
 */

Database.prototype ={

 
 /**
 * Insert new resource into DB metricsdb
 * @param {JSON} resource - new resource.
 * @param {function} callback - Callback function (return true or false and value of this execution).
 * @memberOf  Database
 */
  
 
 insert: function (resource, callback) {
  	this.MongoClient.connect(databaseconf.URL, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);	
		} else {
			console.log('Connection established to', databaseconf.URL);
			// Get the documents collection
    		var collection = db.collection('resources');
    		var query = {"name":resource.name, "type" : resource.type, 'metric':resource.metric};
    		//console.log(query);
    		findtoupdate(collection,query,function(result){
    			if(result==null || result==''){// is a new resource
    				collection.insert(resource, function (err, result) {
						if (err) {
							callback(err,false);
						} else {
							callback('Inserted data into the "resources" collection',true);
						}
				
						//Close connection
						db.close();
			
					});// end insert
    			}else { // resource exists therefore it needs upgrade
    				updatetoinsert(query,db,result[0].frequencies,resource.frequencies[0],callback);
    			}
    		});// end findtoupdate
			
   		
		}// end else
	}); //end connect
   		
	
 },
 
 /**
 * Remove one resource into DB metricsdb
 * @param {string} query - list of key: resource keywords to remove, e.g. {"name":"uniprot","type" : "database","metric":"metric_id"}.
 * @param {object} callback - - Callback function (true or false).
 * @memberOf  Database
 */
  
  remove: function (query,callback) {
  
  	this.MongoClient.connect(databaseconf.URL, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);	
		} else {
			console.log('Connection established to', databaseconf.URL);
			// Get the documents collection
    		var collection = db.collection('resources');
			collection.remove(query, function (err, result) {
				if (err) {
					console.log(err); callback(false);
				} else {
					console.log('Deleted data into the "resources" collection');
					callback(true);
				}
				
		  		//Close connection
		  		db.close();
			
			});// end insert
   		
		}
	}); //end connect
   		
	
 },
 
/**
 * Update the frequency array in one resource
 * @param {string} query - list of key:resource keyword to update, for example {"name":"uniprot","type" : "database","metric":"citation-4ywN_j5H"}.
 * @param {string} newfrequency - new value to add, for example {"period":"minute","date":"2015-06-24T15:42:11.010Z","value":"50480"}
 * @memberOf  Database
 */
  
  update: function (query, newfrequency) {
  	var dbobject = this;
  	this.MongoClient.connect(databaseconf.URL, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);	
		} else {
			console.log('Connection established to', databaseconf.URL);
			// Get the documents collection
    		var collection = db.collection('resources');
    		dbobject.findtoupdate(collection,query, function(resource){
    			if(resource == null || resource =='') {console.log('NOT matches to ' + JSON.stringify(query)); db.close();}
    			else{ 
    				var frequencies = [];
    				frequencies = resource[0].frequencies; 
    				frequencies[frequencies.length] = newfrequency; //console.log('==================\n'+frequencies);
					collection.update(query, {$set: {"frequencies": frequencies}} ,function (err, result) {
						if (err) { console.log(err);} 
						else {
							console.log('Updated data into the "resources" collection: ' + result);
						}
						db.close();
					});// end update
				} // end else
    		});//end dbobject.find
    	} // end else
	}); //end connect
   		
 },
 

 
/**
 * Find a resource into DB.
 * @param {string} query - list of key:resource keyword to update, for example {"name":"uniprot","type" : "database","metric":"citation-4ywN_j5H"}.
 * @param {object} callback - - Callback function (return search result).
 * @memberOf  Database
 */
  
  find: function (query,callback) {
  	this.MongoClient.connect(databaseconf.URL, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);	
		} else {
			console.log('Connection established to', databaseconf.URL);
			// Get the documents collection
    		var collection = db.collection('resources');
			collection.find(query).toArray(function (err, result) {
				if (err) {
					console.log(err); callback(null,false);
				} else {
					callback(result,true);
				}
				
		  		//Close connection
		  		db.close();
			
			});// end insert
   		
		}
	}); //end connect
   		
	
 },

/**
* get the number of monitoring records for a scpecific component.
* @param {string} idcomponent - compenent id to find into database.
* @param {function} callback - Callback function (return true or false and msg execution).
* @memberOf  Database
*/
monitoringRecordnumber: function (idcomponent, callback) {
	var query = {'metric' : idcomponent};
	this.find(query,function(resource,response){ 
		if(!response){callback(null,response);}
		if(resource.length == 0) {callback(0,response);}
		else{ callback(resource[0].frequencies.length,response);}
	});
	
}, 

/**
 * Find all components into DB. This data is used to graph metrics
 * @param {object} callback - - Callback function (return search result).
 * @memberOf  Database
 */
monitoringAllComponents: function(callback) {
	var query = {};
	this.find(query,function(resources,response){
			callback(resources,response);
	});

 },

/**
 * Find a specific component into DB. This data is used in monitoring graphs
 * @param {string} idcomponent - component id to search {"metric":"citation-4ywN_j5H"}.
 * @param {string} startdate - start date monitoring
 * @param {string} enddate - end date monitoring
 * @param {object} callback - - Callback function (return search result).
 * @memberOf  Database
 */
monitoringComponentbydate: function(idcomponent, startdate, enddate, callback) { 
	//console.log(idcomponent+'-->'+startdate+'+++++++++'+enddate);
	if(typeof startdate === 'undefined'){startdate = new Date();} else{startdate = new Date(startdate);}
	if(typeof enddate === 'undefined'){enddate = new Date();} else{ enddate = new Date(enddate+'T23:59:59');}
   //console.log(startdate+'*********'+enddate);
	var query = {'metric' : idcomponent};
	this.find(query,function(resources,response){
		if(!response){callback(null,response);}
		if(resources.length == 0) {callback([],true);}
		else{
			var resourcesbydate = resources;
			for(var i in resources[0].frequencies) { 
				var resourcedate = resources[0].frequencies[i].date; 
				if(!(resourcedate <= enddate && resourcedate >= startdate) ){delete resourcesbydate[0].frequencies[i];}
			}//console.log(JSON.stringify(resourcesbydate));
			callback(resourcesbydate,true);
		}
	});

 },


/**
 * Find a specific component into DB and get data grouped by resource. This data is used in monitoring graphs
 * @param {string} idcomponent - component id to search {"metric":"citation-4ywN_j5H"}.
 * @param {string} startdate - star date monitoring
 * @param {string} enddate - end date monitoring
 * @param {object} callback - - Callback function (return search result).
 * @memberOf  Database
 */
monitoringComponentbygroup: function(idcomponent, grouptype, metric, resource, startdate, enddate, callback) { 
	var totalscore = 0;
	var totalhits= 1;
	//console.log(startdate+'--------'+enddate);
	if(typeof startdate === 'undefined'){startdate = new Date();} else{startdate = new Date(startdate);}
	if(typeof enddate === 'undefined'){enddate = new Date();} else{ enddate = new Date(enddate+'T23:59:59');}
   //console.log(startdate+'*********'+enddate);
	var query = {'metric' : idcomponent}; 
	this.find(query,function(resources,response){
		if(!response){callback(null,response);}
		if(resources.length == 0) {callback([],true);}
		else{
			for(var i in resources[0].frequencies) { 
				var resourcedate = resources[0].frequencies[i].date; 
				var value = parseInt(resources[0].frequencies[i].value);
				if(resourcedate <= enddate && resourcedate >= startdate ){totalscore+=value; totalhits+=1}
			} 
			totalscore=totalscore/totalhits;
			var result = {};

			if(grouptype == 'Metric'){ result[resource]=totalscore.toFixed(2); callback(result,metric,true);}
			else{ result[metric]=totalscore.toFixed(2); callback(result,resource,true);}
			
		}
	});

 }
 
}
 
 /** Do accesible module Component */
module.exports = Database;



 /**
 * Update the frequency array in one resource. This function is called from insert function;
 * @param {string} query - list of key:resource keyword to update, for example {"name":"uniprot","type" : "database","metric":"citation-4ywN_j5H"}.
 * @param {object} db - database 
 * @param {JSON} frequencies - old frequencies
 * @param {JSON} frequencies - new frequency to upgrade
 * @param {object} callback - - Callback function (return search result).
 * @memberOf  Database
 */
  
  function updatetoinsert(query, db, frequencies, newfrequency,callback) {
  		var collection = db.collection('resources');
		//console.log(newfrequency);
		frequencies[frequencies.length] = newfrequency; //console.log('==================\n'+frequencies);
		collection.update(query, {$set: {"frequencies": frequencies}} ,function (err, result) {
			if (err) { callback(err,false);} 
			else {
				callback('Updated data into the "resources" collection: ' + result,true);
			}
			db.close();
				
    	});//end update	
 }

/**
 * Find a resource into DB. This function is called from update function
 * @param {object} collection - database collection 
 * @param {string} query - list of key:resource keyword to update, for example {"name":"uniprot","type" : "database","metric":"citation-4ywN_j5H"}.
 * @param {object} callback - - Callback function (return search result).
 * @memberOf  Database
 */
  
  function findtoupdate(collection,query,callback) {
	collection.find(query).toArray(function (err, result) {
		if (err) {
			console.log(err); callback(null);
		} else {
			//console.log(result);
			callback(result);
		}
  });// end find 		
	
 }

