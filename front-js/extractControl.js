'use strict';
//ExtractControl.function 数据提取总控类
gtgdm.ExtractControl = function (json, extent, tilenumber) {// 所有调用Extraction的地方，如果考虑 支持多个extent 和 多个titleNumber的情况，需要 将这个函数修改， 三个参数都要更改成数组的形式。
    var self = this;
    //拉框选取时的范围
    this.extent = extent;
    this.tilenumber = [];
    if(extent.length === 4)
        this.ExtractionMode = 'extentMode';//按经纬度范围提取模式
    else if(tilenumber !== undefined && tilenumber !==null )
    {
        this.ExtractionMode = 'tilenumberMode';
        this.tilenumber = tilenumber;
    }//按图幅号提取模式

    this.dlg = null;
    //加载树对应的json数据
    this.data = json;
    //解决第二次提取没有数据显示的问题，原因是第一次提取请求到的div没有销毁，第二次的数据加载到第一次的div中了。
    var dlg = $('.gt-extract-dialog');
    if(dlg){
        dlg.remove();
    }

    this.tree = null;//提取的树 gtgdm.ExtractTree 类型
    this.treeToCar = null;//选中树节点后放到提取车的操作 ，都在treeToCar对应的类处理，gtgdm.ExtractTreeToCar类型
    this.initUI();// 初始化界面
}
//ExtractControl.prototype.initUI 数据提取控制类的界面初始化
gtgdm.ExtractControl.prototype.initUI = function ( ) {
    var self =  this;
    var endpoint = gtgdm.Global.getAppContext_Localpath() + 'mconsole/gdmp/bzk/eggs/extractdialog/extraction.html';

    var promise = gtgdm.utils.getText(endpoint);
    promise.then(function(html) {
        self.construct_(html);
    })
        ['catch'](function(error) {
        // TODO: 错误处理
        console.log('Error: ' + error);
    });
}

//ExtractControl.prototype.construct 调用构造函数时会调用这个方法，初始化提取界面
gtgdm.ExtractControl.prototype.construct_ = function (html) {
    var bodyWidth = document.body.clientWidth;
    var bodyHeight = document.body.clientHeight;
    var width = bodyWidth * 0.6;
    var height = bodyHeight * 0.8;
    var self = this;
    var dlg = this.dlg = $(html);
    dlg.dialog({
        title:'数据提取',
        // doSize:false,
        // modal:true,
        width:width,
        height:height,
        onClose:function () {
            //清除拉框选取时的所有
             var rectDiv = gtgdm.Global.getObject(gtgdm.ObjectNames.RECTEXTRACT_MINIMENU);
            if (rectDiv !== null && rectDiv !== undefined) {
                rectDiv.hidden()
            }
            gtgdm.Global.dispatchEvent('RectDrawClear');
        }
    });

        $('.gt-catlog-tab').append('<div id="gt-catlog-product"title="产品库数据"></div>')
        $('.gt-catlog-tab').append('<div id="gt-catlog-app"title="应用库数据"></div>')
        $('#gt-catlog-app').append("<input id='check_level' type='checkbox' checked='false' style='float:right;'><label for='check_level' style='float:right '>单独选取数据级别</label>")
        $('.gt-catlog-tab').append('<div id="gt-catlog-service"title="服务库数据"></div>')

    $('.gt-catlog-tab',dlg).tabs({
        height:height-78,
        tabWidth:90,
        tabHeight:30

    });
    $('.toDataGridCar',dlg).linkbutton({
        // plain:true,
        onClick:function () {
            self.clickAddToExtraCar();
            dlg.dialog('close');

        }
    })
    //构造提取的目录树
    this.tree = new gtgdm.ExtractTree('#gt-catlog-tab',this.data,this.extent,this.tilenumber);

}

//ExtractControl.prototype.clickAddToExtraCar 点击加入到提取车按钮的处理函数，
gtgdm.ExtractControl.prototype.clickAddToExtraCar =async function () {
    this.treeToCar = new gtgdm.ExtractTreeToCar(this.tree,this.extent,this.tilenumber);
    var treeList = await this.treeToCar.getTreeList();
    var name = gtgdm.ObjectNames.EXTRACT_CAR;
    var car = gtgdm.Global.getObject(name);
    car.setExtractFactor(this.extent,this.tilenumber);
    car.addShops(treeList);
}





























