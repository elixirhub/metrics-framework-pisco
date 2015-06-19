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
	install: function(id, path, repository,dependencies,dataparsed) {
		var component = new COMPONENT();
		component.install(repository,dependencies,path, function(response){
			if (response){
				updateID(dataparsed,id);
			}
		});
					
	},
	/**
	* Install all components into selected componentes XML file 
	* @memberOf  ManagementComponents
	*/
	installComponents: function() {
		var management = this;
		var parser = new xml2js.Parser();
		fs.readFile(environmentconf.SELECTEDCOMPONENTSXML, function(err, data) {
			parser.parseString(data, function (err, dataparsed) {
				if (err) {consolo.log(err);}
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
						management.install(id,environmentconf.SOURCEPATH+'/'+id,repository,dependencies,dataparsed);
					}else{console.log('This component '+name+ ' is already installed or is not available');}	
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
function updateID(dataparsed,id){
	var builder = new xml2js.Builder();
	var finalcomponentsxml = builder.buildObject(dataparsed);
	
	fs.writeFile(environmentconf.SELECTEDCOMPONENTSXML,finalcomponentsxml, function (err) {
		if (err ) {console.log(err);}
		console.log('Component ' + id + ' has been updated in '+ environmentconf.SELECTEDCOMPONENTSXML);
	});//fs.writeFile end
}