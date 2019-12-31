
//TaskControlView.function 任务管理类
gtgdm.TaskControlView = function ( ) {
//目前不能支持任何字段的排序， 不能删除入库

    this.timer = null;
    this.taskManager = null;//初始化的使用
    this.popSteps = null;
    this.bSearchByFactor = false;// false  可以动态添加新入库的， true表示通过条件查询， 比如 状态信息、 日期、 ip 等， 此时不支持动态添加的效果
    this.initUI();
};
//TaskControlView.prototype.initUI 任务管理界面初始化
gtgdm.TaskControlView.prototype.initUI = function () {

    var endpoint = gtgdm.Global.getAppContext_Localpath() + 'mconsole/gdmp/bzk/eggs/taskmanage/taskmanage.html';
    var promise = gtgdm.utils.getText(endpoint);
    let self = this;
    promise.then(function (html) {
        $('#missionView').append(html);//初始化html界面
        self.initTaskInfoUI();//设置最上一行taskinfo信息的点击事件，查询出对应的任务展示在dataGrid上
        self.initSearchUI();// 初始化搜索日期等界面
        self.initTaskGridUI();// 初始化任务管理dataGrid的界面
    })
	.catch(function (error) {
		// TODO: 错误处理
		console.log('Error: ' + error);
	});


};
// TaskControlView.prototype.initTaskInfoUI 初始化 任务在状态信息
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

// TaskControlView.prototype.initSearchUI初始化搜索日期等界面
gtgdm.TaskControlView.prototype.initSearchUI = function() {
    let self= this;
    $('#search-ip').linkbutton({
        onClick:function () {
            // GET /geodata/v1/missions/query?from={from}&to={to}&host={host}
            //     host是提交任务机器的IP，默认返回的结果是按提交时间字段降序
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
// TaskControlView.prototype.initTaskGridUI初始化任务管理dataGrid的界面
gtgdm.TaskControlView.prototype.initTaskGridUI = function()
{
	var self = this;
    $('#task-manage').datagrid({
        title: '任务管理',
        fitColumns: true,
        striped: true,//奇偶行使用不同的背景色
        rownumbers: true,//带有行号
        singleSelect : true,
        pageNumber:1,
        pagination:true,//分页
        pageSize: 20,
        pageList: [20],
        loadFilter:self.pageFilter,
        //autoRowHeight:true,
        //nowrap: true,
        loadMsg: '',
        height: document.body.scrollHeight - 170,
        width:document.body.scrollWidth-20,
        //multiSort: false,//是否多列排序
		remotesort:false,//是否从服务器排序数据
         //sortName: 'task_missionEpoch',
         //sortOrder:'desc',
        columns: [[
            {
                field: 'task_state',// 更新状态图片后导致列拉伸不正确?????怎么修改
                title: '任务状态',
                width: 300,
                align: 'center',
            },{
                field: 'task_caption',
                title: '任务描述',
                width: 300,
                align: 'center',
            },{
                field: 'task_missionEpoch',
                title: '提交时间',
                width: 300,
                align: 'center'
            },{
                field: 'task_submitterUserId',
                title: '提交用户',
                width: 300,
                align: 'center'
            },{
                field: 'task_submitterHost',
                title: '主机IP',
                width: 300,
                align: 'center'
            },{
                field: 'task_schedule',
                title: '任务进度',
                width: 300,
                align: 'center'

            }]],
        view: detailview,
        detailFormatter:function(index, row){
            return '<div style="padding:0px;"><div id="ddv-' + index + '"></div></div>';// padding 从左上角平移产生行列间距
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

// $('#task-manage') 的 loadFilter分页过滤 回调函数
//TaskControlView.prototype.pageFilter 任务管理分页功能
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
//TaskControlView.prototype.expandOneTask 展开主任务信息
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
                title: '文件状态',
                width: 100,
                align: 'center'
            }, {
                field: 'item_file_name',
                title: '文件名',
                width: 300,
                align: 'center'
            },
            {
                field: 'item_inputdb_starttime',
                title: '入库开始时间',
                width: 100,
                align: 'center'
            }, {
                field: 'item_inputdb_endtime',
                title: '入库结束时间',
                width: 100,
                align: 'center'
            },
            {
                field: 'item_process_starttime',
                title: '服务化处理开始时间',
                width: 100,
                align: 'center'
            }, {
                field: 'item_process_endtime',
                title: '服务化处理结束时间',
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
//主网格数据
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

//更新最上一行统计信息
gtgdm.TaskControlView.prototype.updateTotalinfo = function () {
    var self = this;
    $("#all-tasks").html(self.taskManager.totalTaskInfo.nTotal + '个任务');
    $("#finish-tasks").html(self.taskManager.totalTaskInfo.nFinished + '个任务');//最上一行的n个任务  \u4e2a\u4efb\u52a1 个任务
    $("#carry-on-tasks").html(self.taskManager.totalTaskInfo.nProcessing + '个任务');
    // $("#wait-tasks").html(self.taskManager.totalTaskInfo.nWaiting + '个任务');
    // $("#fail-tasks").html(self.taskManager.totalTaskInfo.nFailed + '个任务');
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

	              //if(self.bSearchByFactor) return;//按日期更新时 不刷新新的行
                  if($('#mainTabs').tabs('getSelected').panel('options').id !== "missionView")
                        return ; //不是任务处理界面 不刷新

		          var retdata2 = data.retdata;
                  if(!self.bSearchByFactor)
                  {
                      var manager = new gtgdm.TaskManager(retdata2);
                      self.taskManager = manager;
                      //更细任务管理,添加一行row , 只更新了一行
                      let row = $('#task-manage').datagrid('getRows');
                      var page =  $('#task-manage').datagrid('getPager');
                      var opts = $('#task-manage').datagrid('getPager').pagination('options');
                      var nCurLength = opts.pageSize * (opts.pageNumber-1);
                      var nPageFull = opts.pageSize * opts.pageNumber;
                      //  如果前端请求的数据是几百条或者更多， 也是一次性的 请求到全部的json数据存储， 数据量很大
                      //添加新入库的row项
                      var len_temp = self.taskManager.majorTaskArray_Datagrid.length;
                      if(row.length == 0 && len_temp > 0){
                          $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid);//当前datagrid 还没有数据， 第一次添加数据
                          // $('#task-manage').datagrid('expandRow',0);
                      }
                      else if(row.length>0 &&((nCurLength + row.length) < nPageFull ) && (nCurLength + row.length)< retdata2.length){// 新增的row ，必须是当前的页面 没有满，已经满就不必显示了
                          // let nNeedInput = retdata2.length - (nCurLength + row.length);
                          // let index = row.length;
                          // for(let i=retdata2.length-nNeedInput;i< retdata2.length;i++){// 新增的row 可能是多个页面提交的， 可能是多个
                          //     $('#task-manage').datagrid('appendRow', self.taskManager.majorTaskArray_Datagrid[i]);
                          // } 注释的这些也正确，但是会导致布局不正确
                          $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid);
                      }
                      else{
                             self.updateMajorGrid();
                      }
                      // var gridData = $('#task-manage').datagrid('getData');// 已经分页， 不能使用self.data_的长度
                      // gridData.originalRows.indexOf(obj)
                      // gridData.rows .indexOf(obj)
                      // $('#task-manage').datagrid('loadData', self.taskManager.majorTaskArray_Datagrid);//全部更新， 其它地方不需要再更新 直接取值 , 界面会不正确 load是和后台交互的

                  }
                  //更新最上一行统计信息
                  self.updateTotalinfo();

	          },
	          error:function(){

	          }
	    	});

	  },1000)

}
gtgdm.TaskControlView.prototype.updateMajorGrid = function () {
    //更新状态列和进度列信息， 如果是 已完成 ，不需要更新， 不然全部更新的话 会闪跳
    var self = this;
    var len_temp = self.taskManager.majorTaskArray_Datagrid.length;
    for(let nn =0; nn < len_temp; nn++){//第0 个是标题
        var str_state = $("[field = 'task_state']").eq(nn+1)[0].textContent;
        if( str_state.trim() == '已完成')
        {
            continue;
        }
        // $('#task-manage').datagrid('updateRow', {index:nn,row:self.taskManager.majorTaskArray_Datagrid[nn]});//因为有子表格， 会不停的展开收回， 增加expandRow的效果也不好， 直接更新单元格吧
        $("[field = 'task_state']").eq(nn+1).html(self.taskManager.majorTaskArray_Datagrid[nn].task_state);//self.taskManager.majorTaskArray_Datagrid[nn].task_state;
        $("[field = 'task_schedule']").eq(nn+1).html(self.taskManager.majorTaskArray_Datagrid[nn].task_schedule);//self.taskManager.majorTaskArray_Datagrid[nn].task_schedule;
        self.updateSubGrid(nn);
    }
}

gtgdm.TaskControlView.prototype.updateSubGrid = function (index) {
/*
sub ：
 <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c7-item_file_state"><img src="mconsole/gdmp/bzk/images/missionimg-001.png" style="width:20px;">&nbsp;&nbsp;<span style="color:#333; font-weight:bold;">等待中</span></div>
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
    for(let nn =0; nn < len_temp; nn++){//第0 个是标题
        var str_state = $("[field = 'item_file_state']").eq(nn+1)[0].textContent;
        if( str_state.trim() == '已完成')
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
    this.step_popup_box.className = "step-popup-box";//风格在taskcontrol.css 中设置了
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
    this.steps_title_caption.innerHTML = "描述";//描述
    this.steps_title_caption.style.fontWeight = "bold";
    this.steps_title_caption.style.fontSize = 16 + "px";
    this.steps_ul.append(this.steps_title_caption);

    this.steps_title_state = document.createElement("li");
    this.steps_title_state.innerHTML = "状态";//状态
    this.steps_title_state.style.fontWeight = "bold";
    this.steps_title_state.style.fontSize = 16 + "px";
    this.steps_ul.append(this.steps_title_state);

    this.steps_title_start = document.createElement("li");
    this.steps_title_start.innerHTML = "开始时间";// 开始时间
    this.steps_title_start.style.fontWeight = "bold";
    this.steps_title_start.style.fontSize = 16 + "px";
    this.steps_ul.append(this.steps_title_start);

    this.steps_title_finish = document.createElement("li");
    this.steps_title_finish.innerHTML = "用时";//用时
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
