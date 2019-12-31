#pragma once

#include "../dataconvert/cgis_parsequeryfilter.h"
#include "platon/basetypes/base/string.h"
#include "giae/igis_vectorlayer.h"
#include "../base/rectdo.h"
#include "../base/responseinforequirementdo.h"
#include "platon/basetypes/base/jsonnode.h"
namespace platon{
using namespace gtcloud::geodata::vecdatasvc::pdo;

// ʸ����ѯ�࣬ �ṩ5��Feature��ѯ��ʽ�� ID�����ԡ��ռ䡢�ռ��������ϡ���������ѯ
class CGIS_GetFeature
{
public:
	CGIS_GetFeature(const String& mapType, const String& scale, const String& layerName);
	~CGIS_GetFeature(void);
private:
	IGIS_VectorLayer *m_vecLayer;
	double m_dFactor;

public:
	// 
	// 	ͨ��ID��ѯ��ȡfeature����
	// @param	 query					�����������ѯ�ַ������Ѿ��Ǿ����idֵ�������ö��Ÿ�����
	// @param	out						�����������ѯ����� ��JsonNode��ʽ����
	// @return   Status					����Status ���ͣ��Ϸ���������ֵ���쳣���ؾ�����쳣��Ϣ
	// 
	Status getFeatureByID(const String& query, JsonNode* out);

	// 
	// 	ͨ��������Ϣ������ѯ��ȡfeature����
	// @param  node										��������� ��JsonNode��ʽ����
	// @param  respondRequirement						�������������������Ϣ��Ҫ��
	// @param  out										�����������ѯ�������JsonNode��ʽ����
	// @return  Status									����Status ���ͣ��Ϸ���������ֵ���쳣���ؾ�����쳣��Ϣ
	// 
	Status getFeatureByPropertys(JsonNode* node, const ResponseInfoRequirement& respondRequirement, JsonNode* out);

	// 
	// ͨ���ռ���Ϣ������ѯ��ȡfeature����
	// @param  node										��������� ��JsonNode��ʽ����
	// @param  respondRequirement						�������������������Ϣ��Ҫ��
	// @param  out										�����������ѯ�������JsonNode��ʽ����
	// @return   Status									����Status ���ͣ��Ϸ���������ֵ���쳣���ؾ�����쳣��Ϣ
	// 
	Status getFeatureBySpatial( JsonNode* node, const ResponseInfoRequirement& respondRequirement, JsonNode* out);

	// 
	// ͨ���ռ���Ϣ��������Ϣ���������ѯ��ȡfeature����
	// @param JsonNode * node											��������� ��JsonNode��ʽ����
	// @param const ResponseInfoRequirement & respondRequirement		�������������������Ϣ��Ҫ��
	// @param JsonNode * out											�����������ѯ�������JsonNode��ʽ����
	// @return   Status													����Status ���ͣ��Ϸ���������ֵ���쳣���ؾ�����쳣��Ϣ
	// 
	Status getFeatureBySpatial_Property(JsonNode* node, const ResponseInfoRequirement& respondRequirement, JsonNode* out);

	// 
	//ͨ����������ϲ�ѯ��ȡfeature����
	// @param  node										��������� ��JsonNode��ʽ����
	// @param  respondRequirement						�������������������Ϣ��Ҫ��
	// @param   out										�����������ѯ�������JsonNode��ʽ����
	// @return  Status									����Status ���ͣ��Ϸ���������ֵ���쳣���ؾ�����쳣��Ϣ
	// 
	Status getFeatureByMultiQuery(JsonNode* node, const ResponseInfoRequirement& respondRequirement, JsonNode* out);

	Status getFeatureByCount(int nCount, JsonNode* out);

private:
	// ��� �ռ������Ƿ�Ϸ�
	Status checkSpatialFilterValid(_SpatialFilter* filter);
	
	//���������Ƿ�Ϸ�
	Status checkMultiFilterValid(_MultiFilter* filter);

	//����Ӳ�ѯ�����Ƿ�Ϸ�
	Status checkSubFilterValid(_SubFilter* filter);

	//�����ռ��ѯ
	Status processQueryBySpatial(_SpatialFilter* spatialFilter, bool bLoadGeo, const String& propertyNames, JsonNode* out);

	//�����ռ��ѯ����С����Ԫ
	Status processSpatialUnit(_SpatialFilter* spatialFilter, IGIS_FeatureSet* pResultFeatureSet, bool bLoadGeo, const String& propertyNames);

	// �����ѯ���
	Status processFeatureResult(IGIS_FeatureSet* pResultFeatureSet, bool bLoadGeo, const String& propertyNames, JsonNode* out);

	// �ռ������������And��ѯ�Ĵ���
	Status getFeatureBySpatial_Property_And(_SpatialPropertyFilter* spatialPropertyFilter, bool bLoadGeo, const String& propertyNames, JsonNode* out);

	// �ռ������������Or��ѯ�Ĵ���
	Status getFeatureBySpatial_Property_Or(_SpatialPropertyFilter* spatialPropertyFilter, bool bLoadGeo, const String& propertyNames, JsonNode* out);

	// �ռ������������Not��ѯ�Ĵ���
	Status getFeatureBySpatial_Property_Not(_SpatialPropertyFilter* spatialPropertyFilter, bool bLoadGeo, const String& propertyNames, JsonNode* out);

	// ��������ѯ�Ĵ���
	Status processQueryByMulti(_SubFilter* spatialFilter, bool bLoadGeo, const String& propertyNames, IGIS_FeatureSet*& pResultFeatureSet);
};
}
