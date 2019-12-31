
//TaskControlView.function ���������
gtgdm.TaskControlView = function ( ) {
//Ŀǰ����֧���κ��ֶε����� ����ɾ�����

    this.timer = null;
    this.taskManager = null;//��ʼ����ʹ��
    this.popSteps = null;
    this.bSearchByFactor = false;// false  ���Զ�̬��������ģ� true��ʾͨ��������ѯ�� ���� ״̬��Ϣ�� ���ڡ� ip �ȣ� ��ʱ��֧�ֶ�̬��ӵ�Ч��
    this.initUI();
};
//TaskControlView.prototype.initUI �����������ʼ��
gtgdm.TaskControlView.prototype.initUI = function () {

    var endpoint = gtgdm.Global.getAppContext_Localpath() + 'mconsole/gdmp/bzk/eggs/taskmanage/taskmanage.html';
    var promise = gtgdm.utils.getText(endpoint);
    let self = this;
    promise.then(function (html) {
        $('#missionView').append(html);//��ʼ��html����
        self.initTaskInfoUI();//��������һ��taskinfo��Ϣ�ĵ���¼�����ѯ����Ӧ������չʾ��dataGrid��
        self.initSearchUI();// ��ʼ���������ڵȽ���
        self.initTaskGridUI();// ��ʼ���������dataGrid�Ľ���
    })
	.catch(function (error) {
		// TODO: ������
		console.log('Error: ' + error);
	});


};
// TaskControlView.prototype.initTaskInfoUI ��ʼ�� ������״̬��Ϣ
gtgdm.TaskControlView.prototype.initTaskInfoUI = function () {
    var self = this;
    $("#all-tasks-text").linkbutton({
        plain:true,
        onClick:function () {
            self.bSearchByFactor = false;
            if(self.taskManager)
            {
                $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid);
            }
        }
    })
    $("#finish-tasks-text").linkbutton({
        plain:true,
        onClick:function () {
            self.bSearchByFactor = true;
            if(self.taskManager)
            {
                $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid_ok);
            }
        }
    })
    $("#carry-on-tasks-text").linkbutton({
        plain:true,
        onClick:function () {
            self.bSearchByFactor = true;
            if(self.taskManager)
            {
                $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid_processing);
            }
        }
    })
    // $("#wait-tasks-text").linkbutton({
    //     plain:true,
    //     onClick:function () {
    //         self.bSearchByFactor = true;
    //         if(self.taskManager)
    //         {
    //             $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid_waiting);
    //         }
    //     }
    // })
    // $("#fail-tasks-text").linkbutton({
    //     plain:true,
    //     onClick:function () {
    //         self.bSearchByFactor = true;
    //         if(self.taskManager)
    //         {
    //             $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid_failed);
    //         }
    //     }
    // })

}

// TaskControlView.prototype.initSearchUI��ʼ���������ڵȽ���
gtgdm.TaskControlView.prototype.initSearchUI = function() {
    let self= this;
    $('#search-ip').linkbutton({
        onClick:function () {
            // GET /geodata/v1/missions/query?from={from}&to={to}&host={host}
            //     host���ύ���������IP��Ĭ�Ϸ��صĽ���ǰ��ύʱ���ֶν���
            var strHost = $('#inputIP').val();
             self.bSearchByFactor = true;
            self.setGridData(null, null, gtgdm.Global.getAppContext() + "geodata/v1/missions/query",strHost);
        }
    });
    $('#start-date').datebox({ });
    $('#expiry-date').datebox({ });
    $('#search-date').linkbutton({
        // plain:true,
        onClick:function () {
            self.bSearchByFactor = true;
            var start_date_val = document.getElementById("start-date").value;
            var expiry_date_val = document.getElementById("expiry-date").value;
            self.setGridData(start_date_val, expiry_date_val, gtgdm.Global.getAppContext() + "geodata/v1/missions/query");
        }
    });
    $('#show-all-task').linkbutton({
        // plain:true,
        onClick:function () {
            self.bSearchByFactor = false;
            self.setGridData(null, null, gtgdm.Global.getAppContext() + "geodata/v1/missions");
        }
    });
}
// TaskControlView.prototype.initTaskGridUI��ʼ���������dataGrid�Ľ���
gtgdm.TaskControlView.prototype.initTaskGridUI = function()
{
	var self = this;
    $('#task-manage').datagrid({
        title: '�������',
        fitColumns: true,
        striped: true,//��ż��ʹ�ò�ͬ�ı���ɫ
        rownumbers: true,//�����к�
        singleSelect : true,
        pageNumber:1,
        pagination:true,//��ҳ
        pageSize: 20,
        pageList: [20],
        loadFilter:self.pageFilter,
        //autoRowHeight:true,
        //nowrap: true,
        loadMsg: '',
        height: document.body.scrollHeight - 170,
        width:document.body.scrollWidth-20,
        //multiSort: false,//�Ƿ��������
		remotesort:false,//�Ƿ�ӷ�������������
         //sortName: 'task_missionEpoch',
         //sortOrder:'desc',
        columns: [[
            {
                field: 'task_state',// ����״̬ͼƬ���������첻��ȷ?????��ô�޸�
                title: '����״̬',
                width: 300,
                align: 'center',
            },{
                field: 'task_caption',
                title: '��������',
                width: 300,
                align: 'center',
            },{
                field: 'task_missionEpoch',
                title: '�ύʱ��',
                width: 300,
                align: 'center'
            },{
                field: 'task_submitterUserId',
                title: '�ύ�û�',
                width: 300,
                align: 'center'
            },{
                field: 'task_submitterHost',
                title: '����IP',
                width: 300,
                align: 'center'
            },{
                field: 'task_schedule',
                title: '�������',
                width: 300,
                align: 'center'

            }]],
        view: detailview,
        detailFormatter:function(index, row){
            return '<div style="padding:0px;"><div id="ddv-' + index + '"></div></div>';// padding �����Ͻ�ƽ�Ʋ������м��
        },
        onSortColumn:function (sort,order) {


        },
        onResize:function () {
            
        },
        onLoadSuccess: function () {
            // setTimeout(function () {
            //     $('#task-manage').datagrid('fixDetailRowHeight', index);
            // }, 0)
        },
        onExpandRow: function(index,row){
            self.expandOneTask(index,row);
        }
        ,
        onCollapseRow:function(index,row){

        }
    });
    $('#task-manage').datagrid('loadData', []);
    this.setGridData(null,null,gtgdm.Global.getAppContext() + "geodata/v1/missions");
}

// $('#task-manage') �� loadFilter��ҳ���� �ص�����
//TaskControlView.prototype.pageFilter ��������ҳ����
gtgdm.TaskControlView.prototype.pageFilter = function(data) {
    if(typeof  data.length === 'number' && typeof data.splice === 'function')
    {
        data = {
            total: data.length,
            rows:data
        };
    }
    var dg = $('#task-manage');
    var opts = dg.datagrid('options');
    var pager = dg.datagrid('getPager');
    pager.pagination({
        onSelectPage:function (num,size) {
            opts.pageNumber = num;
            opts.pageSize = size;
            pager.pagination('refresh',{
                pageNumber:num,
                pageSize:size
            });
            dg.datagrid('loadData',data);
        }
    });
    if(!data.originalRows){
        data.originalRows = (data.rows);
    }
    var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
    var end = start + parseInt(opts.pageSize);
    data.rows = data.originalRows.slice(start,end);
    return data;

}
gtgdm.TaskControlView.prototype.collapseOneTask = function (index,row) {

}
//TaskControlView.prototype.expandOneTask չ����������Ϣ
gtgdm.TaskControlView.prototype.expandOneTask = function (index,row) {
	var self = this;
    // var ddv = $('#task-manage').datagrid('getRowDetail',index).find('#ddv');
    // ddv.datagrid({
    $('#ddv-' + index ).datagrid({
        fitColumns: true,
        rownumbers: true,
        singleSelect: true,
        width: 1200,
        loadMsg: '',
        height: 170,
        columns: [[
            {
                field: 'item_file_state',
                title: '�ļ�״̬',
                width: 100,
                align: 'center'
            }, {
                field: 'item_file_name',
                title: '�ļ���',
                width: 300,
                align: 'center'
            },
            {
                field: 'item_inputdb_starttime',
                title: '��⿪ʼʱ��',
                width: 100,
                align: 'center'
            }, {
                field: 'item_inputdb_endtime',
                title: '������ʱ��',
                width: 100,
                align: 'center'
            },
            {
                field: 'item_process_starttime',
                title: '���񻯴���ʼʱ��',
                width: 100,
                align: 'center'
            }, {
                field: 'item_process_endtime',
                title: '���񻯴������ʱ��',
                width: 100,
                align: 'center'
            }
        ]],
        onClickRow: function (rowIndex, event) {
            if(self.popSteps){
                self.popSteps.clear();
                self.popSteps =  new gtgdm.StepPopupFrame();
            }
            else{
                self.popSteps =  new gtgdm.StepPopupFrame();
            }
            stopBubble(event);
            var urlitem= gtgdm.Global.getAppContext() + "geodata/v1/missions/items/" + self.taskManager.majorTaskArray_Datagrid[index].subTaskArray_Datagrid[rowIndex].id;
            self.popSteps.stepsUpdate(self.taskManager.majorTaskArray_Datagrid[index].subTaskArray_Datagrid[rowIndex].subTaskPopArray_Datagrid,self.taskManager,urlitem);
            self.popSteps.close_img.onclick = function(){
                self.popSteps.step_popup_box.remove();
            };
            document.onclick = function(){
                self.popSteps.step_popup_box.remove();
                document.onclick = null;
            }
        }
        ,
        onResize: function () {
            $('#task-manage').datagrid('fixDetailRowHeight', index);
            // $('#task-manage').datagrid('fixRowHeight', index);
            //console.log('111111111111111111111111111111111111111111');
            // $('#ddv-' + index ).datagrid('loadData', self.taskManager.majorTaskArray_Datagrid[index].subTaskArray_Datagrid);
        }
        // ,
        // onLoadSuccess: function () {
        //     setTimeout(function () {
        //         $('#task-manage').datagrid('fixDetailRowHeight', index);
        //         $('#task-manage').datagrid('fixRowHeight',index);
        //     }, 0)
        // }
    });
    $('#task-manage').datagrid('fixDetailRowHeight',index);
    // $('#ddv-' + index ).datagrid('loadData',[]);
    $('#ddv-' + index ).datagrid('loadData',self.taskManager.majorTaskArray_Datagrid[index].subTaskArray_Datagrid);
}
//����������
gtgdm.TaskControlView.prototype.setGridData = function (start_Date, end_Date, url, host) {
		let self = this;
		$.ajax({
	  	  	  type: "GET",
	  	  	  url: url,
	  	  	  data: {
	  	  		  from: start_Date,
	  	  		  to: end_Date,
                  host:host

	  	  	  },
	  	  	  dataType: "json",
	  	  	  success: function(data){
	  	  		  retdata = data.retdata;
	  	  		  if(retdata.length == 0){
		  	  			$('#task-manage').datagrid('loadData', []);
		  	  			return;
	  	  		  }
				  self.taskManager = new gtgdm.TaskManager(retdata);
                  $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid);
	  	  	  },
	  	  	  error: function(){
	  	  	  }
	  	});
}

//��������һ��ͳ����Ϣ
gtgdm.TaskControlView.prototype.updateTotalinfo = function () {
    var self = this;
    $("#all-tasks").html(self.taskManager.totalTaskInfo.nTotal + '������');
    $("#finish-tasks").html(self.taskManager.totalTaskInfo.nFinished + '������');//����һ�е�n������  \u4e2a\u4efb\u52a1 ������
    $("#carry-on-tasks").html(self.taskManager.totalTaskInfo.nProcessing + '������');
    // $("#wait-tasks").html(self.taskManager.totalTaskInfo.nWaiting + '������');
    // $("#fail-tasks").html(self.taskManager.totalTaskInfo.nFailed + '������');
}
gtgdm.TaskControlView.prototype.timeOut = function () {
	let self = this;
	clearInterval(self.timer);
    self.timer = setInterval(function () {
	    	$.ajax({
	          type: "GET",
	          url: gtgdm.Global.getAppContext() +  "geodata/v1/missions",
	          dataType: 'json',
	          success: function(data){

	              //if(self.bSearchByFactor) return;//�����ڸ���ʱ ��ˢ���µ���
                  if($('#mainTabs').tabs('getSelected').panel('options').id !== "missionView")
                        return ; //������������� ��ˢ��

		          var retdata2 = data.retdata;
                  if(!self.bSearchByFactor)
                  {
                      var manager = new gtgdm.TaskManager(retdata2);
                      self.taskManager = manager;
                      //��ϸ�������,���һ��row , ֻ������һ��
                      let row = $('#task-manage').datagrid('getRows');
                      var page =  $('#task-manage').datagrid('getPager');
                      var opts = $('#task-manage').datagrid('getPager').pagination('options');
                      var nCurLength = opts.pageSize * (opts.pageNumber-1);
                      var nPageFull = opts.pageSize * opts.pageNumber;
                      //  ���ǰ������������Ǽ��������߸��࣬ Ҳ��һ���Ե� ����ȫ����json���ݴ洢�� �������ܴ�
                      //���������row��
                      var len_temp = self.taskManager.majorTaskArray_Datagrid.length;
                      if(row.length == 0 && len_temp > 0){
                          $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid);//��ǰdatagrid ��û�����ݣ� ��һ���������
                          // $('#task-manage').datagrid('expandRow',0);
                      }
                      else if(row.length>0 &&((nCurLength + row.length) < nPageFull ) && (nCurLength + row.length)< retdata2.length){// ������row �������ǵ�ǰ��ҳ�� û�������Ѿ����Ͳ�����ʾ��
                          // let nNeedInput = retdata2.length - (nCurLength + row.length);
                          // let index = row.length;
                          // for(let i=retdata2.length-nNeedInput;i< retdata2.length;i++){// ������row �����Ƕ��ҳ���ύ�ģ� �����Ƕ��
                          //     $('#task-manage').datagrid('appendRow', self.taskManager.majorTaskArray_Datagrid[i]);
                          // } ע�͵���ЩҲ��ȷ�����ǻᵼ�²��ֲ���ȷ
                          $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid);
                      }
                      else{
                             self.updateMajorGrid();
                      }
                      // var gridData = $('#task-manage').datagrid('getData');// �Ѿ���ҳ�� ����ʹ��self.data_�ĳ���
                      // gridData.originalRows.indexOf(obj)
                      // gridData.rows .indexOf(obj)
                      // $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid);//ȫ�����£� �����ط�����Ҫ�ٸ��� ֱ��ȡֵ , ����᲻��ȷ load�Ǻͺ�̨������

                  }
                  //��������һ��ͳ����Ϣ
                  self.updateTotalinfo();

	          },
	          error:function(){

	          }
	    	});

	  },1000)

}
gtgdm.TaskControlView.prototype.updateMajorGrid = function () {
    //����״̬�кͽ�������Ϣ�� ����� ����� ������Ҫ���£� ��Ȼȫ�����µĻ� ������
    var self = this;
    var len_temp = self.taskManager.majorTaskArray_Datagrid.length;
    for(let nn =0; nn < len_temp; nn++){//��0 ���Ǳ���
        var str_state = $("[field = 'task_state']").eq(nn+1)[0].textContent;
        if( str_state.trim() == '�����')
        {
            continue;
        }
        // $('#task-manage').datagrid('updateRow', {index:nn,row:self.taskManager.majorTaskArray_Datagrid[nn]});//��Ϊ���ӱ�� �᲻ͣ��չ���ջأ� ����expandRow��Ч��Ҳ���ã� ֱ�Ӹ��µ�Ԫ���
        $("[field = 'task_state']").eq(nn+1).html(self.taskManager.majorTaskArray_Datagrid[nn].task_state);//self.taskManager.majorTaskArray_Datagrid[nn].task_state;
        $("[field = 'task_schedule']").eq(nn+1).html(self.taskManager.majorTaskArray_Datagrid[nn].task_schedule);//self.taskManager.majorTaskArray_Datagrid[nn].task_schedule;
        self.updateSubGrid(nn);
    }
}

gtgdm.TaskControlView.prototype.updateSubGrid = function (index) {
/*
sub ��
 <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c7-item_file_state"><img src="mconsole/gdmp/bzk/images/missionimg-001.png" style="width:20px;">&nbsp;&nbsp;<span style="color:#333; font-weight:bold;">�ȴ���</span></div>
 <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c7-item_inputdb_starttime">---</div>
 <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c7-item_inputdb_endtime">---</div>
 <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c7-item_process_starttime">---</div>
 <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c7-item_process_endtime">---</div>
* */
    var self = this;
    if($("[field = 'item_file_state']").length == 0) {
        return;
    }
    var len_temp = self.taskManager.majorTaskArray_Datagrid[index].subTaskArray_Datagrid.length;
    for(let nn =0; nn < len_temp; nn++){//��0 ���Ǳ���
        var str_state = $("[field = 'item_file_state']").eq(nn+1)[0].textContent;
        if( str_state.trim() == '�����')
        {
            continue;
        }
        $('#ddv-' + index ).datagrid('updateRow', {index:nn,row:self.taskManager.majorTaskArray_Datagrid[index].subTaskArray_Datagrid[nn]});
        // $('#ddv-' + index ).datagrid('refreshRow', nn);
    }

    // $('#ddv-' + index ).datagrid('loadData', self.taskManager.majorTaskArray_Datagrid[index].subTaskArray_Datagrid);
}
gtgdm.StepPopupFrame = function () {
    this.missionView = $('#missionView');

    this.step_popup_box = document.createElement("div");
    this.step_popup_box.className = "step-popup-box";//�����taskcontrol.css ��������
    this.step_popup_box.id = "step-popup-box";
    this.missionView.append(this.step_popup_box);

    this.close_div = document.createElement("div");
    this.close_div.className = "close-div";
    this.step_popup_box.append(this.close_div);

    this.close_img = document.createElement("img");
    this.close_img.src =  gtgdm.Global.getAppContext() + "mconsole/gdmp/bzk/images/fail.png";
    this.close_img.style.display = "block";
    this.close_img.style.width = 26 + "px";
    this.close_img.style.position = "absolute";
    this.close_img.style.right = 10 + "px";
    this.close_div.append(this.close_img);
    this.close_img.onmouseover = function(){
        this.style.borderRadius = "15px";
        this.style.boxShadow = "0px 0px 15px #f00";
    }
    this.close_img.onmouseout = function(){
        this.style.borderRadius = "15px";
        this.style.boxShadow = "0px 0px 15px #fff";
    }

    this.steps_ul = document.createElement("ul");
    this.steps_ul.className = "steps-ul";
    this.step_popup_box.append(this.steps_ul);

    this.steps_title_caption = document.createElement("li");
    this.steps_title_caption.innerHTML = "����";//����
    this.steps_title_caption.style.fontWeight = "bold";
    this.steps_title_caption.style.fontSize = 16 + "px";
    this.steps_ul.append(this.steps_title_caption);

    this.steps_title_state = document.createElement("li");
    this.steps_title_state.innerHTML = "״̬";//״̬
    this.steps_title_state.style.fontWeight = "bold";
    this.steps_title_state.style.fontSize = 16 + "px";
    this.steps_ul.append(this.steps_title_state);

    this.steps_title_start = document.createElement("li");
    this.steps_title_start.innerHTML = "��ʼʱ��";// ��ʼʱ��
    this.steps_title_start.style.fontWeight = "bold";
    this.steps_title_start.style.fontSize = 16 + "px";
    this.steps_ul.append(this.steps_title_start);

    this.steps_title_finish = document.createElement("li");
    this.steps_title_finish.innerHTML = "��ʱ";//��ʱ
    this.steps_title_finish.style.fontWeight = "bold";
    this.steps_title_finish.style.fontSize = 16 + "px";
    this.steps_ul.append(this.steps_title_finish);
}
gtgdm.StepPopupFrame.prototype.init = function()
{

}
gtgdm.StepPopupFrame.prototype.clear = function()
{
    this.step_popup_box.remove();
}
gtgdm.StepPopupFrame.prototype.stepsUpdate = function(stepsArray) {

        for(var n=0; n<stepsArray.length; n++){
            var steps_li_caption = document.createElement("li");
            steps_li_caption.textContent = stepsArray[n].steps_title_caption;
            this.steps_ul.append(steps_li_caption);

            var steps_li_state = document.createElement("li");
            switch (stepsArray[n].steps_title_state) {
                case 2:
                    steps_li_state.textContent = "\u5df2\u5b8c\u6210";
                    break;
                case 1:
                    steps_li_state.textContent = "\u8fdb\u884c\u4e2d";
                    break;
                case 0:
                    steps_li_state.textContent = "\u7b49\u5f85\u4e2d";
                    break;
                case -1:
                    steps_li_state.textContent = "\u5931\u8d25";
                    break;
                default :
                    alert("\u9519\u8bef\u4fe1\u606f");
            }
            this.steps_ul.append(steps_li_state);
            var steps_li_start = document.createElement("li");
            steps_li_start.textContent = stepsArray[n].steps_title_start;
            this.steps_ul.append(steps_li_start);
            var steps_li_finish = document.createElement("li");
            steps_li_finish.textContent = stepsArray[n].steps_title_finish + "ms";
            this.steps_ul.append(steps_li_finish);
        }
}

function stopBubble(e){
    if(e && e.stopPropagation){
        e.stopPropagation();
    }else{
        window.event.cancelBubble = true;
    }
}
