#pragma once
#include "giae/igis_feature.h"
#include "common/igis_georect.h"
#include "platon/basetypes/base/stringlist.h"
#include "platon/scf/freeze/freezable.h"
#include "platon/scf/freeze/stringseq.fz.h"
#include <map>
using namespace std;
namespace platon{
	// ת���࣬������json�ṹ������ṹת���ɵײ�C++�ṹ�����߽�C++�ṹת����json�ṹ
class CGIS_DataConvert
{
public:
	CGIS_DataConvert(void);
	~CGIS_DataConvert(void);

public:
	//��Ӧʱʹ�õģ�IGIS_Feature-->JsonNode
	// 	��IGIS_Featureת����JsonNode
	// @param  pFeature					�����������ѯ���Ľ��feature
	// @param  outputJsonTree			������������feature��JsonNode��ʽ
	// @param  propertymap				��������������ֶε� ����-���� ��ֵ�Զ������json����ʹ��
	// @param  bLoadGeo					��������� ��Ӧ������Ƿ����geometry��Ϣ
	// @param  propertyNames			�����������Ӧ����а����������ֶ�
	// @return  bool					����ֵ��bool���ͣ���ʾת���Ƿ�ɹ�
	static bool convert(IGIS_Feature* pFeature, JsonNode* outputJsonTree, const map<String,int>& propertymap, double dFactor = 1, bool bLoadGeo = true, const char*propertyNames = NULL );

	//�����������geometry����JsonNode->IGIS_GeoBase
	//��JsonNode��ʽ��Geometry���������ת���ɵײ�Geometry����
	// @param    geoNode			���������JsonNode��ʽ��Geometry���������
	// @param    baseGeo			����������ײ�Geometry����
	// @return   bool				����ֵ��bool���ͣ���ʾת���Ƿ�ɹ�
	static bool convert(JsonNode* geoNode,IGIS_GeoBase*& baseGeo);

	// ��JsonNode��ʽ��bbox���������ת���ɵײ�IGIS_GeoRect����
	// @param    geoNode			���������JsonNode��ʽ��bbox���������
	// @param    baseGeo			����������ײ�IGIS_GeoRect����
	// @return   bool				����ֵ��bool���ͣ���ʾת���Ƿ�ɹ�
	static bool bboxToRect(JsonNode* geoNode,IGIS_GeoRect*& baseGeo);


	// �ռ��ѯ����ת���ɵײ�����
	// @param    strOperator					����������ռ��ѯ���͵��ַ�������
	// @return   int							����ֵ������ת���������
	static int spatialOperatorToInt(const String & strOperator);

	
	// ����ResponseInfoRequirement��propertyNames����ֶ������飬ת����һ���Ÿ������ַ�����ʽ
	// @param    strArray				���������StringSeq��������
	// @param    out					���������ת����������ַ���
	// @return   bool					����ֵ�������Ƿ�ɹ�
	static  bool stringSeqToString (const StringSeq& strArray,String& out);


private:

	// ��pFeature�а���propertyNames�����ֶ����ݵõ�����ֵ��JsonNode��ʾ��ʽ
	// @param		pFeature						���������pFeature����
	// @param		outputJsonTree					���������ת����JsonNode������������Ϣ
	// @paramconst  propertymap						��������������ֶε� ����-���� ��ֵ�Զ������json����ʹ��
	// @param		propertyNames					���������������ṹ��ָ������Ӧ��Ϣ
	// @return		bool							����ֵ��bool����
	static bool getPropertyFromFeature(IGIS_Feature* pFeature, JsonNode*& outputJsonTree,const map<String,int>& propertymap, const char*propertyNames = NULL);


	// 	ת��geometry����Ϊ�ײ�����
	// @param		strGeoType					�����������������Geometry��string����
	// @return		int							����ֵ������ת�����Geometry����
	static int geoStringTypeToInt(const String& strGeoType);
	static int EpsgcodeToInt(const String& strEpsgcode);


	// �����������е�Geometry��������IGIS_GeoBase
	// @param		nGeoType					������������ζ�������
	// @param		nSpatialRefType				����������ռ�ο�ϵ���� 2000
	// @param		pGeoNode					�������������������е�Geometry����
	// @param		baseGeo						���������ת����ļ�������
	// @return		bool						����ֵ��bool����
	static bool createSpatialGeometry(int nGeoType, int nSpatialRefType, JsonNode* pGeoNode,IGIS_GeoBase*& baseGeo);

	static JsonNode* getValueAsJsonNode(const String& strFieldName, const map<String,int>& propertymap, IGIS_FeatureAttribute* attr);
};

}