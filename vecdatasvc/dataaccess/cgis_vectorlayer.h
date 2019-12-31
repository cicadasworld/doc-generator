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

//ʸ��ͼ���࣬ �ṩͼ����Ϣ�������ֶ���Ϣ
class CGIS_VectorLayer
{
public:
	CGIS_VectorLayer(const String& mapType, const String& scale, const String& layerName);
	~CGIS_VectorLayer(void);

private:
	IGIS_VectorLayer *m_vecLayer;

public:

	// 
	//	��ȡͼ����Ϣ
	// @return   Freezable*				���ص�ͼ����Ϣ
	// 
	Freezable* getLayerInfo();

	// 
	//��ȡ�ֶ���Ϣ
	// @return   Freezable*				���ص��ֶ���Ϣ
	// 
	Freezable* getFiledsInfo();

	//void queryTest();
	//void spatialQueryTest();

private:
		String spatialRefToEpsgcode(const String& strName/*int ntype*/);
		
		int dataTypeToint(int ntype);
};	
}