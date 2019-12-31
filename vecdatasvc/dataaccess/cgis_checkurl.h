#pragma once

#include "platon/basetypes/base/string.h"
#include "platon/basetypes/base/status.h"
#include "platon/basetypes/base/stringlist.h"

namespace platon{
//���ʸ��url�Ƿ�Ϸ��������� �ṹ�жϡ�count������maptype��scale ���ã�url������
class CGIS_CheckURL
{
public:
	CGIS_CheckURL(void);
	~CGIS_CheckURL(void);
	// 
	// ���VectorLayerList��Url�Ƿ�Ϸ������жϽṹ��count , ����maptype��scale ���ã�
	// @param       url		���������VectorLayerList��Url
	// @return   	Status		����ֵ��Status���ͣ��Ϸ���������ֵ���쳣�����ؾ�����쳣��Ϣ
	// 
	static Status checkVectorLayerList(const String& url);

	// 
	//���VectorLayer��Url �Ƿ�Ϸ������жϽṹ��count������vectorlayer getName() ����maptype��scale ���ã�
	// @param    url			��������� VectorLayer��Url
	// @return	Status			����ֵ��Status���ͣ�Status �Ϸ���������ֵ���쳣�����ؾ�����쳣��Ϣ
	// 
	static Status checkVectorLayer(const String& url);

	// 	
	// ���GetFeature��Url �Ƿ�Ϸ������жϽṹ��count������vectorlayer  ����maptype��scale ���ã�url������
	// @param		url							��������� GetFeature��Url
	// @param		body						��������� GetFeature��Url����
	// @return    Status						����ֵ��Status���ͣ��Ϸ���������ֵ���쳣�����ؾ�����쳣��Ϣ
	// 
	static Status checkGetFeature(const String& url,const String& body);

	// 	
	// ���DescribeFeatureType��Url �Ƿ�Ϸ������жϽṹ��count������vectorlayer  ����maptype��scale ���ã�
	// @param    url							��������� DescribeFeatureType��Url
	// @return   Status							����ֵ��Status���ͣ��Ϸ���������ֵ���쳣�����ؾ�����쳣��Ϣ
	// 
	static Status checkDescribeFeatureType(const String& url);

private:
	static Status checkSubURL(int ncount, const StringList& strlist);

	//�ж��Ƿ�ȫ���ַ���������
	static bool isNumber(const String& str); 
	


};

}

