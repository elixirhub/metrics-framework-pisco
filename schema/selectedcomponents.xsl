<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<body>
				<h2>Selected Components</h2>
				<table border="1">
					<tr bgcolor="#9acd32">
						<th>Id</th>
						<th>Name</th>
						<th>Frequency</th>
						<th>Input</th>
						<th>Repository</th>
					</tr>
					<xsl:for-each select="selectedcomponents/component">
						<tr>
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
								<input size='60' name="frequency" type="text" id="frequency" value="{input}"></input>
							</td>
							<td>
								<input size='100' name="frequency" type="text" id="frequency" value="{repository}"></input>
							</td>
						</tr>
					</xsl:for-each>
				</table>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>