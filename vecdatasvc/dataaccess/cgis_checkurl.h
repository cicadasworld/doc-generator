#pragma once

#include "platon/basetypes/base/string.h"
#include "platon/basetypes/base/status.h"
#include "platon/basetypes/base/stringlist.h"

namespace platon{
//检查矢量url是否合法，包括对 结构判断、count、解析maptype、scale 设置，url参数。
class CGIS_CheckURL
{
public:
	CGIS_CheckURL(void);
	~CGIS_CheckURL(void);
	// 
	// 检查VectorLayerList的Url是否合法，（判断结构、count , 解析maptype、scale 设置）
	// @param       url		输入参数，VectorLayerList的Url
	// @return   	Status		返回值，Status类型，合法返回正常值，异常，返回具体的异常信息
	// 
	static Status checkVectorLayerList(const String& url);

	// 
	//检查VectorLayer的Url 是否合法，（判断结构、count，包含vectorlayer getName() 解析maptype、scale 设置）
	// @param    url			输入参数， VectorLayer的Url
	// @return	Status			返回值，Status类型，Status 合法返回正常值，异常，返回具体的异常信息
	// 
	static Status checkVectorLayer(const String& url);

	// 	
	// 检查GetFeature的Url 是否合法，（判断结构、count，包含vectorlayer  解析maptype、scale 设置，url参数）
	// @param		url							输入参数， GetFeature的Url
	// @param		body						输入参数， GetFeature的Url参数
	// @return    Status						返回值，Status类型，合法返回正常值，异常，返回具体的异常信息
	// 
	static Status checkGetFeature(const String& url,const String& body);

	// 	
	// 检查DescribeFeatureType的Url 是否合法，（判断结构、count，包含vectorlayer  解析maptype、scale 设置）
	// @param    url							输入参数， DescribeFeatureType的Url
	// @return   Status							返回值，Status类型，合法返回正常值，异常，返回具体的异常信息
	// 
	static Status checkDescribeFeatureType(const String& url);

private:
	static Status checkSubURL(int ncount, const StringList& strlist);

	//判断是否全部字符都是数字
	static bool isNumber(const String& str); 
	


};

}

