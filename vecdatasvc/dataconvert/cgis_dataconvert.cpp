#include "cgis_dataconvert.h"
#include "../vecdatadef.h"

#include "project/igis_spatialreferencefactory.h"
#include "project/igis_spatialreference.h"
#include "common/igis_geopolygon.h"
#include "common/igis_geopolyline.h"
#include "common/igis_geopoint.h"
#include "common/igis_georect.h"
#include "../base/rectdo.h"
#include "../base/geopointdo.h"
#include "../base/geolinestringdo.h"
#include "../base/geopolygondo.h"
#include "../base/georectdo.h"


#include "giae/igis_featureattribute.h"
#include "giae/igis_fieldsinfo.h"

using namespace gtcloud::geodata::vecdatasvc::pdo;
namespace platon{


CGIS_DataConvert::CGIS_DataConvert(void)
{

}

CGIS_DataConvert::~CGIS_DataConvert(void)
{

}

bool CGIS_DataConvert::convert(IGIS_Feature* pFeature, JsonNode* outputJsonTree, const map<String,int>& propertymap, double dFactor, bool bLoadGeo, const char*propertyNames )
{
	int nType = pFeature->GetGeoType();
	IGIS_GeoBase* pGeo = NULL;
	int nPointCount = 0;
	SGIS_Point* pPoints = NULL;
	GeoPolygon polygon;
	GeoLineString linestring;
	GeoPoint point;
	GeoRect rect;
	//JsonNode* outputJsonTree = NULL;
	JsonNode* geometryNode =NULL;
	JsonNode* propertyNode = JsonNode::createInstance(JsonNode::VALUE_TYPE_OBJECT);
	String strGeo,strProperties;
	int nCount=0;
	switch(nType){
	case GIS_POLYGON:
		{
			pGeo = (IGIS_GeoPolygon*)(pFeature->GetGeoPtr());
			nPointCount = pGeo->GetPointCount();
			pPoints = new SGIS_Point[nPointCount];
			pGeo->GetPoints(nPointCount,pPoints);
			Coordinates coords;
			for (int i=0;i<nPointCount; i++)
			{
				coords.append(Point(pPoints[i].x/dFactor,pPoints[i].y/dFactor));
			}
			polygon.coordinates.append(coords);
			polygon.type = POLYGON;
			//freezable = polygon.clone();
			polygon.freezeToJSON(geometryNode);
			delete []pPoints;

			getPropertyFromFeature(pFeature,propertyNode,propertymap,propertyNames);
			break;
		}
	case GIS_POLYLINE:
		{
			pGeo = (IGIS_GeoPolyLine*)(pFeature->GetGeoPtr());
			nPointCount = pGeo->GetPointCount();
			pPoints = new SGIS_Point[nPointCount];
			pGeo->GetPoints(nPointCount,pPoints);
			for (int i=0;i<nPointCount; i++)
			{
				linestring.coordinates.append(Point(pPoints[i].x/dFactor,pPoints[i].y/dFactor));
			}
			linestring.type = POLYLINE;
			//freezable = linestring.clone();
			linestring.freezeToJSON(geometryNode);
			//strGeo = outputJsonTree->asString();
			delete []pPoints;
			
			getPropertyFromFeature(pFeature,propertyNode,propertymap,propertyNames);
			break;
		}
	case GIS_POINT:
		{
			pGeo = (IGIS_GeoPoint*)(pFeature->GetGeoPtr());
			nPointCount = pGeo->GetPointCount();
			pPoints = new SGIS_Point[nPointCount];
			pGeo->GetPoints(nPointCount,pPoints);
			for (int i=0;i<nPointCount; i++)
			{
				point.coordinates.append(pPoints[i].x/dFactor);
				point.coordinates.append(pPoints[i].y/dFactor);
			}
			point.type = POINT;
			//freezable = point.clone();
			point.freezeToJSON(geometryNode);
			//strGeo = outputJsonTree->asString();
			delete []pPoints;

			getPropertyFromFeature(pFeature,propertyNode,propertymap,propertyNames);
			break;
		}
	case GIS_RECT:
		{
			pGeo = (IGIS_GeoRect*)(pFeature->GetGeoPtr());
			nPointCount = pGeo->GetPointCount();
			pPoints = new SGIS_Point[nPointCount];
			pGeo->GetPoints(nPointCount,pPoints);
			for (int i=0;i<nPointCount; i++)
			{
				rect.coordinates.append(Point(pPoints[i].x/dFactor,pPoints[i].y/dFactor));
			}
			rect.type = RECT;
			//freezable = rect.clone();

			rect.freezeToJSON(geometryNode);
			//strGeo = outputJsonTree->asString();
			delete []pPoints;

			getPropertyFromFeature(pFeature,propertyNode,propertymap,propertyNames);
			break;
		}
	case GIS_ELLIPSE:
		{
			break;
		}
	case GIS_ELLIPSELINE:
		{
			break;
		}
	case GIS_SURFACE:
		{
			break;
		}
	case GIS_MULTIPOINT:
		{
			break;
		}
	case GIS_MULTILINE:
		{
			break;
		}
	case GIS_MULTISURFACE:
		{
			break;
		}
	 default:
		break;
	}
	int id = pFeature->GetID();
	if (bLoadGeo && geometryNode != NULL)
	{
		outputJsonTree->put(NODE_GEOMETRY,geometryNode);
	}
	if (propertyNames == NULL && propertyNode != NULL)
	{
		outputJsonTree->put(NODE_PROPERTIES,propertyNode);
	}else 
	{
		String str(propertyNames);
		if (str.length() > 0 && propertyNode != NULL)
		{
			outputJsonTree->put(NODE_PROPERTIES,propertyNode);
		}
	}
	outputJsonTree->put(NODE_FEATUREID,JsonNode::createInstance(id));

	return true;
}

bool CGIS_DataConvert::bboxToRect(JsonNode* geoNode,IGIS_GeoRect*& baseGeo)
{
	IGIS_SpatialReferenceFactory* spatialRefFactory = GIS_GetSpatialReferenceFactoryObject();
	IGIS_SpatialReference* spitalRef =spatialRefFactory->GetPredefinedSpatialReferenceByIndex(GIS_CGCS2000_SPATIALREFERENCE_INDEX);
	double dFactor = spitalRef->GetXYScaleFactor();
	baseGeo = GIS_CreateGeoRectObject(spitalRef, 2);
	bool bStatus = true;
	if (baseGeo == NULL)
	{
		return false;
	}
	if (geoNode != NULL && geoNode->size()==4)
	{
		// SGIS_Rect(int iLeft, int iTop, int iRight, int iBottom)
		//JsonNode* left = (*geoNode)[0], *bottom =(*geoNode)[0], *right = (*geoNode)[0], *top = (*geoNode)[0];
		SGIS_Rect rc(((*geoNode)[0])->asDouble() * dFactor,((*geoNode)[3])->asDouble() * dFactor,((*geoNode)[2])->asDouble() * dFactor,((*geoNode)[1])->asDouble() * dFactor);

		baseGeo->SetRect(rc);
	}
	else{
		delete baseGeo;
		baseGeo = NULL;
		bStatus = false;
	}

	//spitalRef->Release();异常
	
	return bStatus;
}

bool platon::CGIS_DataConvert::stringSeqToString(const StringSeq& strArray,String& out)
{
	out ="";
	int i=0;
	if (strArray.size()>0)
	{
		for (;i<strArray.size()-1;i++)
		{		
			out += strArray[i];
			out += ",";
		}
		out += strArray[i];

		return true;
	}

	return false;
}


int platon::CGIS_DataConvert::spatialOperatorToInt(const String & strOperator)
{
	if (strOperator.equals("Intersects"))
	{
		return GIS_SPATIAL_INTERSECT;
	}
	else if(strOperator.equals("Within"))
	{
		return GIS_SPATIAL_WITHIN;
	}
	else if(strOperator.equals("Disjoint"))
	{
		return GIS_SPATIAL_DISJOINT;
	}
	else if(strOperator.equals("Equals"))
	{
		return GIS_SPATIAL_EQUAL;
	}
	else if(strOperator.equals("Contains"))
	{
		return GIS_SPATIAL_CONTAIN;
	}
	else if(strOperator.equals("Crosses"))
	{
		return GIS_SPATIAL_CROSS;
	}
	else if(strOperator.equals("Touches"))
	{
		return GIS_SPATIAL_TOUCH;
	}
	else if(strOperator.equals("Overlaps"))
	{
		return GIS_SPATIAL_OVERLAP;
	}
	else if(strOperator.equals("DWithin"))
	{
		return 0;//暂时没有支持
	}
	else
		return 0;

}

platon::JsonNode* CGIS_DataConvert::getValueAsJsonNode(const String& strFieldName, const map<String,int>& propertymap, IGIS_FeatureAttribute* attr)
{
	int nDatatype = propertymap.at(strFieldName);
	JsonNode* pNode = NULL;
	//if (strFieldName.equals("DEM"))
	//{
	//	return pNode;
	//}
	switch(nDatatype)
	{
	case GIS_INTEGER:
		{//INT_MIN
			int value = attr->GetIntByName(strFieldName);
			pNode = JsonNode::createInstance(value);
			break;
		}
	case GIS_DOUBLE:
		{
			double value = attr->GetDoubleByName(strFieldName);// -DBL_MAX
			pNode = JsonNode::createInstance(value);
			break;
		}
	case GIS_STRING:
		{
			String value = attr->GetStringByName(strFieldName);
			pNode = JsonNode::createInstance(value);
			break;
		}
	case GIS_BOOL:
		{
			bool value = attr->GetBoolByName(strFieldName);
			pNode = JsonNode::createInstance(value);
			break;
		}
	default:
		break;
	}
	return pNode;
}

bool CGIS_DataConvert::getPropertyFromFeature(IGIS_Feature* pFeature, JsonNode*& outputJsonTree,const map<String,int>& propertymap, const char*propertyNames )
{//此处应该是 判断 类型， 比如int类型 string类型 形成json时的引号问题
	IGIS_FeatureAttribute* attr = pFeature->GetAttrPtr();
	if (attr ==NULL)
	{
		return false;
	}
	IGIS_FieldsInfo* pFileds = attr->GetFieldsInfoPtr();
	int nCount= pFileds->GetFieldCount();

	//char *value = new char[LEN_PROPERTYVALUE];
	if (propertyNames == NULL)//load 全部
	{
		for (int i=0;i<nCount; i++)
		{
			//memset(value,0,LEN_PROPERTYVALUE);
			String strFieldName =pFileds->GetFieldNameByIndex(i);
			//attr->GetValueAsStringByName(strFieldName,value,LEN_PROPERTYVALUE);
			//String valuestr(value);
			//valuestr.trim();
			//outputJsonTree->put(strFieldName,JsonNode::createInstance(valuestr));
			outputJsonTree->put(strFieldName,getValueAsJsonNode(strFieldName,propertymap,attr));
		}
	}
	else if (propertyNames != '\0'){
		String strProperties(propertyNames);
		for (int i=0;i<nCount; i++)
		{
			//memset(value,0,LEN_PROPERTYVALUE);
			String strFieldName =pFileds->GetFieldNameByIndex(i);
			if ( VecDataUtil::isContainSubString(strProperties,strFieldName))
			{
				//attr->GetValueAsStringByName(strFieldName,value,LEN_PROPERTYVALUE);
				//String valuestr(value);
				//valuestr.trim();
				//outputJsonTree->put(strFieldName,JsonNode::createInstance(valuestr));
				outputJsonTree->put(strFieldName,getValueAsJsonNode(strFieldName,propertymap,attr));
			}


		}
	}

	//delete []value;
	return  true;
}

int platon::CGIS_DataConvert::EpsgcodeToInt(const String& strEpsgcode)
{
	int ntype;
	if (strEpsgcode == "EPSG:4326")
	{
		ntype = GIS_WGS84_SPATIALREFERENCE_INDEX;
	}
	else  if(strEpsgcode ==  "EPSG:4490")
	{
		ntype = GIS_CGCS2000_SPATIALREFERENCE_INDEX;
	}
	else if (strEpsgcode ==  "EPSG:3857")
	{
		ntype = GIS_WEB_MERCATOR_PROJECTION_INDEX;
	}
	else if(strEpsgcode ==  "EPSG:3395")
	{
		ntype = GIS_MERCATOR_PROJECTION_INDEX;

	}
	return ntype;
}

int CGIS_DataConvert::geoStringTypeToInt(const String& strGeoType)
{
	int ntype;
	if (strGeoType == POLYGON)
	{
		ntype = GIS_POLYGON;
	}
	else  if(strGeoType == POLYLINE)
	{
		ntype = GIS_POLYLINE;
	}
	else if (strGeoType == POINT)
	{
		ntype = GIS_POINT;
	}
	else if(strGeoType == RECT)
	{
		ntype = GIS_RECT;
	}
	else if(strGeoType == CIRCLE)
	{
		ntype = GIS_POLYGON;//?
	}
	return ntype;
}

bool platon::CGIS_DataConvert::createSpatialGeometry(int nGeoType, int nSpatialRefType, JsonNode* pGeoNode,IGIS_GeoBase*& baseGeo)
{
	//IGIS_GeoBase * baseGeo = NULL;

	IGIS_SpatialReferenceFactory* spatialRefFactory = GIS_GetSpatialReferenceFactoryObject();
	IGIS_SpatialReference* spitalRef = spatialRefFactory->GetPredefinedSpatialReferenceByIndex(nSpatialRefType);
	double dFactor = spitalRef->GetXYScaleFactor();
	switch(nGeoType){
	case GIS_POLYGON:
		{
			IGIS_GeoPolygon *pPoly = (IGIS_GeoPolygon*)(GIS_CreateGeoPolygonObject(spitalRef,2));	
			GeoPolygon poly;
			poly.defreezeFromJSON(pGeoNode);
			MultiCoordinates multiCoords= poly.coordinates;
			Coordinates coord =multiCoords[0];
			int nCount = (int)(coord.size());
			pPoly->SetPointCount(nCount);
			for (int i=0;i<nCount;i++)
			{
				SGIS_Point pt(coord[i][0]*dFactor,coord[i][1]*dFactor);
				pPoly->SetPoint(i,pt,spitalRef);
			}	
			
			baseGeo = pPoly;
			break;
		}
	case GIS_POLYLINE:
		{
			IGIS_GeoPolyLine* pPoly = (IGIS_GeoPolyLine*)(GIS_CreateGeoPolygonObject(spitalRef,2));
			GeoLineString poly;
			poly.defreezeFromJSON(pGeoNode);
			Coordinates coord = poly.coordinates;
			int nCount = (int)(coord.size());
			pPoly->SetPointCount(nCount);
			for (int i=0;i<nCount;i++)
			{
				pPoly->AddPoint(i,SGIS_Point(coord[i][0]*dFactor,coord[i][1]*dFactor),spitalRef);
			}	
			baseGeo = pPoly;
			break;
		}
	case GIS_POINT:
		{
			IGIS_GeoPoint* pPoly = (IGIS_GeoPoint*)(GIS_CreateGeoPolygonObject(spitalRef,2));
			GeoPoint poly;
			poly.defreezeFromJSON(pGeoNode);
			int nCount = (int)(poly.coordinates.size());
			Point coord = poly.coordinates;
			pPoly->SetPoint(SGIS_Point(coord[0]*dFactor,coord[1]*dFactor),spitalRef);			
			baseGeo = pPoly;
			break;
		}
	case GIS_RECT:
		{
			IGIS_GeoRect* pPoly = (IGIS_GeoRect*)(GIS_CreateGeoPolygonObject(spitalRef,2));
			GeoRect poly;
			poly.defreezeFromJSON(pGeoNode);
			int nCount = (int)(poly.coordinates.size());
			Coordinates coord = poly.coordinates;
			SGIS_Rect rc(coord[0][0]*dFactor,coord[1][1]*dFactor,coord[1][0]*dFactor,coord[0][1]*dFactor);
			pPoly->SetRect(rc,spitalRef);			
			baseGeo = pPoly;

			break;
		}
	default:
		break;
	}
	//spitalRef->Release();//会异常
	return true;

}

bool platon::CGIS_DataConvert::convert(JsonNode* geoNode,IGIS_GeoBase*& baseGeo)
{


	String strGeoType = (geoNode->get("type"))->asString();	
	//JsonNode* coordNode	= geoNode->get("coordinates");

	int nGeoType = geoStringTypeToInt(strGeoType);

	createSpatialGeometry(nGeoType, GIS_CGCS2000_SPATIALREFERENCE_INDEX,geoNode,baseGeo);

	return true;
}
}
