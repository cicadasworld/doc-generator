#pragma once

#include "../base/getmapnodesdo.h"
#include "platon/basetypes/base/stringlist.h"
#include "platon/basetypes/base/status.h"
#include "platon/scf/freeze/stringseq.fz.h"
namespace platon{
	using namespace gtcloud::geodata::vecdatasvc::pdo;
	//ʸ��ͼ���б��࣬ ��������ĵ�ͼ���͡������ߣ���ȡ��Ӧ��ͼ���б��������ļ�
class CGIS_VectorLayerList
{
public:
	CGIS_VectorLayerList(const String& mapType, const String& scale);
	~CGIS_VectorLayerList(void);

public:
	Status getLayerList(Freezable*& obj);

private:
	//void processNodeList(const String& strPath, MapResDescriptorDOList* nodeList,StringSeq& strLayerList);
	String m_MapType;
	String m_Scale;
};
}
