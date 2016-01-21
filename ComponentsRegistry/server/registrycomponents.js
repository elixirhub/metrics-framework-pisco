var SCH = require('../lib/schema')
  , schema = false
  , child
  , schema = new SCH();

  schema.verify('https://raw.githubusercontent.com/elixirhub/metrics-module-tweets/master/schema.xml', function (xmldata,verify){	
		console.log('schema verified: '+verify);
		if (verify) {
		schema.addcomponent( xmldata, function (add){
				if (add) {
					schema.createregistryHTML(function (created){
						if(created) {console.log('create HTML');}
					});
				}
			});
		}
	 });	

