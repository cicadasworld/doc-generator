#include "cgis_parsequeryfilter.h"
#include "../vecdatadef.h"
#include "../dataconvert/cgis_dataconvert.h"

#include "giae/gis_vector_format_type_def.h"
#include "project/igis_spatialreference.h"
#include "giae/igis_fieldsinfo.h"
#include "giae/igis_queryfilter.h"
#include "giae/igis_featureset.h"
#include "giae/igis_feature.h"
#include "common/igis_geopolygon.h"
#include "common/igis_georect.h"
#include "project/gis_projectioncomtypedef.h"
#include "project/igis_spatialreferencefactory.h"

#include "../base/rectdo.h"
namespace platon{

CGIS_ParseQueryFilter::CGIS_ParseQueryFilter(void)
{

}
CGIS_ParseQueryFilter::~CGIS_ParseQueryFilter(void)
{
}

/*
{
"spatialFilter":{
"spatialRelation":{
"spatialOperator": "Intersects", 
"geometry":{"coordinates":[[0,0],[100,0],[100, 90],[0,90],[0,0]],"type":"Polygon"}
},
"bbox":[0,-50,100,50],
"function":""
},
"responseInfoRequirement":{
"isLoadGeometry": true,
"propertyNames":["F_NAME"]
}
}
*/
_SpatialFilter* CGIS_ParseQueryFilter::parseSpatialFilter(JsonNode* treeNode)
{	
	_SpatialFilter *spatialobj = new _SpatialFilter();

	IGIS_GeoRect* pRect = NULL;
	JsonNode* boundNode = treeNode->get(NODE_BBOX);
	
	if (boundNode != NULL)
	{
		CGIS_DataConvert::bboxToRect(boundNode,pRect);
	}
	IGIS_GeoBase* baseGeo =NULL;
	JsonNode* relationNode = treeNode->get(NODE_SPATIALRELATION) ;
	if (relationNode != NULL)
	{
		String strMode = (relationNode->get(NODE_SPATIALOPERATOR))->asString() ;
		spatialobj->nSpatialMode = CGIS_DataConvert::spatialOperatorToInt(strMode);
		JsonNode* geoNode = relationNode->get(NODE_GEOMETRY);
		CGIS_DataConvert::convert(geoNode,baseGeo);
	}
	JsonNode*  functionNode = treeNode->get(NODE_FUNCTION);
	if (functionNode != NULL)
	{
		String str = functionNode->asString();
		str.replace("area","F_AREA");
		str.replace("length","F_PERIMETER");
		spatialobj->strFunction = str;
	}
	spatialobj->pSpatialGeo = baseGeo;
	spatialobj->pBbox = pRect;
	
	return spatialobj;
}
/*
{
	"propertyQueryFilter":{
		"bbox":[91,29,92,30],
			" propertyFilter":"F_NAME='拉萨' and F_ADCLASS=2"
	}
	,
		"responseinforequirement":{
			"isLoadGeometry": true,
				"propertyNames":["F_NAME"]
	}
}
*/
_PropertyFilter* platon::CGIS_ParseQueryFilter::parsePropertyFilter(JsonNode* treeNode)
{
	_PropertyFilter* pPropertyFilter = new _PropertyFilter();
	
	IGIS_GeoRect* pRect = NULL;
	JsonNode* boundNode = treeNode->get(NODE_BBOX);

	if (boundNode != NULL)
	{
		CGIS_DataConvert::bboxToRect(boundNode,pRect);
	}

	JsonNode* propertyNode = treeNode->get(NODE_PROPERTYFILTER);
	if (propertyNode != NULL)
	{
		pPropertyFilter->strSQLFilter = propertyNode->asString() ;
	}
	pPropertyFilter->pBbox = pRect;

	return pPropertyFilter;
}
/*
{
	"spatialPropertyFilter":{
		"spatialFilter":{
			"bbox":[],
				"spatialRelation":{},
				"function": ""
		},
		"propertyFilter":"" ,
		"logicalOperator": "" //And  Or  没有Not
	},
	"responseinforequirement":{
		"isLoadGeometry": true,
			"propertyNames":["F_NAME"]
			}
}*/

_SpatialPropertyFilter* platon::CGIS_ParseQueryFilter::parseSpatialPropertyFilter(JsonNode* treeNode)
{
	_SpatialPropertyFilter* pFilter = new _SpatialPropertyFilter();
	JsonNode* pSpatialNode = treeNode->get(NODE_SPATIALFILTER);
	pFilter->pSpatial = parseSpatialFilter(pSpatialNode);

	JsonNode* propertyNode = treeNode->get(NODE_PROPERTYFILTER);
	if (propertyNode != NULL)
	{
		pFilter->strSQLFilter = propertyNode->asString() ;
	}
	JsonNode* pLogicalNode = treeNode->get(NODE_LOAGICALOP);
	if (pLogicalNode != NULL)
	{
		pFilter->strLogicalOp = pLogicalNode->asString() ;
	} 
	return pFilter;
}

_MultiFilter* CGIS_ParseQueryFilter::parseMultiFilter(JsonNode* treeNode)
{
	_MultiFilter* pFilter = new _MultiFilter();
	JsonNode* pLogicalNode = treeNode->get(NODE_LOAGICALOP);
	if (pLogicalNode != NULL)
	{
		pFilter->strLogicalOp = pLogicalNode->asString() ;
	} 
	JsonNode* pSubNode = treeNode->get(NODE_SUBFILTERS);
	if (pSubNode != NULL)
	{
		getSubFilter(pSubNode,pFilter->sub);
	} 
	return pFilter;
}

void CGIS_ParseQueryFilter::getSubFilter(JsonNode* subNode,vector <_SubFilter*>& sub)
{

	for (int i=0; i<subNode->size();i++)
	{//循环处理
		JsonNode* node = (*subNode)[i];

		_SubFilter* pSubFilter = new _SubFilter();

		JsonNode* pSpatialNode = subNode->get(NODE_SPATIALFILTER);
		_SpatialFilter* pSpatial = parseSpatialFilter(pSpatialNode);
		JsonNode* propertyNode = subNode->get(NODE_PROPERTYFILTER);
		if (propertyNode != NULL)
		{
			pSubFilter->strSQLFilter = propertyNode->asString() ;
		} 
		JsonNode* pLogicalNode = subNode->get(NODE_LOAGICALOP);
		if (pLogicalNode != NULL)
		{
			pSubFilter->strLogicalOp = pLogicalNode->asString() ;
		} 
		JsonNode* pSubNodeTemp = subNode->get(NODE_SUBFILTERS);
		if ( pSubNodeTemp != NULL)
		{
			getSubFilter(pSubNodeTemp,pSubFilter->sub);
		}
		sub.push_back(pSubFilter);
	}

	

	
	
}

}