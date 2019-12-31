#pragma once

#include "../dataconvert/cgis_parsequeryfilter.h"
#include "platon/basetypes/base/string.h"
#include "giae/igis_vectorlayer.h"
#include "../base/rectdo.h"
#include "../base/responseinforequirementdo.h"
#include "platon/basetypes/base/jsonnode.h"
namespace platon{
using namespace gtcloud::geodata::vecdatasvc::pdo;

// 矢量查询类， 提供5种Feature查询方式， ID、属性、空间、空间属性联合、多条件查询
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
	// 	通过ID查询获取feature集合
	// @param	 query					输入参数，查询字符串，已经是具体的id值，可以用逗号隔开。
	// @param	out						输出参数，查询结果， 以JsonNode形式返回
	// @return   Status					返回Status 类型，合法返回正常值，异常返回具体的异常信息
	// 
	Status getFeatureByID(const String& query, JsonNode* out);

	// 
	// 	通过属性信息条件查询获取feature集合
	// @param  node										输入参数， 以JsonNode形式传入
	// @param  respondRequirement						输入参数，对输出结果信息的要求
	// @param  out										输出参数，查询结果，以JsonNode形式返回
	// @return  Status									返回Status 类型，合法返回正常值，异常返回具体的异常信息
	// 
	Status getFeatureByPropertys(JsonNode* node, const ResponseInfoRequirement& respondRequirement, JsonNode* out);

	// 
	// 通过空间信息条件查询获取feature集合
	// @param  node										输入参数， 以JsonNode形式传入
	// @param  respondRequirement						输入参数，对输出结果信息的要求
	// @param  out										输出参数，查询结果，以JsonNode形式返回
	// @return   Status									返回Status 类型，合法返回正常值，异常返回具体的异常信息
	// 
	Status getFeatureBySpatial( JsonNode* node, const ResponseInfoRequirement& respondRequirement, JsonNode* out);

	// 
	// 通过空间信息和属性信息组合条件查询获取feature集合
	// @param JsonNode * node											输入参数， 以JsonNode形式传入
	// @param const ResponseInfoRequirement & respondRequirement		输入参数，对输出结果信息的要求
	// @param JsonNode * out											输出参数，查询结果，以JsonNode形式返回
	// @return   Status													返回Status 类型，合法返回正常值，异常返回具体的异常信息
	// 
	Status getFeatureBySpatial_Property(JsonNode* node, const ResponseInfoRequirement& respondRequirement, JsonNode* out);

	// 
	//通过多条件组合查询获取feature集合
	// @param  node										输入参数， 以JsonNode形式传入
	// @param  respondRequirement						输入参数，对输出结果信息的要求
	// @param   out										输出参数，查询结果，以JsonNode形式返回
	// @return  Status									返回Status 类型，合法返回正常值，异常返回具体的异常信息
	// 
	Status getFeatureByMultiQuery(JsonNode* node, const ResponseInfoRequirement& respondRequirement, JsonNode* out);

	Status getFeatureByCount(int nCount, JsonNode* out);

private:
	// 检查 空间条件是否合法
	Status checkSpatialFilterValid(_SpatialFilter* filter);
	
	//检查多条件是否合法
	Status checkMultiFilterValid(_MultiFilter* filter);

	//检查子查询条件是否合法
	Status checkSubFilterValid(_SubFilter* filter);

	//单个空间查询
	Status processQueryBySpatial(_SpatialFilter* spatialFilter, bool bLoadGeo, const String& propertyNames, JsonNode* out);

	//单个空间查询的最小处理单元
	Status processSpatialUnit(_SpatialFilter* spatialFilter, IGIS_FeatureSet* pResultFeatureSet, bool bLoadGeo, const String& propertyNames);

	// 处理查询结果
	Status processFeatureResult(IGIS_FeatureSet* pResultFeatureSet, bool bLoadGeo, const String& propertyNames, JsonNode* out);

	// 空间和属性联合做And查询的处理
	Status getFeatureBySpatial_Property_And(_SpatialPropertyFilter* spatialPropertyFilter, bool bLoadGeo, const String& propertyNames, JsonNode* out);

	// 空间和属性联合做Or查询的处理
	Status getFeatureBySpatial_Property_Or(_SpatialPropertyFilter* spatialPropertyFilter, bool bLoadGeo, const String& propertyNames, JsonNode* out);

	// 空间和属性联合做Not查询的处理
	Status getFeatureBySpatial_Property_Not(_SpatialPropertyFilter* spatialPropertyFilter, bool bLoadGeo, const String& propertyNames, JsonNode* out);

	// 多条件查询的处理
	Status processQueryByMulti(_SubFilter* spatialFilter, bool bLoadGeo, const String& propertyNames, IGIS_FeatureSet*& pResultFeatureSet);
};
}
