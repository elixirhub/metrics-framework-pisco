<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >	
	<xsl:template match="/">
		<link rel="stylesheet" type="text/css" href="../stylesheets/style.css"/>
		<html>
			<body> 
				<script language="javascript" defer="true">
				  <xsl:comment>
					<![CDATA[ 
						var components={};
						components['selectedcomponents']={};
						var allcomponents = {}; 

						function createselectedcomponents(id,name, dependencies, repository, parameterid, frequencyid, resourceid, 				executableid, enableid, installedid,checkid) 
						{
							parameter = document.getElementById(parameterid).value;
							frequency = document.getElementById(frequencyid).value;
							resource = document.getElementById(resourceid).value;
							executable = document.getElementById(executableid).value;
							enable = document.getElementById(enableid).value;
							installed = document.getElementById(installedid).value;
							check = document.getElementById(checkid).checked;
							//alert(id + '-' + name + '-' + frequency + '-' + check );
							if(check){
								addcomponent(id, name, dependencies, repository, parameter, frequency, resource, executable, enable, installed);
							}else{
								delete allcomponents[id];
							}
							updateselectedcomponents();
							document.getElementById("componentsinput").value = JSON.stringify(components);
							
						 }

						function addcomponent(id, name, dependencies, repository, parameter, frequency, resource, executable, enable,  													installed)
						{	
							var component = {};
							component['component']={};
							component['component']['id']=id;
							component['component']['name']=name;
							component['component']['frequency']=frequency;
							component['component']['resource']=resource;
							component['component']['enable']=enable;
							component['component']['installed']=installed;
							component['component']['input']={};
							component['component']['input']['parameter']=parameter;
							component['component']['executable']=executable;	
							component['component']['dependencies']={};	
							component['component']['dependencies']['library']=dependencies;	
							component['component']['repository']=repository;
							allcomponents[id] = component;
						}

						function updateselectedcomponents(){
							components['selectedcomponents']={};
							for (var value in allcomponents){
								if(components.selectedcomponents.length == undefined){components.selectedcomponents = [allcomponents[value]]; }	
								else{ components.selectedcomponents.push(allcomponents[value]);	}	
							}
						}
	  

					]]> 
				 </xsl:comment>
				</script>
				<head><title>Manage Components</title></head>
				<div id="header">
					<div id="watermark" class="bgimgmanage">&#160;</div>
					<div id="subtitle"><h1>Available Components</h1></div>
				</div>
				<div>
					<table border="1">
						<tr bgcolor="#0066FF">
							<th>Id</th>
							<th>Name</th>
							<th>Dependencies</th>
							<th>Repository</th>
							<th>Input</th>
							<th>Frequency</th>
							<th>Resource</th>
							<th>Executable</th>
							<th>Eneable</th>
							<th>Installed</th>
							<th>Select</th>
						</tr>
						<xsl:for-each select="components_metrics/component">
							<tr>
								<!--variables declaration-->
								<xsl:variable name="id" select ="id"/>
								<xsl:variable name="name" select ="name"/>
								<xsl:variable name="parameter" select ="input/parameter"/>
								<xsl:variable name="dependencies" select ="dependencies/library"/>
								<xsl:variable name="repository" select ="repository"/>
								<xsl:variable name="resource" select ="resource"/>
								<xsl:variable name="executable" select ="executable"/>
								<xsl:variable name="enable" select ="enable"/>
								<xsl:variable name="installed" select ="installed"/>
								<!--end declaration-->

								<td><xsl:value-of select="id"/></td>
								<td><xsl:value-of select="name"/></td>
								<td><xsl:value-of select="dependencies/library"/></td>
								<td><xsl:value-of select="repository"/></td>
			
								<td>
									<input size='10' name="parameter{id}" type="text" id="parameter{id}" value="{input/parameter}"></input>
								</td>
								<td>
									<input size='10' name="newfreq{id}" type="text" id="newfreq{id}" value="{frequency}"></input>
								</td>
								<td>
									<input size='10' name="resource{id}" type="text" id="resource{id}" value="{resources/rsc}"></input>
								</td>
								<td>
									<input size='10' name="executable{id}" type="text" id="executable{id}" value=""></input>
								</td>
								<td>
									<input size='10' name="enable{id}" type="text" id="enable{id}" value="true"></input>
								</td>
								<td>
									<input size='10' name="installed{id}" type="text" id="installed{id}" value="false"></input>
								</td>
								<td><input name="check{id}" id="check{id}" type="checkbox" 
										onclick="createselectedcomponents('{$id}','{$name}','{$dependencies}','{$repository}', 'parameter{id}', 'newfreq{id}','resource{id}','executable{id}','enable{id}','installed{id}', 'check{id}')"/>
								</td>

								<!--<td>-->
								<!--<input id="createselected" name="createselected" onclick="createselectedcomponentsXML('{$component}')" type="button" value="Create Selected Components"/> -->
								<!--</td>-->
							</tr>
						</xsl:for-each>
					</table>
				</div>
				<div id="createselectedcomponentsXML">
						<h3>&#160;&#160;&#160;&#160;</h3>
						<form action="http://127.0.0.1:8083/createselectedcomponentsXML" method="post"> 
				  			<fieldset> 
								<input type="hidden" id="componentsinput" name="componentsinput" />
				      		<input type="submit" value="Select these components" />
				  			</fieldset>
				 		</form>
    			</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
