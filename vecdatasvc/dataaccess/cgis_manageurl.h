#pragma once
#include "platon/basetypes/base/status.h"
#include "platon/scf/freeze/freezable.h"
#include "platon/scf/freeze/stringseq.fz.h"
#include <map>
using namespace std;
namespace platon{

//����ʸ��url 
class CGIS_ManageURL
{
public:
	CGIS_ManageURL(void);
	~CGIS_ManageURL(void);

public:
	// 
	// 	��ȡʸ��ͼ���б���Ϣ
	// @param	 url								���������VectorLayerList��url
	// @param	 handled
	// @param	 obj								�����������ѯ�������Freezable��ʽ����
	// @return   Status								����Status ���ͣ��Ϸ���������ֵ���쳣���ؾ�����쳣��Ϣ
	// 
	static Status processURLVectorLayerList(const String& url,bool& handled,Freezable*& obj, map<String,StringSeq>& fileMap);

	// 	
	//  ��ȡʸ��ͼ����Ϣ
	// @param	url								���������VectorLayer��url
	// @param	handled							�������
	// @param	obj								�����������ѯ�������Freezable��ʽ����
	// @return  Status							����ֵ��Status ���ͣ��Ϸ���������ֵ���쳣�����ؾ�����쳣��Ϣ
	// 
	static Status processURLVectorLayer(const String& url,bool& handled,Freezable*& obj);

	// 
	// ��ȡ�����ֶ���Ϣ
	// @param	url								���������DescribeFeatureType��url
	// @param	handled							�������
	// @param	obj								�����������ѯ�������Freezable��ʽ����
	// @return   Status							����ֵ��Status ���ͣ��Ϸ���������ֵ���쳣���ؾ�����쳣��Ϣ
	// 
	static Status processURLDescribeFeatureType(const String& url,bool& handled,Freezable*& obj);

	// 
	// ��ѯFeature
	// @param	url								���������GetFeature��url
	// @param	rawQueryString					���������url����
	// @param	body							���������post���������
	// @param	handled							�������			
	// @param	node							�����������ѯ�������JsonNode��ʽ����
	// @return   Status							����ֵ��Status���ͣ��Ϸ���������ֵ���쳣���ؾ�����쳣��Ϣ
	// 
	static Status processURLGetFeature(const String& url,const String& rawQueryString,const String& body,bool& handled,JsonNode* node);



};

}