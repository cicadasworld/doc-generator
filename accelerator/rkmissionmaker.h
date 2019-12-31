#ifndef RkMissionMaker_H
#define RkMissionMaker_H

#include "platon/basetypes/base/status.h"
#include "platon/basetypes/concurrent/mutex.h"
#include "platon/scf/freeze/stringseq.fz.h"
#include <functional>

GT_PLATON_BEGIN_NAMESPACE()

// 用于产生入库任务数据对象
class RkMissionMaker
{
public:
    RkMissionMaker();
    ~RkMissionMaker();

public:
    //
    // 产生影像产品的入库任务数据对象.
    // @param imageFiles 待入库影像文件名列表;
    // @param errorListener 任务生成过程中若出现了错误，将通知该监听器;
    // @param progressListener 任务生成过程中若出现了错误，将通知该监听器;
    // @param result 返回影像文件入库任务数据对象;
    // @return 若成功返回ok状态码，否则返回其它状态码。
    //
    Status makeImageRkMission(StringSeq& imageFiles,
                              std::function<void(const String& imageFileName, const String& error)> errorListener,
                              std::function<void(const String& imageFileName)> progressListener,
                              Freezable*& result);

    //
    // 产生DEM产品的入库任务数据对象.
    // @param demFiles 待入库DEM文件名列表;
    // @param errorListener 任务生成过程中若出现了错误，将通知该监听器;
    // @param progressListener 任务生成过程中若出现了错误，将通知该监听器;
    // @param result 返回DEM文件入库任务数据对象;
    // @return 若成功返回ok状态码，否则返回其它状态码。
    //
    Status makeDemRkMission(StringSeq& demFiles,
                            std::function<void(const String& demFileName, const String& error)> errorListener,
                            std::function<void(const String& demFileName)> progressListener,
                            Freezable*& result);

    //
    // 产生Vector产品的入库任务数据对象.
    // @param vectorFolders 待入库Vector目录名列表;
    // @param errorListener 任务生成过程中若出现了错误，将通知该监听器;
    // @param progressListener 任务生成过程中若出现了错误，将通知该监听器;
    // @param result 返回Vector产品入库任务数据对象;
    // @return 若成功返回ok状态码，否则返回其它状态码。
    //
    Status makeVectorRkMission(StringSeq& vectorFolderss,
                               std::function<void(const String& vectorFolderName, const String& error)> errorListener,
                               std::function<void(const String& vectorFolderName)> progressListener,
                               Freezable*& result);

    //
    // 产生地名产品的入库任务数据对象.
    // @param dmFiles 待入库地名文件名列表;
    // @param errorListener 任务生成过程中若出现了错误，将通知该监听器;
    // @param progressListener 任务生成过程中若出现了错误，将通知该监听器;
    // @param result 返回地名文件入库任务数据对象;
    // @return 若成功返回ok状态码，否则返回其它状态码。
    //
    Status makePlaceNameRkMission(StringSeq& dmFiles,
                                  std::function<void(const String& dmFileName, const String& error)> errorListener,
                                  std::function<void(const String& dmFileName)> progressListener,
                                  Freezable*& result);


	//
	// 产生GeoEntity产品的入库任务数据对象.
	// @param geoEntityFolders 待入库geoEntity目录名列表;
	// @param errorListener 任务生成过程中若出现了错误，将通知该监听器;
	// @param progressListener 任务生成过程中若出现了错误，将通知该监听器;
	// @param result 返回Vector产品入库任务数据对象;
	// @return 若成功返回ok状态码，否则返回其它状态码。
	//
	Status makeGeoEntityRkMission(StringSeq& geoEntityFolderss,
		std::function<void(const String& vectorFolderName, const String& error)> errorListener,
		std::function<void(const String& vectorFolderName)> progressListener,
		Freezable*& result);


private:
    // 确定影像产品包含哪些文件
    Status getImageFileList(const String& imageFile, Freezable& imageEntityDO);

private:
    Status getFileServerAddress(String& ip, int& port);

    // 给定资源的元数据，产生唯一性ID
    String generateResId(Freezable& geoEntityDescriptorDO);


	// 判断元数据库中是否已经有相同的ResID
	Status existGeoResID(const String& geoResID);

private:
    // 本地的文件服务器地址
    String m_fileServerIp;
    int    m_fileServerPort;
    Mutex  m_lock;

    const char *m_ident;
};

GT_PLATON_END_NAMESPACE()

#endif // RkMissionMaker_H
