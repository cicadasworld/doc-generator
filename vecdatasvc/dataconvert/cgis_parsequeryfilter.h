#pragma once
#include "platon/basetypes/base/string.h"
#include "common/igis_geobase.h"
#include "common/igis_georect.h"
#include "giae/igis_queryfilter.h"
#include "platon/basetypes/base/jsonnode.h"

using namespace std;

namespace platon{
	
	//�ռ��ѯ�����ṹ
struct _SpatialFilter{

public:
	int nSpatialMode;				//�ռ��ѯ��ʽ
	IGIS_GeoBase* pSpatialGeo;		//�ռ��ѯ���ζ���
	IGIS_GeoRect* pBbox;			//�ռ��ѯbbox��Χ��
	String strFunction;				//�ռ�����ѯ
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
//���Բ�ѯ�����ṹ
struct _PropertyFilter{

public:
	IGIS_GeoRect* pBbox;			//�ռ��ѯbbox��Χ��
	String strSQLFilter;			//���Բ�ѯ����

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
// ���Կռ����ϲ�ѯ�����ṹ
struct _SpatialPropertyFilter{

public:
	_SpatialFilter* pSpatial;			//�ռ������ṹ
	String strSQLFilter;				//���Բ�ѯ����
	String strLogicalOp;				//�߼������
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
// ��������ѯ�е��Ӳ�ѯ�����ṹ
struct _SubFilter{
public:
	_SpatialFilter* pSpatial;			//�ռ������ṹ
	String strSQLFilter;				//���Բ�ѯ����
	String strLogicalOp;				//�߼������
	vector <_SubFilter*> sub;			//�Ӳ�ѯ����
	
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

// ��������ѯ�ṹ
struct _MultiFilter{

public:
	vector <_SubFilter*> sub;			//��ѯ����
	String strLogicalOp;				//�߼������
	_MultiFilter(){
		
	}

	~_MultiFilter(){
		
	}

};
//�����࣬getfeature�����������������C++�Ľṹ
class CGIS_ParseQueryFilter
{
public:
	CGIS_ParseQueryFilter(void);
	~CGIS_ParseQueryFilter(void);
	
public:

	// ��JsonNode�Ķ����������ɶ�������ѯ�ṹparseSpatialFilter����
	// @param		treeNode							��������� ����������������JsonNode*����
	// @return      _SpatialFilter*						����ֵ������_SpatialFilter*����
	_SpatialFilter* parseSpatialFilter(JsonNode* treeNode);


	// ��JsonNode�Ķ����������ɶ�������ѯ�ṹ_PropertyFilter����
	// @param   treeNode							��������� ����������������JsonNode*����
	// @return   _PropertyFilter*					����ֵ������_PropertyFilter*����
	_PropertyFilter* parsePropertyFilter(JsonNode* treeNode);


	//��JsonNode�Ķ����������ɶ�������ѯ�ṹ_SpatialPropertyFilter����
	// @param	  treeNode									��������� ����������������JsonNode*����
	// @return    _SpatialPropertyFilter*					����ֵ������_SpatialPropertyFilter*����
	_SpatialPropertyFilter* parseSpatialPropertyFilter(JsonNode* treeNode);


	// ��JsonNode�Ķ����������ɶ�������ѯ�ṹ_MultiFilter����
	// @param	 treeNode							��������� ����������������JsonNode*����
	// @return   _MultiFilter*						����ֵ������_MultiFilter*����
	_MultiFilter* parseMultiFilter(JsonNode* treeNode);
private:
	// ��������ѯ�л���õ�ѭ������
	void getSubFilter(JsonNode* subNode,vector <_SubFilter*>& sub);

};

}