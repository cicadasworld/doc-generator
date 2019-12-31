#ifndef RkMissionMaker_H
#define RkMissionMaker_H

#include "platon/basetypes/base/status.h"
#include "platon/basetypes/concurrent/mutex.h"
#include "platon/scf/freeze/stringseq.fz.h"
#include <functional>

GT_PLATON_BEGIN_NAMESPACE()

// ���ڲ�������������ݶ���
class RkMissionMaker
{
public:
    RkMissionMaker();
    ~RkMissionMaker();

public:
    //
    // ����Ӱ���Ʒ������������ݶ���.
    // @param imageFiles �����Ӱ���ļ����б�;
    // @param errorListener �������ɹ������������˴��󣬽�֪ͨ�ü�����;
    // @param progressListener �������ɹ������������˴��󣬽�֪ͨ�ü�����;
    // @param result ����Ӱ���ļ�����������ݶ���;
    // @return ���ɹ�����ok״̬�룬���򷵻�����״̬�롣
    //
    Status makeImageRkMission(StringSeq& imageFiles,
                              std::function<void(const String& imageFileName, const String& error)> errorListener,
                              std::function<void(const String& imageFileName)> progressListener,
                              Freezable*& result);

    //
    // ����DEM��Ʒ������������ݶ���.
    // @param demFiles �����DEM�ļ����б�;
    // @param errorListener �������ɹ������������˴��󣬽�֪ͨ�ü�����;
    // @param progressListener �������ɹ������������˴��󣬽�֪ͨ�ü�����;
    // @param result ����DEM�ļ�����������ݶ���;
    // @return ���ɹ�����ok״̬�룬���򷵻�����״̬�롣
    //
    Status makeDemRkMission(StringSeq& demFiles,
                            std::function<void(const String& demFileName, const String& error)> errorListener,
                            std::function<void(const String& demFileName)> progressListener,
                            Freezable*& result);

    //
    // ����Vector��Ʒ������������ݶ���.
    // @param vectorFolders �����VectorĿ¼���б�;
    // @param errorListener �������ɹ������������˴��󣬽�֪ͨ�ü�����;
    // @param progressListener �������ɹ������������˴��󣬽�֪ͨ�ü�����;
    // @param result ����Vector��Ʒ����������ݶ���;
    // @return ���ɹ�����ok״̬�룬���򷵻�����״̬�롣
    //
    Status makeVectorRkMission(StringSeq& vectorFolderss,
                               std::function<void(const String& vectorFolderName, const String& error)> errorListener,
                               std::function<void(const String& vectorFolderName)> progressListener,
                               Freezable*& result);

    //
    // ����������Ʒ������������ݶ���.
    // @param dmFiles ���������ļ����б�;
    // @param errorListener �������ɹ������������˴��󣬽�֪ͨ�ü�����;
    // @param progressListener �������ɹ������������˴��󣬽�֪ͨ�ü�����;
    // @param result ���ص����ļ�����������ݶ���;
    // @return ���ɹ�����ok״̬�룬���򷵻�����״̬�롣
    //
    Status makePlaceNameRkMission(StringSeq& dmFiles,
                                  std::function<void(const String& dmFileName, const String& error)> errorListener,
                                  std::function<void(const String& dmFileName)> progressListener,
                                  Freezable*& result);


	//
	// ����GeoEntity��Ʒ������������ݶ���.
	// @param geoEntityFolders �����geoEntityĿ¼���б�;
	// @param errorListener �������ɹ������������˴��󣬽�֪ͨ�ü�����;
	// @param progressListener �������ɹ������������˴��󣬽�֪ͨ�ü�����;
	// @param result ����Vector��Ʒ����������ݶ���;
	// @return ���ɹ�����ok״̬�룬���򷵻�����״̬�롣
	//
	Status makeGeoEntityRkMission(StringSeq& geoEntityFolderss,
		std::function<void(const String& vectorFolderName, const String& error)> errorListener,
		std::function<void(const String& vectorFolderName)> progressListener,
		Freezable*& result);


private:
    // ȷ��Ӱ���Ʒ������Щ�ļ�
    Status getImageFileList(const String& imageFile, Freezable& imageEntityDO);

private:
    Status getFileServerAddress(String& ip, int& port);

    // ������Դ��Ԫ���ݣ�����Ψһ��ID
    String generateResId(Freezable& geoEntityDescriptorDO);


	// �ж�Ԫ���ݿ����Ƿ��Ѿ�����ͬ��ResID
	Status existGeoResID(const String& geoResID);

private:
    // ���ص��ļ���������ַ
    String m_fileServerIp;
    int    m_fileServerPort;
    Mutex  m_lock;

    const char *m_ident;
};

GT_PLATON_END_NAMESPACE()

#endif // RkMissionMaker_H
