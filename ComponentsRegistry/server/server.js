var fs = require('fs')
	,express = require('express')
	,bodyParser = require('body-parser');
var IR = require('../lib/interfaceregistry')
	,interfaceregistry = new IR();
	
var app = express();

app.use(express.static("../public")); //put accesible public directory and its sub directories
app.set('views',  '../views'); //put accesible views

app.disable('etag');

var hbs = require('hbs');//Handlebars
app.set('view engine', 'html'); //we can tell Express to treat HTML files as dynamic by using the "view engine"
app.engine('html', hbs.__express);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//***Show all the components registered and let us to register a new component**/
app.get('/register', function(req, res) {
	createregistryHTML(); // this function is provisional
	res.render('registry.html');
});

//*** registry component acction send from /register***//
app.post('/registercomponent', function(req, res) {
  //res.send('You sent the URL "' + req.body.schema + '".');
  interfaceregistry.register(req.body.schema, function (response){
  	if(response) { res.redirect('/register'); }
  	else  {res.send('There was a problem with the component registration.');}
  });
});

app.listen(8082, function() {
  console.log('Server running at http://127.0.0.1:8082');
})


function createregistryHTML(){

	var libxslt = require('libxslt')
		,libxmljs = require('libxmljs')
		,schemaconfig = require ('../config/configschema');

	var xhtml = schemaconfig.SCHEMAHTML;
	var encoding = 'utf8';

	var docSource = fs.readFileSync(schemaconfig.SCHEMAXML, encoding);  
	var stylesheetSource = fs.readFileSync(schemaconfig.SCHEMAXSL, encoding);

	var stylesheet = libxslt.parse(stylesheetSource);
	var result = stylesheet.apply(docSource);

	//console.log(result);

	fs.writeFile(xhtml , result, encoding, function (err) {
				if (err) return console.log(err);
				else {console.log('data save into > ' + xhtml);}
	});

}

//fs.readFile('../public/register.html', function(err, page) {
//        res.writeHead(200, {'Content-Type': 'text/html'});
//        res.write(page);
//        res.end();
//    });

