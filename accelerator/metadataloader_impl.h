#ifndef _GEOMETADATALOADER_IMPL_H_
#define _GEOMETADATALOADER_IMPL_H_

#include "cgis/dataman/metadata/metadataloader.h"

GT_PLATON_BEGIN_NAMESPACE()

// Ԫ���ݼ�����ʵ����
class GeoMetadataLoader_Impl : public GeoMetadataLoader
{
public:
    GeoMetadataLoader_Impl();
    ~GeoMetadataLoader_Impl();

public:
    virtual Status init();

    virtual void cleanUp();

public:
    //
    // ����Ӱ���Ʒ��Ԫ����
    // @param imageFileName Ӱ���ļ���, �� C:\Data\N0651.tif ��
    // @param metatable ���ؽ����õ���Ԫ���ݱ�
    // @return ���ɹ�����ok״̬�롣
    //
    virtual Status loadMetadata_Image(const String& imageFileName,
                                      GeoEntityDescriptorDO& metatable);

    //
    // ���Ӱ��ĸ߿�
    // @param imageFileName Ӱ���ļ���, �� G:\RasterData\��Ʒ��\1.tiff ��.
    // @param outHeight ����Ӱ������ظ�;
    // @param outWidth ����Ӱ������ؿ�;
    // @return ���ɹ�����ok״̬�롣
    //
    virtual Status getImageSize(const String& imageFileName, int& outHeight, int& outWidth);

private:
    // ����ʱ"��������Ӱ���"��Ŀ��Ԫ���ݹ淶������Ӱ���ļ���ȷ����Ԫ�����ļ�����
    void getMetadataFileName_Image_OldProjectDOM(const String& imageFileName,
                                                 String& metadataFileName,
                                                 bool& metadataFileExisting);

    // ����ʱ"��������Ӱ���"��Ŀ��Ԫ���ݹ淶������Ӱ��Ԫ����
    Status loadMetadata_Image_OldProjectDOM(const String& imageFileName,
                                            const String& metadataFileName,
                                            GeoEntityDescriptorDO& metatable);

    // ��ȡ����Ӱ�����ݵ���׼��Ϣ, ��������׼��Ϣ"���"��Ӧ��Ԫ����
    Status loadMetadata_Image_ForgedByRegInfo(const String& imageFileName,
                                              GeoEntityDescriptorDO& metatable);

	//ͨ�������ļ���ȡʸ���ĵ�ͼ����
	Status getMapTypeFromZbFiles(const String&fileDir ,String &mapType);

public:
    //
    // �����̲߳�Ʒ��Ԫ����
    // @param demFileName �߳��ļ���, �� C:\Data\N0651.egx ��
    // @param metatable ���ؽ����õ���Ԫ���ݱ�
    // @return ���ɹ�����ok״̬�롣
    //
    virtual Status loadMetadata_DEM(const String& demFileName, GeoEntityDescriptorDO& metatable);

public:
    //
    // ����ʸ�����ݲ�Ʒ(�¾��꽻����ʽ)��Ԫ����
    // @param smsFileName ʸ�����ݵ����������ļ�, �� G:\RasterData\��Ʒ��\XJBJH\N0650\N0650.SMS ��
    // @param metatable ���ؽ����õ���Ԫ���ݱ�
    // @return ���ɹ�����ok״̬�롣
    //
    virtual Status loadMetadata_Vector_XJBJH(const String& smsFileName, GeoEntityDescriptorDO& metatable);

public:
    //
    // �����������ݲ�Ʒ��Ԫ����(.dm��ʽ)
    // @param dmFileName ���������ļ�, �� G:\RasterData\��Ʒ��\1.dm ��
    // @param metatable ���ؽ����õ���Ԫ���ݱ�
    // @return ���ɹ�����ok״̬�롣
    //
    virtual Status loadMetadata_PlaceName_DM(const String& dmFileName, GeoEntityDescriptorDO& metatable);


public:
	//
	// ��������ʵ�����ݲ�Ʒ(���¾��꽻����ʽ����һ��)��Ԫ����
	// @param smsFileName ����ʵ�����ݵ����������ļ�, �� G:\RasterData\��Ʒ��\XJBJH\N0650\N0650.SMS ��
	// @param metatable ���ؽ����õ���Ԫ���ݱ�
	// @return ���ɹ�����ok״̬�롣
	//
	virtual Status loadMetadata_GeoEntity_XJBJH(const String& smsFileName, GeoEntityDescriptorDO& metatable);

private:
    const char* m_ident;
};

GT_PLATON_END_NAMESPACE()

#endif /*_GEOMETADATALOADER_IMPL_H_*/

