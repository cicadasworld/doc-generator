#ifndef FsTreeLister_H
#define FsTreeLister_H

#include "platon/basetypes/base/status.h"
#include "platon/basetypes/utils/file.h"
#include "platon/scf/freeze/freezable.h"
#include <vector>

GT_PLATON_BEGIN_NAMESPACE()

// 文件系统树监听器
class FsTreeLister
{
public:
    //	
    // 列出本机目录结构中的顶层子树
    // @param  result 顶层子树的数据结构
    // @return 若成功返回ok状态码，否则返回其它状态码。
    //
    static Status getRoot(Freezable*& result);
    
    //
    // 针对指定的地理资源类型，列出给定父目录下的子目录.
    // @param parentFolder 父节点目录名.
    // @param geoDataType 数据类型;
    // @param result 返回数据结构;
    // @return 若成功返回ok状态码。
    //
    static Status listFolder(const String& parentFolder, const String& geoDataType,
                             Freezable*& result);
                             
    //                             
    // 针对指定的地理资源类型，列出给定父目录下的子目录.
    // @param parentFolder 父节点目录名.
    // @param geoDataType 数据类型;
    // @param result 返回数据结构;
    // @return 若成功返回ok状态码。   
    //
    static Status listFolderOrFile(const String& parentFolder, const String& geoDataType,
                                   Freezable*& result);
    //
    // 针对指定的地理资源类型，在给定起始目录下递归遍历所有文件.
    // @param startFolder 递归起始的目录.
    // @param geoDataType 数据类型;
    // @param result 返回数据结构;
    // @return 若成功返回ok状态码。
    //
    static Status scanFile(const String& startFolder, const String& geoDataType,
                           Freezable*& result);

public:
    //
    // 加载支持的影像文件等类型列表
    // @param baseDir 指定的目录.
    // @return 若成功返回ok状态码。
    //
    static Status loadFileTypes(const String& baseDir);

    //
    // 判断给定的文件是否是支持的影像文件 
    // @param of 文件信息.
    // @return 若支持返回true没否则返回false。
    //
    static bool isSupportedImageFile(File& of);

    //
    // 判断给定的文件是否是支持的dem文件
    // @param of 文件信息.
    // @return 若支持返回true没否则返回false。
    //
    static bool isSupportedDemFile(File& of);

    //
    // 判断给定的文件是否是支持的placeName文件 
    // @param of 文件信息.
    // @return 若支持返回true没否则返回false。
    //
    static bool isSupportedPlaceNameFile(File& of);

    //
    // 判断给定的文件夹是否为军交格式的矢量目录
    // @param of 文件信息.
    // @param smsFileName 描述文件名（out）.
    // @param totalFileSize 数据量大小（out）.
    // @return 若支持返回true没否则返回false。
    //
    static bool isSupportedVectorFolder(File& odir, String& smsFileName, size_t& totalFileSize);

    //
	// 判断给定的文件夹是否为地理实体目录（目录与军交格式一样）
    // @param of 文件信息.
    // @param smsFileName 描述文件名（out）.
    // @param totalFileSize 数据量大小（out）.
    // @return 若支持返回true没否则返回false。
    //
	static bool isSupportedGeoEntityFolder(File& odir, String& smsFileName, size_t& totalFileSize);

};

GT_PLATON_END_NAMESPACE()

#endif
