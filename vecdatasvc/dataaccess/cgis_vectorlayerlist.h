#pragma once

#include "../base/getmapnodesdo.h"
#include "platon/basetypes/base/stringlist.h"
#include "platon/basetypes/base/status.h"
#include "platon/scf/freeze/stringseq.fz.h"
namespace platon{
	using namespace gtcloud::geodata::vecdatasvc::pdo;
	//矢量图层列表类， 根据输入的地图类型、比例尺，获取相应的图层列表，并生成文件
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
