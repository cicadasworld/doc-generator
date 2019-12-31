#if !defined(RkServerMain_H)
#define RkServerMain_H

#include "platon/basetypes/base/status.h"
#include "platon/appenv/support/daemonmain.h"

GT_PLATON_BEGIN_NAMESPACE()

// �����������
class RkServerMain : public DaemonMain
{
public:
    RkServerMain(int argc, char *argv[]);
    virtual ~RkServerMain();

protected:

    //  
    // ��ǰ����������Ҫ�߼�ǰ�����ø÷�����
    // @param argc ��ʼ������;
    // @param argv ��ʼ������;
    // @return ��ʼ���ɹ�Ӧ����0�����򷵻�-1��
    //
    virtual int doInit(int argc, char *argv[]);

    //
    //  ��ǰ���̵���Ҫ�߼�Ӧ���ڸ÷�����ִ�У�Ӧ����������
    // @param ��;
    // @return �ɹ�Ӧ����0�����򷵻�-1��
    //
    virtual void doRun();

    //
    // ��ǰ�����˳�����ǰ�����ø÷�����
    // ����Ӧ���ظ÷����Ըɾ��ͷŸ�����Դ��
    // @param ��;
    // @return void��
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
