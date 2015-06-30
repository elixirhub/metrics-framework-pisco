var ghdownload = require('github-download');
var DB = require('./database');
var npm = require("npm");
var exec = require('child_process').exec;
/**
 * Object to admin Components.
 * @constructor
 */
var Component = function () {}

/**
 * Component module.
 * @module lib/Component
 */

Component.prototype ={
 /**
 * Install the component and dependencies
 * @param {string} url - repository where the component is stored.
 * @param {list} dependencies - list of component dependencies.
 * @param {string} path - path where the component will be stored.
 * @param {function} callback - Callback function (return true or false).
 * @memberOf  Component
 */
  
  install: function (url,dependencies,path,callback) {
   
	ghdownload(url, path)
		.on('dir', function(dir) {
		  console.log(dir)
		})
		.on('file', function(file) {
		  console.log(file);callback(false);
		})
		.on('zip', function(zipUrl) { //only emitted if Github API limit is reached and the zip file is downloaded 
		  console.log(zipUrl)
		})
		.on('error', function(err) {
		  callback(false); 
		  console.error(err);
		})
		.on('end', function() {
			console.log( url + ' download into ' + path +' completed' );
			installdependencies(dependencies,callback);	
		})
 },
 
 
  /**
 * Execute one component
 * @param {string} executable - Executable path file.
 * @param {list} params - list of params used in the execution.
 * @param {JSON} resourceobject - resource to store into db.
 * @param {function} callback - Callback function (return true or false and value of this execution).
 * @memberOf  Component
 */
 run: function (executable,params,resourceobject,callback){
 	var component = this;
 	var command = 'node ' + executable;
 	params = params[0].parameter;
 	params.forEach(function(param, i) {
 		command += ' \"' + param + '\" ';
 	});//end forEach
 	console.log('Run command: ' + command);
 	exec(command, function(error, stdout, stderr) {
		
		//console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error); return callback(false);
		}else{
			var value = stdout.replace(/[^0-9]/g, "");
			var date = new Date();
			var fulldate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
			resourceobject.frequencies[0].value = value; 
			resourceobject.frequencies[0].date = fulldate;
			console.log('stdout: ' + stdout); 
			component.insert(resourceobject);
			return callback(true);
		}
		
	});	
 },
  /**
 * Insert this component data into db
 * @param {JSON} resource - new resource.
 * @memberOf  Component
 */
 insert: function (resource){
 	var db = new DB();
 	db.insert(resource);
 	
 	
 }
 
}
/** Do accesible module Component */
module.exports = Component;


function installdependencies(dependencies, callback) {
	var inserted = 0;
    var libraries = dependencies[0].library;
	libraries.forEach(function(library, i) {
		var library = libraries[i];
		console.log('installing library '+library);
		npm.load(function (err) {
		  if (err){ console.log(err); return callback(false);}
		  npm.commands.install([library], function (err, data) {
			if (err) { console.log(err); return callback(false);}
			console.log('Library '+library+' installed');
			if (++inserted == libraries.length) { callback(true);} //control asynchronous iteration
		  });
		  npm.registry.log.on("log", function (message) { 
			// console.log('installing library '+msg);}
		  });
		})//end npm.load
	});//end forEach
}


