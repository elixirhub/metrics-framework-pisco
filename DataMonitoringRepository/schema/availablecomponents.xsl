<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >	
	<xsl:template match="/">
		<html lang="en">
		  <head>
			 <meta charset="utf-8"/>
			 <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
			 <meta name="viewport" content="width=device-width, initial-scale=1"/>
			 <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
			 <meta name="description" content=""/>
			 <meta name="author" content=""/>
			 <link rel="icon" href="icons/metrics.ico"/>
			 <title>PIsCO</title>
			 <!-- Bootstrap core CSS -->
			<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css"/>
			
			 <!-- Custom styles for this template -->
			 <link href="bootstrap/css/metrics-template.css" rel="stylesheet"/>
			<!--Bootstrap and jqueri JS-->
			<script src="js/jquery.min.js"></script>
			<script src="bootstrap/js/bootstrap.min.js">
			<xsl:comment><![CDATA[ ]]></xsl:comment>
			</script>
			 

			<script type="text/javascript">
				 jQuery(function ($) {
					  $('.panel-heading span.clickable').on("click", function (e) {
						   if ($(this).hasClass('panel-collapsed')) {
						       // expand the panel
						       $(this).parents('.panel').find('.panel-body').slideDown();
						       $(this).removeClass('panel-collapsed');
						       $(this).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
						   }
						   else {
						       // collapse the panel
						       $(this).parents('.panel').find('.panel-body').slideUp();
						       $(this).addClass('panel-collapsed');
						       $(this).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
						   }
					  });
				 });
				$(document).ready(function () {
					 $('.panel-heading span.clickable').click();
					 $('.panel div.clickable').click();
				});

				 	
			</script>

		  </head>
		  <body>

			 <nav class="navbar navbar-inverse navbar-fixed-top">
				<div class="container">
				  <div class="navbar-header">
				    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
				      <span class="sr-only">Toggle navigation</span>
				      <span class="icon-bar"></span>
				      <span class="icon-bar"></span>
				      <span class="icon-bar"></span>
				    </button>
				    <a class="navbar-brand" href="#">PIsCO framework</a>
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
			  	<div class="page-header">
				  <h1>Collection of Biological Resource Metrics </h1>
				</div>
				<xsl:for-each select="availablecomponents/component">
					<div class="row row-eq-height">
					  <!--variables declaration-->
						<xsl:variable name="id" select ="id"/>
					  <!--end declaration-->
					  <div class="col-md-8">
						<form method="post" action="http://127.0.0.1:8083/metricdetail">
							<button type="summit" class="btn btn-link">
								<xsl:value-of select="name"/>&#160;(<xsl:value-of select="resource/name"/>)
							</button>
							<div class="panel panel-default">
								<div class="panel-heading">
									<h3 class="panel-title"><xsl:value-of select="description"/></h3>
										<span class="pull-right clickable"><i class="glyphicon glyphicon-chevron-up">&#160;</i></span>
								</div>
								<div class="panel-body">
									<p><b>API:</b>&#160;<xsl:value-of select="detail/api"/></p>
									<p><b>Query:&#160;</b><xsl:value-of select="detail/query"/></p>
									<p><b>Output:&#160;</b><xsl:value-of select="detail/output"/></p>
								</div>
							</div>
							<input type="hidden" id="name" name="name" value="{name}"/>
							<input type="hidden" id="description" name="description" value="{description}"/>
							<input type="hidden" id="resourcename" name="resourcename" value="{resource/name}"/>
					  		<input type="hidden" id="resourcetype" name="resourcetype" value="{resource/type}"/>
					  		<input type="hidden" id="idcomponent" name="idcomponent" value="{id}"/>
						</form>
					  </div>
					  <div class="col-md-4">
							<p>Resource name: <b><xsl:value-of select="resource/name"/></b></p>
							<p>Resource type: <b><xsl:value-of select="resource/type"/></b></p>
							<p>Monitoring records: <b><xsl:value-of select="records"/></b></p>
					  </div>
					</div> <!-- /.row -->
				</xsl:for-each>
				<button type="button" class="btn btn-lg btn-primary">Download all data</button>
				<button type="button" class="btn btn-lg btn-info" onclick="location.href='http://127.0.0.1:8083/monitoringallmetrics';">Monitoring metrics</button>
			 </div><!-- /.container -->

		  </body>
		</html>
	</xsl:template>
</xsl:stylesheet>
