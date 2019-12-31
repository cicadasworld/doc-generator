#pragma once
#include "platon/basetypes/base/string.h"
#include "common/igis_geobase.h"
#include "common/igis_georect.h"
#include "giae/igis_queryfilter.h"
#include "platon/basetypes/base/jsonnode.h"

using namespace std;

namespace platon{
	
	//空间查询条件结构
struct _SpatialFilter{

public:
	int nSpatialMode;				//空间查询方式
	IGIS_GeoBase* pSpatialGeo;		//空间查询几何对象
	IGIS_GeoRect* pBbox;			//空间查询bbox范围框
	String strFunction;				//空间计算查询
	_SpatialFilter(){
		nSpatialMode = 0;
		pSpatialGeo = NULL;
		pBbox = NULL;
	}

	~_SpatialFilter(){
		if (pSpatialGeo!=NULL)
		{
			pSpatialGeo->Release();
		} 
		if (pBbox != NULL)
		{
			pBbox->Release();
		}
	}

};
//属性查询条件结构
struct _PropertyFilter{

public:
	IGIS_GeoRect* pBbox;			//空间查询bbox范围框
	String strSQLFilter;			//属性查询条件

	_PropertyFilter(){
		pBbox = NULL;
	}

	~_PropertyFilter(){
		if (pBbox != NULL)
		{
			pBbox->Release();
		}
	}

};
// 属性空间联合查询条件结构
struct _SpatialPropertyFilter{

public:
	_SpatialFilter* pSpatial;			//空间条件结构
	String strSQLFilter;				//属性查询条件
	String strLogicalOp;				//逻辑运算符
	_SpatialPropertyFilter(){
		pSpatial = NULL;
	}

	~_SpatialPropertyFilter(){
		if (pSpatial != NULL)
		{
			delete pSpatial;
			pSpatial = NULL;
		}
	}

};
// 多条件查询中的子查询条件结构
struct _SubFilter{
public:
	_SpatialFilter* pSpatial;			//空间条件结构
	String strSQLFilter;				//属性查询条件
	String strLogicalOp;				//逻辑运算符
	vector <_SubFilter*> sub;			//子查询条件
	
	_SubFilter()
	{
		pSpatial = NULL;
		
	}
	~_SubFilter()
	{
		if (pSpatial != NULL)
		{
			delete pSpatial;
			pSpatial = NULL;
		}

		for (int i = sub.size()-1;i >= 0; i--)
		{
			_SubFilter* obj = sub[i];
			delete obj;
			obj = NULL;
		}

	}
};

// 多条件查询结构
struct _MultiFilter{

public:
	vector <_SubFilter*> sub;			//查询条件
	String strLogicalOp;				//逻辑运算符
	_MultiFilter(){
		
	}

	~_MultiFilter(){
		
	}

};
//解析类，getfeature的请求体参数解析成C++的结构
class CGIS_ParseQueryFilter
{
public:
	CGIS_ParseQueryFilter(void);
	~CGIS_ParseQueryFilter(void);
	
public:

	// 将JsonNode的多条件解析成多条件查询结构parseSpatialFilter类型
	// @param		treeNode							输入参数， 输入的请求体参数，JsonNode*类型
	// @return      _SpatialFilter*						返回值，返回_SpatialFilter*类型
	_SpatialFilter* parseSpatialFilter(JsonNode* treeNode);


	// 将JsonNode的多条件解析成多条件查询结构_PropertyFilter类型
	// @param   treeNode							输入参数， 输入的请求体参数，JsonNode*类型
	// @return   _PropertyFilter*					返回值，返回_PropertyFilter*类型
	_PropertyFilter* parsePropertyFilter(JsonNode* treeNode);


	//将JsonNode的多条件解析成多条件查询结构_SpatialPropertyFilter类型
	// @param	  treeNode									输入参数， 输入的请求体参数，JsonNode*类型
	// @return    _SpatialPropertyFilter*					返回值，返回_SpatialPropertyFilter*类型
	_SpatialPropertyFilter* parseSpatialPropertyFilter(JsonNode* treeNode);


	// 将JsonNode的多条件解析成多条件查询结构_MultiFilter类型
	// @param	 treeNode							输入参数， 输入的请求体参数，JsonNode*类型
	// @return   _MultiFilter*						返回值，返回_MultiFilter*类型
	_MultiFilter* parseMultiFilter(JsonNode* treeNode);
private:
	// 多条件查询中会调用的循环处理
	void getSubFilter(JsonNode* subNode,vector <_SubFilter*>& sub);

};

}