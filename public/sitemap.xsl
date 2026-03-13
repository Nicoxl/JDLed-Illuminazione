<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/授業/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>XML Sitemap - JDLed</title>
				<style type="text/css">
					body { font-family: sans-serif; font-size: 14px; color: #333; }
					table { border-collapse: collapse; width: 100%; }
					th { background: #8c6f4d; color: #fff; text-align: left; padding: 10px; }
					td { padding: 8px; border-bottom: 1px solid #eee; }
					tr:hover { background: #f9f9f9; }
                    a { color: #8c6f4d; text-decoration: none; }
				</style>
			</head>
			<body>
				<h1>XML Sitemap</h1>
				<table>
					<tr>
						<th>URL</th>
						<th>Priority</th>
						<th>Last Mod</th>
					</tr>
					<xsl:for-each select="sitemap:urlset/sitemap:url">
						<tr>
							<td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
							<td><xsl:value-of select="sitemap:priority"/></td>
							<td><xsl:value-of select="sitemap:lastmod"/></td>
						</tr>
					</xsl:for-each>
				</table>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>