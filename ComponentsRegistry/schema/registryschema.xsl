<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<link rel="stylesheet" type="text/css" href="../stylesheets/style.css"/>
		<html>
			<body>
				<head>
					<meta charset="utf-8"/>
					<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
					<meta name="viewport" content="width=device-width, initial-scale=1"/>
					<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
					<meta name="description" content=""/>
					<meta name="author" content=""/>
					<link rel="icon" href="icons/registry.ico"/>
				 	<title>Component Registry</title>
					<!-- Bootstrap core CSS -->
					<link href="bootstrap/dist/css/bootstrap.min.css" rel="stylesheet"/>

					<!-- Custom styles for this template -->
					<link href="bootstrap/registry-template.css" rel="stylesheet"/>

					<!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
					<!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
					<script src="bootstrap/assets/js/ie-emulation-modes-warning.js"><xsl:comment><![CDATA[ ]]></xsl:comment></script>
					<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
					<!--[if lt IE 9]>
					<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
					<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
					 <![endif]-->
				</head>
				<nav class="navbar navbar-inverse navbar-fixed-top">
					<div class="container">
					  <div class="navbar-header">
						 <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
						   <span class="sr-only">Toggle navigation</span>
						   <span class="icon-bar"></span>
						   <span class="icon-bar"></span>
						   <span class="icon-bar"></span>
						 </button>
						 <a class="navbar-brand" href="#">Metrics Registry</a>
					  </div>
					  <div id="navbar" class="collapse navbar-collapse">
						 <ul class="nav navbar-nav">
						   <li class="active"><a href="#">Home</a></li>
						   <li><a href="#about">About</a></li>
						   <li><a href="#contact">Contact</a></li>
						 </ul>
					  </div><!--/.nav-collapse -->
					</div>
			 	</nav>
				<!--/.container -->
			   <div class="container">
					<div class="page-header"><h1>Component Registry</h1></div>
					<div id="well" >
						<form action="http://127.0.0.1:8082/registercomponent" method="post"> 
								<label for="schema">URL Component Schema:</label>
								<input type="text" id="schema" name="schema" placeholder="Enter the URL for the component to register" size='100'/>
								<button type="submit" class = "btn btn-default btn-sm active">Register</button>								
								<span class="help-block">Example: https://raw.githubusercontent.com/project/metrics-module/master/schema.xml</span>
						</form>
					</div>
					<div class="page-header"><h2></h2></div>
					<table class="table table-striped">
						<thead>
							<tr>
								<th>Name</th>
								<th>Description</th>
								<th>Authors</th>
								<th>Frequency</th>
								<th>Repository</th>
							</tr>
						</thead>
						<xsl:for-each select="components_metrics/component">
							<tr>
								<td>
									<xsl:value-of select="name"/>
								</td>
								<td>
									<xsl:value-of select="description"/>
								</td>
								<td>
									<xsl:value-of select="authors"/>
								</td>
								<td>
									<xsl:value-of select="frequency"/>
								</td>
								<td>
									<xsl:value-of select="repository"/>
								</td>
							</tr>
						</xsl:for-each>
					</table>
			 </div><!-- /.container -->
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
