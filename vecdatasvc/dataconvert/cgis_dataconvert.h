#pragma once
#include "giae/igis_feature.h"
#include "common/igis_georect.h"
#include "platon/basetypes/base/stringlist.h"
#include "platon/scf/freeze/freezable.h"
#include "platon/scf/freeze/stringseq.fz.h"
#include <map>
using namespace std;
namespace platon{
	// 转换类，将各种json结构的请求结构转换成底层C++结构，或者将C++结构转换成json结构
class CGIS_DataConvert
{
public:
	CGIS_DataConvert(void);
	~CGIS_DataConvert(void);

public:
	//响应时使用的，IGIS_Feature-->JsonNode
	// 	将IGIS_Feature转换成JsonNode
	// @param  pFeature					输入参数，查询到的结果feature
	// @param  outputJsonTree			输出参数，结果feature的JsonNode形式
	// @param  propertymap				输入参数，属性字段的 名称-类型 键值对儿，输出json类型使用
	// @param  bLoadGeo					输入参数， 响应结果中是否包含geometry信息
	// @param  propertyNames			输入参数，响应结果中包含的属性字段
	// @return  bool					返回值，bool类型，表示转换是否成功
	static bool convert(IGIS_Feature* pFeature, JsonNode* outputJsonTree, const map<String,int>& propertymap, double dFactor = 1, bool bLoadGeo = true, const char*propertyNames = NULL );

	//解析输入参数geometry，由JsonNode->IGIS_GeoBase
	//将JsonNode形式的Geometry请求体参数转换成底层Geometry类型
	// @param    geoNode			输入参数，JsonNode形式的Geometry请求体参数
	// @param    baseGeo			输出参数，底层Geometry类型
	// @return   bool				返回值，bool类型，表示转换是否成功
	static bool convert(JsonNode* geoNode,IGIS_GeoBase*& baseGeo);

	// 将JsonNode形式的bbox请求体参数转换成底层IGIS_GeoRect类型
	// @param    geoNode			输入参数，JsonNode形式的bbox请求体参数
	// @param    baseGeo			输出参数，底层IGIS_GeoRect类型
	// @return   bool				返回值，bool类型，表示转换是否成功
	static bool bboxToRect(JsonNode* geoNode,IGIS_GeoRect*& baseGeo);


	// 空间查询类型转换成底层类型
	// @param    strOperator					输入参数，空间查询类型的字符串类型
	// @return   int							返回值，返回转换后的类型
	static int spatialOperatorToInt(const String & strOperator);

	
	// 处理ResponseInfoRequirement的propertyNames输出字段名数组，转换成一逗号隔开的字符串形式
	// @param    strArray				输入参数，StringSeq类型数组
	// @param    out					输出参数，转换后的属性字符串
	// @return   bool					返回值，处理是否成功
	static  bool stringSeqToString (const StringSeq& strArray,String& out);


private:

	// 从pFeature中按照propertyNames属性字段内容得到属性值的JsonNode表示形式
	// @param		pFeature						输入参数，pFeature类型
	// @param		outputJsonTree					输出参数，转换成JsonNode表述的属性信息
	// @paramconst  propertymap						输入参数，属性字段的 名称-类型 键值对儿，输出json类型使用
	// @param		propertyNames					输入参数，请求体结构中指定的响应信息
	// @return		bool							返回值，bool类型
	static bool getPropertyFromFeature(IGIS_Feature* pFeature, JsonNode*& outputJsonTree,const map<String,int>& propertymap, const char*propertyNames = NULL);


	// 	转换geometry类型为底层类型
	// @param		strGeoType					输入参数，请求体中Geometry的string类型
	// @return		int							返回值，返回转换后的Geometry类型
	static int geoStringTypeToInt(const String& strGeoType);
	static int EpsgcodeToInt(const String& strEpsgcode);


	// 根据请求体中的Geometry参数创建IGIS_GeoBase
	// @param		nGeoType					输入参数，几何对象类型
	// @param		nSpatialRefType				输入参数，空间参考系类型 2000
	// @param		pGeoNode					输入参数，请求体参数中的Geometry部分
	// @param		baseGeo						输出参数，转换后的几何类型
	// @return		bool						返回值，bool类型
	static bool createSpatialGeometry(int nGeoType, int nSpatialRefType, JsonNode* pGeoNode,IGIS_GeoBase*& baseGeo);

	static JsonNode* getValueAsJsonNode(const String& strFieldName, const map<String,int>& propertymap, IGIS_FeatureAttribute* attr);
};

}