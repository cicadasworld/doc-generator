#if !defined(RkServerMain_H)
#define RkServerMain_H

#include "platon/basetypes/base/status.h"
#include "platon/appenv/support/daemonmain.h"

GT_PLATON_BEGIN_NAMESPACE()

// 入库加速器入口
class RkServerMain : public DaemonMain
{
public:
    RkServerMain(int argc, char *argv[]);
    virtual ~RkServerMain();

protected:

    //  
    // 当前进程运行主要逻辑前将调用该方法。
    // @param argc 初始化参数;
    // @param argv 初始化参数;
    // @return 初始化成功应返回0，否则返回-1。
    //
    virtual int doInit(int argc, char *argv[]);

    //
    //  当前进程的主要逻辑应放在该方法中执行，应由子类重载
    // @param 无;
    // @return 成功应返回0，否则返回-1。
    //
    virtual void doRun();

    //
    // 当前进程退出运行前将调用该方法。
    // 子类应重载该方法以干净释放各种资源。
    // @param 无;
    // @return void。
    //
    virtual void doCleanup();

private:
    int64_t m_bornTime;
    String  m_mainResBundleName;
    String  m_listenAddr;
    String  m_listenPort;
    char**  m_argv;
    int     m_argc;

    static void wait_quit_event_proc(void* arg);
};

GT_PLATON_END_NAMESPACE()

#endif // !defined(RkServerMain_H)
