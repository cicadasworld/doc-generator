#ifndef _GEOMETADATALOADER_IMPL_H_
#define _GEOMETADATALOADER_IMPL_H_

#include "cgis/dataman/metadata/metadataloader.h"

GT_PLATON_BEGIN_NAMESPACE()

// 元数据加载器实现类
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
    // 解析影像产品的元数据
    // @param imageFileName 影像文件名, 如 C:\Data\N0651.tif 等
    // @param metatable 返回解析得到的元数据表
    // @return 若成功返回ok状态码。
    //
    virtual Status loadMetadata_Image(const String& imageFileName,
                                      GeoEntityDescriptorDO& metatable);

    //
    // 获得影像的高宽。
    // @param imageFileName 影像文件名, 如 G:\RasterData\产品库\1.tiff 等.
    // @param outHeight 返回影像的像素高;
    // @param outWidth 返回影像的像素宽;
    // @return 若成功返回ok状态码。
    //
    virtual Status getImageSize(const String& imageFileName, int& outHeight, int& outWidth);

private:
    // 按旧时"数字正射影像库"项目的元数据规范，根据影像文件名确定其元数据文件名称
    void getMetadataFileName_Image_OldProjectDOM(const String& imageFileName,
                                                 String& metadataFileName,
                                                 bool& metadataFileExisting);

    // 按旧时"数字正射影像库"项目的元数据规范，加载影像元数据
    Status loadMetadata_Image_OldProjectDOM(const String& imageFileName,
                                            const String& metadataFileName,
                                            GeoEntityDescriptorDO& metatable);

    // 获取给定影像数据的配准信息, 并根据配准信息"造出"对应的元数据
    Status loadMetadata_Image_ForgedByRegInfo(const String& imageFileName,
                                              GeoEntityDescriptorDO& metatable);

	//通过坐标文件获取矢量的地图类型
	Status getMapTypeFromZbFiles(const String&fileDir ,String &mapType);

public:
    //
    // 解析高程产品的元数据
    // @param demFileName 高程文件名, 如 C:\Data\N0651.egx 等
    // @param metatable 返回解析得到的元数据表
    // @return 若成功返回ok状态码。
    //
    virtual Status loadMetadata_DEM(const String& demFileName, GeoEntityDescriptorDO& metatable);

public:
    //
    // 解析矢量数据产品(新军标交换格式)的元数据
    // @param smsFileName 矢量数据的属性描述文件, 如 G:\RasterData\产品库\XJBJH\N0650\N0650.SMS 等
    // @param metatable 返回解析得到的元数据表
    // @return 若成功返回ok状态码。
    //
    virtual Status loadMetadata_Vector_XJBJH(const String& smsFileName, GeoEntityDescriptorDO& metatable);

public:
    //
    // 解析地名数据产品的元数据(.dm格式)
    // @param dmFileName 地名数据文件, 如 G:\RasterData\产品库\1.dm 等
    // @param metatable 返回解析得到的元数据表
    // @return 若成功返回ok状态码。
    //
    virtual Status loadMetadata_PlaceName_DM(const String& dmFileName, GeoEntityDescriptorDO& metatable);


public:
	//
	// 解析地理实体数据产品(与新军标交换格式基本一样)的元数据
	// @param smsFileName 地理实体数据的属性描述文件, 如 G:\RasterData\产品库\XJBJH\N0650\N0650.SMS 等
	// @param metatable 返回解析得到的元数据表
	// @return 若成功返回ok状态码。
	//
	virtual Status loadMetadata_GeoEntity_XJBJH(const String& smsFileName, GeoEntityDescriptorDO& metatable);

private:
    const char* m_ident;
};

GT_PLATON_END_NAMESPACE()

#endif /*_GEOMETADATALOADER_IMPL_H_*/

