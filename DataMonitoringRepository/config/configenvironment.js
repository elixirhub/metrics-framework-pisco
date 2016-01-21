var YEAR = 'year'
	,MONTH = 'month'
	,WEAK = 'weak'
	,DAY = 'day'
	,HOUR = 'hour'
	,MINUTE = 'minute'
	,SECOND = 'second'
	,YEARLY = 'yearly'
	,MONTHLY = 'monthly'
	,WEAKLY = 'weakly'
	,DAILY = 'daily';
/**
This hash is used to get the Cron format for the Time interval to execute a component
**/	
module.exports.frequency = {};
exports.frequency[YEAR] 	= 	'0 0 0 1 1 *';
exports.frequency[YEARLY] 	= 	'0 0 0 1 1 *';
exports.frequency[MONTH] 	=	'0 0 0 1 * *';
exports.frequency[MONTHLY] 	=	'0 0 0 1 * *';
exports.frequency[WEAK] 	= 	'0 0 0 * * 1';
exports.frequency[WEAKLY] 	= 	'0 0 0 * * 1';
exports.frequency[DAY] 		= 	'0 0 0 * * *';
exports.frequency[DAILY]	= 	'0 0 0 * * *';
exports.frequency[HOUR] 	= 	'0 0 * * * *';
exports.frequency[MINUTE] 	= 	'0 */5 * * * *';
exports.frequency[SECOND] 	= 	'* * * * * *';
/**
Acces to metadata files and paths
**/	

module.exports.SOURCEPATH = '../components';
module.exports.SELECTEDCOMPONENTSXML = '../schema/selectedcomponents.xml';
module.exports.SELECTEDCOMPONENTSXSD = '../schema/selectedcomponents.xsd';
module.exports.SELECTEDCOMPONENTSXSL = '../schema/selectedcomponents.xsl';
module.exports.SELECTEDCOMPONENTSHTML = '../views/selectedcomponents.html';

module.exports.AVAILABLECOMPONENTSXML = '../schema/availablecomponents.xml';
module.exports.AVAILABLECOMPONENTSXSL = '../schema/availablecomponents.xsl';
module.exports.AVAILABLECOMPONENTSHTML = '../views/availablecomponents.html'

/***  Environment variables to create manage selected components HTM fron components registry ***/
module.exports.MANAGECOMPONENTSHTML = '../views/managecomponents.html';
module.exports.REGISTRYTOSELECTEDCOMPONENTSXSL = '../schema/registrytoselectedcomponents.xsl';
module.exports.REGISTRYSCHEMAXML = '../../ComponentsRegistry/schema/registryschema.xml';



