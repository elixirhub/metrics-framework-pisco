var fs = require('fs')
	,environmentconf = require('../config/configenvironment.js')
    ,xml2js = require('xml2js')
    ,COMPONENT = require('./component');
    
				


/**
 * Object to admin Components installation.
 * @constructor
 */
var ManagementComponents = function () { 
	 this.listcomponents = []; 
}

/**
 * ManagementComponents module.
 * @module lib/ManagementComponents
 */

 ManagementComponents.prototype ={
 	/**
	* Install one component
	* @param {string} id - Component ID.
	* @param {string} path - Location of this installation.
	* @param {string} repository - URL where the component is stored.
	* @param {object} dependencies - Library list of dependencies.
	* @param {object} dataparsed - Updated component metadata.
	* @memberOf  ManagementComponents
	*/
	install: function(id, path, repository,dependencies,dataparsed,callback) {
		var component = new COMPONENT();
		component.install(repository,dependencies,path, function(msg,response){
			if (response){
				updateID(dataparsed,id,msg,callback);
			}
		});
					
	},
	/**
	* Install all components into selected componentes XML file 
	* @param {function} callback - Callback function (return true or false).
	* @memberOf  ManagementComponents
	*/
	installComponents: function(callback) {
		var management = this;
		var parser = new xml2js.Parser();
		fs.readFile(environmentconf.SELECTEDCOMPONENTSXML, function(err, data) {
			parser.parseString(data, function (err, dataparsed) {
				if (err) {callback(err,false);}
				for(var i = 0; i < dataparsed.selectedcomponents.component.length; i++) {
					var repository = ''; repository += dataparsed.selectedcomponents.component[i].repository;
					var name = dataparsed.selectedcomponents.component[i].name;
					var installed = dataparsed.selectedcomponents.component[i].installed;
					var enable = dataparsed.selectedcomponents.component[i].enable;
					var dependencies = dataparsed.selectedcomponents.component[i].dependencies;
					//console.log(dependencies);
					if(installed == 'false' && enable == 'true') {
						var id = dataparsed.selectedcomponents.component[i].id;
						dataparsed.selectedcomponents.component[i].installed = 'true';
						management.install(id,environmentconf.SOURCEPATH+'/'+id,repository,dependencies,dataparsed,callback);
					}else{callback('This component '+name+ ' is already installed or is not available',true);}	
				 } // for end 
			});//parser.parseString end
		}); //fs.readFile end
	},
	

}
/** Do accesible module ManagementComponents */
module.exports = ManagementComponents;


/**
* Update the component metadata
* @param {string} id - Component ID.
* @param {object} dataparsed - Updated component metadata.
*/
function updateID(dataparsed,id,msg,callback){
	var builder = new xml2js.Builder();
	var finalcomponentsxml = builder.buildObject(dataparsed);
	
	fs.writeFile(environmentconf.SELECTEDCOMPONENTSXML,finalcomponentsxml, function (err) {
		if (err ) {callback(err,false);}
		//console.log('Component ' + id + ' has been updated in '+ environmentconf.SELECTEDCOMPONENTSXML);
		msg += 'Component ' + id + ' has been installed\n';
		callback(msg,true);
	});//fs.writeFile end
}
