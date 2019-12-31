#ifndef FsTreeLister_H
#define FsTreeLister_H

#include "platon/basetypes/base/status.h"
#include "platon/basetypes/utils/file.h"
#include "platon/scf/freeze/freezable.h"
#include <vector>

GT_PLATON_BEGIN_NAMESPACE()

// �ļ�ϵͳ��������
class FsTreeLister
{
public:
    //	
    // �г�����Ŀ¼�ṹ�еĶ�������
    // @param  result �������������ݽṹ
    // @return ���ɹ�����ok״̬�룬���򷵻�����״̬�롣
    //
    static Status getRoot(Freezable*& result);
    
    //
    // ���ָ���ĵ�����Դ���ͣ��г�������Ŀ¼�µ���Ŀ¼.
    // @param parentFolder ���ڵ�Ŀ¼��.
    // @param geoDataType ��������;
    // @param result �������ݽṹ;
    // @return ���ɹ�����ok״̬�롣
    //
    static Status listFolder(const String& parentFolder, const String& geoDataType,
                             Freezable*& result);
                             
    //                             
    // ���ָ���ĵ�����Դ���ͣ��г�������Ŀ¼�µ���Ŀ¼.
    // @param parentFolder ���ڵ�Ŀ¼��.
    // @param geoDataType ��������;
    // @param result �������ݽṹ;
    // @return ���ɹ�����ok״̬�롣   
    //
    static Status listFolderOrFile(const String& parentFolder, const String& geoDataType,
                                   Freezable*& result);
    //
    // ���ָ���ĵ�����Դ���ͣ��ڸ�����ʼĿ¼�µݹ���������ļ�.
    // @param startFolder �ݹ���ʼ��Ŀ¼.
    // @param geoDataType ��������;
    // @param result �������ݽṹ;
    // @return ���ɹ�����ok״̬�롣
    //
    static Status scanFile(const String& startFolder, const String& geoDataType,
                           Freezable*& result);

public:
    //
    // ����֧�ֵ�Ӱ���ļ��������б�
    // @param baseDir ָ����Ŀ¼.
    // @return ���ɹ�����ok״̬�롣
    //
    static Status loadFileTypes(const String& baseDir);

    //
    // �жϸ������ļ��Ƿ���֧�ֵ�Ӱ���ļ� 
    // @param of �ļ���Ϣ.
    // @return ��֧�ַ���trueû���򷵻�false��
    //
    static bool isSupportedImageFile(File& of);

    //
    // �жϸ������ļ��Ƿ���֧�ֵ�dem�ļ�
    // @param of �ļ���Ϣ.
    // @return ��֧�ַ���trueû���򷵻�false��
    //
    static bool isSupportedDemFile(File& of);

    //
    // �жϸ������ļ��Ƿ���֧�ֵ�placeName�ļ� 
    // @param of �ļ���Ϣ.
    // @return ��֧�ַ���trueû���򷵻�false��
    //
    static bool isSupportedPlaceNameFile(File& of);

    //
    // �жϸ������ļ����Ƿ�Ϊ������ʽ��ʸ��Ŀ¼
    // @param of �ļ���Ϣ.
    // @param smsFileName �����ļ�����out��.
    // @param totalFileSize ��������С��out��.
    // @return ��֧�ַ���trueû���򷵻�false��
    //
    static bool isSupportedVectorFolder(File& odir, String& smsFileName, size_t& totalFileSize);

    //
	// �жϸ������ļ����Ƿ�Ϊ����ʵ��Ŀ¼��Ŀ¼�������ʽһ����
    // @param of �ļ���Ϣ.
    // @param smsFileName �����ļ�����out��.
    // @param totalFileSize ��������С��out��.
    // @return ��֧�ַ���trueû���򷵻�false��
    //
	static bool isSupportedGeoEntityFolder(File& odir, String& smsFileName, size_t& totalFileSize);

};

GT_PLATON_END_NAMESPACE()

#endif
