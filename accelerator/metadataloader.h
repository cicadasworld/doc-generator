#ifndef _NGIS_DATAMAN_MetadataParser_
#define _NGIS_DATAMAN_MetadataParser_

#include "platon/basetypes/base/status.h"
#include "entity_descriptor.h"
#include "constants.h"

GT_PLATON_BEGIN_NAMESPACE()

typedef gtcloud::geodata::metadata::pdo::GeoEntityDescriptorDO GeoEntityDescriptorDO;

// 元数据加载器, 完成DOM, 矢量等地理数据产品的元数据解析及加载
class GeoMetadataLoader
{
public:
    virtual void cleanUp() = 0;

public:
    //
    // 解析影像产品的元数据
    // @param imageFileName 影像文件名, 如 C:\Data\N0651.tif 等
    // @param metatable 返回解析得到的元数据表
    // @return 若成功返回ok状态码。
    //
    virtual Status loadMetadata_Image(const String& imageFileName, GeoEntityDescriptorDO& metatable) = 0;

    //
    // 解析高程产品的元数据
    // @param demFileName 高程文件名, 如 C:\Data\N0651.egx 等
    // @param metatable 返回解析得到的元数据表
    // @return 若成功返回ok状态码。
    //
    virtual Status loadMetadata_DEM(const String& demFileName, GeoEntityDescriptorDO& metatable) = 0;

    //
    // 解析矢量数据产品(新军标交换格式)的元数据
    // @param smsFileName 矢量数据的属性描述文件, 如 G:\RasterData\产品库\XJBJH\N0650\N0650.SMS 等
    // @param metatable 返回解析得到的元数据表
    // @return 若成功返回ok状态码。
    //
    virtual Status loadMetadata_Vector_XJBJH(const String& smsFileName, GeoEntityDescriptorDO& metatable) = 0;

    //
    // 解析地名数据产品的元数据(.dm格式)
    // @param dmFileName 地名数据文件, 如 G:\RasterData\产品库\1.dm 等
    // @param metatable 返回解析得到的元数据表
    // @return 若成功返回ok状态码。
    //
    virtual Status loadMetadata_PlaceName_DM(const String& dmFileName, GeoEntityDescriptorDO& metatable) = 0;

	//
	// 解析地理实体数据产品(与新军标交换格式基本一样)的元数据
	// @param smsFileName 地理实体数据的属性描述文件, 如 G:\RasterData\产品库\XJBJH\N0650\N0650.SMS 等
	// @param metatable 返回解析得到的元数据表
	// @return 若成功返回ok状态码。
	//
	virtual Status loadMetadata_GeoEntity_XJBJH(const String& smsFileName, GeoEntityDescriptorDO& metatable) = 0;


public:
    //
    // 获得影像的高宽。
    // @param imageFileName 影像文件名, 如 G:\RasterData\产品库\1.tiff 等.
    // @param outHeight 返回影像的像素高;
    // @param outWidth 返回影像的像素宽;
    // @return 若成功返回ok状态码。
    //
    virtual Status getImageSize(const String& imageFileName, int& outHeight, int& outWidth) = 0;

};

GT_PLATON_END_NAMESPACE()

extern "C" GT_PLATON_NS::GeoMetadataLoader* GT_GetGeoMetadataLoader();

#endif /*_NGIS_DATAMAN_MetadataParser_*/
