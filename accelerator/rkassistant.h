#ifndef RkAssistant_H
#define RkAssistant_H

#include <QObject>
#include <QString>
#include <QFileIconProvider>
#include <QBuffer>
#include "rkmissionmaker.h"

QT_BEGIN_NAMESPACE

// 入库加速器帮助类
class RkAssistant : public QObject
{
    Q_OBJECT

public:
    explicit RkAssistant(QObject *parent = 0);
    virtual ~RkAssistant();

public:
    // 仅用于测试
    Q_INVOKABLE QString echoText(const QString& text);

    //
    // 列出本机目录结构中的顶层子树
    // @return 返回JSON串。
    // 对于windows系统，返回结果样子如下：
    //     计算机/
    //       C:/
    //       D:/
    //
    Q_INVOKABLE QString fstreeGetRoot();

    //
    // 针对指定的地理资源类型，列出给定父目录下的子目录.
    // @param parentFolder 父目录;
    // @param geoDataType 地理资源类型，取值包括GeoDataType::IMAGE等.
    // @return 返回JSON串。
    //
    Q_INVOKABLE QString fstreeListFolder(const QString& parentFolder, const QString& geoDataType);

    //
    // 针对指定的地理资源类型，列出给定父目录下的子目录或文件.
    // @param parentFolder 父目录;
    // @param geoDataType 地理资源类型，取值包括GeoDataType::IMAGE等.
    // @return 返回JSON串。
    //
    Q_INVOKABLE QString fstreeListFolderOrFile(const QString& parentFolder, const QString& geoDataType);

    //
    // 针对指定的地理资源类型，在给定起始目录下递归遍历所有文件.
    // @param startFolder 起始目录;
    // @param geoDataType 地理资源类型，取值包括GeoDataType::IMAGE等.
    // @return 返回JSON串。
    //
    Q_INVOKABLE QString fstreeScanFile(const QString& startFolder, const QString& geoDataType);

    //
    // 获得给定节点的图标.
    // @param nodePath 节点路径，对应一个目录名或文件名;
    // @param nodeType 节点类型，取值包括FsTreeNodeType::FOLDER等.
    // @return 返回代码图标的DataURL，形如"data:image/png;base64,iVBORW..."
    //
    Q_INVOKABLE QString fstreeGetIcon(const QString& nodePath, int nodeType);

public:
    //
    // 产生入库任务.
    // @param fileOrFolderArray 待入库的文件或目录列表，为JSON格式，类型为字符串数组，形如['c:\\temp\\1.bmp', 'c:\\temp\\2.bmp', ...];
    // @param geoDataType 地理资源类型，取值包括GeoDataType::IMAGE等;
    // @param callerCookie 调用端cookie，其含义由调用端解释;
    // @return 返回JSON串，若出错返回空字符串。
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
