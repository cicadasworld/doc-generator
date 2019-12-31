#pragma once
#include "platon/basetypes/base/status.h"
#include "platon/scf/freeze/freezable.h"
#include "platon/scf/freeze/stringseq.fz.h"
#include <map>
using namespace std;
namespace platon{

//处理矢量url 
class CGIS_ManageURL
{
public:
	CGIS_ManageURL(void);
	~CGIS_ManageURL(void);

public:
	// 
	// 	获取矢量图层列表信息
	// @param	 url								输入参数，VectorLayerList的url
	// @param	 handled
	// @param	 obj								输出参数，查询结果，以Freezable形式返回
	// @return   Status								返回Status 类型，合法返回正常值，异常返回具体的异常信息
	// 
	static Status processURLVectorLayerList(const String& url,bool& handled,Freezable*& obj, map<String,StringSeq>& fileMap);

	// 	
	//  获取矢量图层信息
	// @param	url								输入参数，VectorLayer的url
	// @param	handled							输入输出
	// @param	obj								输出参数，查询结果，以Freezable形式返回
	// @return  Status							返回值，Status 类型，合法返回正常值，异常，返回具体的异常信息
	// 
	static Status processURLVectorLayer(const String& url,bool& handled,Freezable*& obj);

	// 
	// 获取属性字段信息
	// @param	url								输入参数，DescribeFeatureType的url
	// @param	handled							输入输出
	// @param	obj								输出参数，查询结果，以Freezable形式返回
	// @return   Status							返回值，Status 类型，合法返回正常值，异常返回具体的异常信息
	// 
	static Status processURLDescribeFeatureType(const String& url,bool& handled,Freezable*& obj);

	// 
	// 查询Feature
	// @param	url								输入参数，GetFeature的url
	// @param	rawQueryString					输入参数，url参数
	// @param	body							输入参数，post请求体参数
	// @param	handled							输入输出			
	// @param	node							输出参数，查询结果，以JsonNode形式返回
	// @return   Status							返回值，Status类型，合法返回正常值，异常返回具体的异常信息
	// 
	static Status processURLGetFeature(const String& url,const String& rawQueryString,const String& body,bool& handled,JsonNode* node);



};

}