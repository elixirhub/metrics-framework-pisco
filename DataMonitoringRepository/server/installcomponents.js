var MC = require('../lib/managementcomponents.js');
var managementcomponents = new MC();
managementcomponents.installComponents(function(msg,response){
 if(response){console.log(msg);}
});
