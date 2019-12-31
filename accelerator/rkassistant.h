#ifndef RkAssistant_H
#define RkAssistant_H

#include <QObject>
#include <QString>
#include <QFileIconProvider>
#include <QBuffer>
#include "rkmissionmaker.h"

QT_BEGIN_NAMESPACE

// ��������������
class RkAssistant : public QObject
{
    Q_OBJECT

public:
    explicit RkAssistant(QObject *parent = 0);
    virtual ~RkAssistant();

public:
    // �����ڲ���
    Q_INVOKABLE QString echoText(const QString& text);

    //
    // �г�����Ŀ¼�ṹ�еĶ�������
    // @return ����JSON����
    // ����windowsϵͳ�����ؽ���������£�
    //     �����/
    //       C:/
    //       D:/
    //
    Q_INVOKABLE QString fstreeGetRoot();

    //
    // ���ָ���ĵ�����Դ���ͣ��г�������Ŀ¼�µ���Ŀ¼.
    // @param parentFolder ��Ŀ¼;
    // @param geoDataType ������Դ���ͣ�ȡֵ����GeoDataType::IMAGE��.
    // @return ����JSON����
    //
    Q_INVOKABLE QString fstreeListFolder(const QString& parentFolder, const QString& geoDataType);

    //
    // ���ָ���ĵ�����Դ���ͣ��г�������Ŀ¼�µ���Ŀ¼���ļ�.
    // @param parentFolder ��Ŀ¼;
    // @param geoDataType ������Դ���ͣ�ȡֵ����GeoDataType::IMAGE��.
    // @return ����JSON����
    //
    Q_INVOKABLE QString fstreeListFolderOrFile(const QString& parentFolder, const QString& geoDataType);

    //
    // ���ָ���ĵ�����Դ���ͣ��ڸ�����ʼĿ¼�µݹ���������ļ�.
    // @param startFolder ��ʼĿ¼;
    // @param geoDataType ������Դ���ͣ�ȡֵ����GeoDataType::IMAGE��.
    // @return ����JSON����
    //
    Q_INVOKABLE QString fstreeScanFile(const QString& startFolder, const QString& geoDataType);

    //
    // ��ø����ڵ��ͼ��.
    // @param nodePath �ڵ�·������Ӧһ��Ŀ¼�����ļ���;
    // @param nodeType �ڵ����ͣ�ȡֵ����FsTreeNodeType::FOLDER��.
    // @return ���ش���ͼ���DataURL������"data:image/png;base64,iVBORW..."
    //
    Q_INVOKABLE QString fstreeGetIcon(const QString& nodePath, int nodeType);

public:
    //
    // �����������.
    // @param fileOrFolderArray �������ļ���Ŀ¼�б�ΪJSON��ʽ������Ϊ�ַ������飬����['c:\\temp\\1.bmp', 'c:\\temp\\2.bmp', ...];
    // @param geoDataType ������Դ���ͣ�ȡֵ����GeoDataType::IMAGE��;
    // @param callerCookie ���ö�cookie���京���ɵ��ö˽���;
    // @return ����JSON�����������ؿ��ַ�����
    //
    Q_INVOKABLE QString makeRkMission(const QString& fileOrFolderArray,
                                      const QString& geoDataType,
                                      const QString& callerCookie);
protected slots:
    //void sendKeepAlive();

signals:
    void rkMissionMakeProgress(const QString& callerCookie, const QString& fileOrFolder);
    void rkMissionMakeError(const QString& callerCookie, const QString& fileOrFolder, const QString& errormsg);

private:
    QFileIconProvider      m_iconProvider;
    platon::RkMissionMaker m_rkMissionMaker;
};

QT_END_NAMESPACE

#endif // RkAssistant_H
