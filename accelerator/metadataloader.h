#ifndef _NGIS_DATAMAN_MetadataParser_
#define _NGIS_DATAMAN_MetadataParser_

#include "platon/basetypes/base/status.h"
#include "entity_descriptor.h"
#include "constants.h"

GT_PLATON_BEGIN_NAMESPACE()

typedef gtcloud::geodata::metadata::pdo::GeoEntityDescriptorDO GeoEntityDescriptorDO;

// Ԫ���ݼ�����, ���DOM, ʸ���ȵ������ݲ�Ʒ��Ԫ���ݽ���������
class GeoMetadataLoader
{
public:
    virtual void cleanUp() = 0;

public:
    //
    // ����Ӱ���Ʒ��Ԫ����
    // @param imageFileName Ӱ���ļ���, �� C:\Data\N0651.tif ��
    // @param metatable ���ؽ����õ���Ԫ���ݱ�
    // @return ���ɹ�����ok״̬�롣
    //
    virtual Status loadMetadata_Image(const String& imageFileName, GeoEntityDescriptorDO& metatable) = 0;

    //
    // �����̲߳�Ʒ��Ԫ����
    // @param demFileName �߳��ļ���, �� C:\Data\N0651.egx ��
    // @param metatable ���ؽ����õ���Ԫ���ݱ�
    // @return ���ɹ�����ok״̬�롣
    //
    virtual Status loadMetadata_DEM(const String& demFileName, GeoEntityDescriptorDO& metatable) = 0;

    //
    // ����ʸ�����ݲ�Ʒ(�¾��꽻����ʽ)��Ԫ����
    // @param smsFileName ʸ�����ݵ����������ļ�, �� G:\RasterData\��Ʒ��\XJBJH\N0650\N0650.SMS ��
    // @param metatable ���ؽ����õ���Ԫ���ݱ�
    // @return ���ɹ�����ok״̬�롣
    //
    virtual Status loadMetadata_Vector_XJBJH(const String& smsFileName, GeoEntityDescriptorDO& metatable) = 0;

    //
    // �����������ݲ�Ʒ��Ԫ����(.dm��ʽ)
    // @param dmFileName ���������ļ�, �� G:\RasterData\��Ʒ��\1.dm ��
    // @param metatable ���ؽ����õ���Ԫ���ݱ�
    // @return ���ɹ�����ok״̬�롣
    //
    virtual Status loadMetadata_PlaceName_DM(const String& dmFileName, GeoEntityDescriptorDO& metatable) = 0;

	//
	// ��������ʵ�����ݲ�Ʒ(���¾��꽻����ʽ����һ��)��Ԫ����
	// @param smsFileName ����ʵ�����ݵ����������ļ�, �� G:\RasterData\��Ʒ��\XJBJH\N0650\N0650.SMS ��
	// @param metatable ���ؽ����õ���Ԫ���ݱ�
	// @return ���ɹ�����ok״̬�롣
	//
	virtual Status loadMetadata_GeoEntity_XJBJH(const String& smsFileName, GeoEntityDescriptorDO& metatable) = 0;


public:
    //
    // ���Ӱ��ĸ߿�
    // @param imageFileName Ӱ���ļ���, �� G:\RasterData\��Ʒ��\1.tiff ��.
    // @param outHeight ����Ӱ������ظ�;
    // @param outWidth ����Ӱ������ؿ�;
    // @return ���ɹ�����ok״̬�롣
    //
    virtual Status getImageSize(const String& imageFileName, int& outHeight, int& outWidth) = 0;

};

GT_PLATON_END_NAMESPACE()

extern "C" GT_PLATON_NS::GeoMetadataLoader* GT_GetGeoMetadataLoader();

#endif /*_NGIS_DATAMAN_MetadataParser_*/
