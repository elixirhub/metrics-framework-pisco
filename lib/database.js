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
 * @memberOf  Database
 */
  
 
 insert: function (resource) {
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
							console.log(err); 
						} else {
							console.log('Inserted data into the "resources" collection');
						}
				
						//Close connection
						db.close();
			
					});// end insert
    			}else { // resource exists therefore it needs upgrade
    				updatetoinsert(query,db,result[0].frequencies,resource.frequencies[0]);
    			}
    		});// end findtoupdate
			
   		
		}// end else
	}); //end connect
   		
	
 },
 
 /**
 * Remove one resource into DB metricsdb
 * @param {string} query - list of key: resource keywords to remove, for example {"name":"uniprot","type" : "database","metric":"citation-4ywN_j5H"}.
 * @param {object} callback - - Callback function (true or false).
 * @memberOf  Database
 */
  
  remove: function (query,callback) {
  
  	this.MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);	
		} else {
			console.log('Connection established to', url);
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
  	this.MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);	
		} else {
			console.log('Connection established to', url);
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
  
  	this.MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);	
		} else {
			console.log('Connection established to', url);
			// Get the documents collection
    		var collection = db.collection('resources');
			collection.find(query).toArray(function (err, result) {
				if (err) {
					console.log(err); callback(null);
				} else {
					callback(result);
				}
				
		  		//Close connection
		  		db.close();
			
			});// end insert
   		
		}
	}); //end connect
   		
	
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
 * @memberOf  Database
 */
  
  function updatetoinsert(query, db, frequencies, newfrequency) {
  		var collection = db.collection('resources');
		//console.log(newfrequency);
		frequencies[frequencies.length] = newfrequency; //console.log('==================\n'+frequencies);
		collection.update(query, {$set: {"frequencies": frequencies}} ,function (err, result) {
			if (err) { console.log(err);} 
			else {
				console.log('Updated data into the "resources" collection: ' + result);
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

