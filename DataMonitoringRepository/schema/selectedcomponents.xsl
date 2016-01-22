<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >	
	<xsl:template match="/">
		<link rel="stylesheet" type="text/css" href="../stylesheets/style.css"/>
		<html>
			<body>
				<head><title>Monitoring Components</title></head>
				<div id="header">
					<div id="watermark" class="bgimgselected">&#160;</div>
					<div id="subtitle"><h1>Monitoring Components</h1></div>
				</div>
				<div>
					<table border="1">
						<tr bgcolor="#9acd32">
							<th>Id</th>
							<th>Name</th>
							<th>Frequency</th>
							<th>Input</th>
							<th>Resource</th>
							<th>Action</th>
						</tr>
						<xsl:for-each select="selectedcomponents/component">
							<tr>
								<!--variables declaration-->
								<xsl:variable name="id" select ="id"/>
								<!--end declaration-->

								<td>
									<xsl:value-of select="id"/>
								</td>
								<td>
									<xsl:value-of select="name"/> 
								</td>
								<td>
									<input name="frequency" type="text" id="frequency" value="{frequency}"></input>
								</td>
								<td>
									<input size='50' name="input" type="text" id="frequency" value="{input}"></input>
								</td>
								<td>
									<input size='10' name="resource" type="text" id="frequency" value="{resource}"></input>
								</td>
								<td>
									<div id="actions" class="columns">
										<div id="install" class="white">
										  <form action="http://127.0.0.1:8083/install" method="post">
											 <fieldset>
												<input type="image" src="images/install-button.jpg" alt="install" title="install component" class="button"/>
											 </fieldset>
										  </form>
										</div>
										<div id="run" class="white">
										  <form action="http://127.0.0.1:8083/run" method="post">
											 <fieldset>
												<input type="image" src="images/run-button.jpg" alt="run" title="run component" class="button"/>
											 </fieldset>
										  </form>
							  			</div>
										<div id="monitoring" class="white">
											 <form action="http://127.0.0.1:8083/monitoring" method="post">
												<fieldset style="height:15px">
												  <input type="hidden" id="idcomponent" name="idcomponent" value="{id}"/>
												  <input type="image" src="images/monitoring-button.jpg" alt="monitoring" title="monitoring component" class="button"/>
												</fieldset>
											 </form>
						 			 	</div>	
							 		</div>
							 		<div class="clear"/>
								</td>
							</tr>

						</xsl:for-each>
					</table>
				</div>
				<div><h2>Output</h2></div>
				<div id="results" >
				 	<textarea name="outputtext" rows="10" cols="212">{{data}}</textarea> 
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
