#pragma once
#include "platon/basetypes/base/stringlist.h"

#include "giae/igis_vectorlayer.h"

#include "../base/layerinfodo.h"
#include "../base/rectdo.h"
#include "platon/basetypes/utils/file.h"
//#include "../query/propertyqueryfilterdo.h"
//#include "../query/spatialquerydo.h"
//#include "../query/spatialqueryfilterdo.h"
//#include "../base/featuredo.h"
namespace platon{
using namespace gtcloud::geodata::vecdatasvc::pdo;

//矢量图层类， 提供图层信息、属性字段信息
class CGIS_VectorLayer
{
public:
	CGIS_VectorLayer(const String& mapType, const String& scale, const String& layerName);
	~CGIS_VectorLayer(void);

private:
	IGIS_VectorLayer *m_vecLayer;

public:

	// 
	//	获取图层信息
	// @return   Freezable*				返回的图层信息
	// 
	Freezable* getLayerInfo();

	// 
	//获取字段信息
	// @return   Freezable*				返回的字段信息
	// 
	Freezable* getFiledsInfo();

	//void queryTest();
	//void spatialQueryTest();

private:
		String spatialRefToEpsgcode(const String& strName/*int ntype*/);
		
		int dataTypeToint(int ntype);
};	
}