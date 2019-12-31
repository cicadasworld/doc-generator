'use strict';
// 加入购物车dataType的是中文名，不是001 之类 一个object如下
//Object { dataType: "矢量数据", dataTypeNum: "003", classifierCode: "001", geoResID: "2aa2400aca5f25e0b0008dac2d653fde", tileNumber: "094905", productDate: "20041016", spatialRefCaption: "GCS2000地理坐标系_高斯投影（中央经线111度，假东500公里）", operator: "<div style="color: blue; width: 58p…" }
//DownloadCar.function 下载车功能类
gtgdm.DownloadCar = function () {
    this.dlg_ = null;
    this.data_ = [];
    this.downloadTokens = [];
    this.currentType = 'all';

    this.imageData_ = [];
    this.demData_ = [];
    this.vectorData_ = [];
    this.placenameData_ = [];
    this.mcpData_ = [];
    this.magnetData_ = [];
    this.gravityData_ = [];
    this.geoentityData_ = [];
    this.construct_();
};

gtgdm.DownloadCar.prototype.construct_ = function (html) {
    var self = this;
    var endpoint = gtgdm.Global.getAppContext_Localpath() + 'mconsole/gdmp/bzk/eggs/shoppingcar.html';
    var promise = gtgdm.utils.getText(endpoint);
    promise.then(function (html) {
        self.dlg_ = $(html);
    })
    .catch(function (error) {
        // TODO: 错误处理
        console.log('Error: ' + error);
    })
};
//DownloadCar.prototype.addOneShop向下载车里添加一条数据
gtgdm.DownloadCar.prototype.addOneShop = function (data) {
    //先判断下载车里是否已经有该数据
    var dataArr = this.data_;
    for (var i = 0, ii = dataArr.length; i < ii; ++i) {
        if (dataArr[i].geoResID == data.geoResID) {
        	 $.messager.alert('提示', '该数据已经在下载车中');
             return;
        }
    }
    switch (data.dataType){
        case gtgdm.GeoDataTypeNameCH.IMAGE:
            this.imageData_.push(data);
            break;
        case gtgdm.GeoDataTypeNameCH.DEM:
            this.demData_.push(data);
            break;
        case gtgdm.GeoDataTypeNameCH.VECTOR:
            this.vectorData_.push(data);
            break;
        case gtgdm.GeoDataTypeNameCH.PLACENAME:
            this.placenameData_.push(data);
            break;
        case gtgdm.GeoDataTypeNameCH.CONTROL_POINT:
            this.mcpData_.push(data);
            break;
        case gtgdm.GeoDataTypeNameCH.MAGNET:
            this.magnetData_.push(data);
            break;
        case gtgdm.GeoDataTypeNameCH.GRAVITY:
            this.gravityData_.push(data);
            break;
        case gtgdm.GeoDataTypeNameCH.ENTITY_DATA:
            this.geoentityData_.push(data);
            break;
    }
    dataArr.push(data);
    this.updateCount();
};
//DownloadCar.prototype.updateCount 更新下载车的数组
gtgdm.DownloadCar.prototype.updateCount = function () {
    $('.download_shopCount').html(this.data_.length);

}

//DownloadCar.prototype.remove 把当前数据移出下载车
gtgdm.DownloadCar.prototype.remove = function (index) {

    var self = this;
    var obj =  $('#shoppingCar_dataGrid').datagrid("getRows")[index];
    var gridData = $('#shoppingCar_dataGrid').datagrid('getData');// 已经分页， 不能使用self.data_的长度
    // gridData.originalRows.indexOf(obj)
    // gridData.rows .indexOf(obj)
    $.messager.confirm('提示', '确定从购物车移除这条数据吗？', function (r) {
        if (r) {
            //  清空 data_ ,  *data_ , datagrid 移除
            var ary_index =  self.data_.indexOf(obj);
            self.data_.splice(ary_index,1);
            var type= gtgdm.Extract_Convert.dataTypeCHToEN(obj.dataType);
            var aryType_index =  self[type+'Data_'].indexOf(obj);
            self[type+'Data_'].splice(aryType_index,1);
            $('#shoppingCar_dataGrid').datagrid('deleteRow', index);
            self.updateCount();
            self.refreshDatagrid(self);
        }
    })
};
//DownloadCar.prototype.refreshDatagrid 刷新下载车 datagrid
gtgdm.DownloadCar.prototype.refreshDatagrid = function(self)
{
    if(self.currentType ==='all'){
        $('#shoppingCar_dataGrid').datagrid('loadData', self.data_);
    }
    else{
        var dataType = self.currentType;
        var  data = self[dataType+'Data_'];
        $('#shoppingCar_dataGrid').datagrid('loadData',data);
    }
}

gtgdm.DownloadCar.prototype.initDatagrid = function (width, height) {
    var self= this;
    $('#shoppingCar_dataGrid', self.dlg_).datagrid(
        {
            showHeader: true,
            height:height - 100,
            checkOnSelect: false,
            selectOnCheck: false,
            fitColumns: true,
            pagination:true,//分页
            pageSize: 18,
            pageList: [18],
            loadFilter:self.pageFilter,
            emptyMsg: '购物车里没有数据',
            striped: true,//奇偶行使用不同的背景色
            // nowrap: true,
            //multiSort: false,//是否多列排序
            remotesort:false,//是否从服务器排序数据
            columns: [[
                {
                    field: 'dataType',
                    title: '数据类型',
                    width: 140,
                    fixed: true,
                    align: 'center',
                    halign: 'center'

                },
                {
                    field: 'productDate',
                    title: '生产时间',
                    width: 140,
                    fixed: true,
                    align: 'center',
                    halign: 'center'
                },
                {
                    field: 'spatialRefCaption',
                    title: '投影信息',
                    width: 450,
                    fixed: true,
                    align: 'center',
                    halign: 'center'
                },
                {
                    field: 'tileNumber',
                    title: '图幅号',
                    width: 140,
                    fixed: true,
                    align: 'center',
                    halign: 'center'
                }, {
                    field: 'operator',
                    title: '操作',
                    width: 140,
                    fixed: true,
                    align: 'center',
                    halign: 'center',
                    formatter:self.removeFormatter
                }
            ]],
            frozenColumns: [[
                {
                    field: 'selectAll',
                    checkbox: true,
                    title: '全选',
                    width: 100,
                    fixed: true,
                    align: 'center',
                    halign: 'center'
                }
            ]],
            onLoadSuccess:function (data) {
                self.initOperator();
            }
        }

    );

}

gtgdm.DownloadCar.prototype.removeFormatter = function(value,row,index){
    var str = '<a href ="#" name ="remove" class = "easyui-linkbutton" id=' + index + ' style="background-color: #8fdb8f"></a>';
    return str;
}

gtgdm.DownloadCar.prototype.initMenu = function(){
    var self =  this;
    self.currentType = 'all';
    var menuObj = $('#car_menu');
    $('#car_sort').menubutton({
        menu:menuObj
    });
    menuObj.menu({
        onClick:function (item) {
            var dataType = item.id;
            var text = item.text;
            $('#current_type').html(text);
            self.showDataByType(dataType);
        }
    })
}
gtgdm.DownloadCar.prototype.initOperator = function () {
    var self = this;
    $("a[name ='remove']") .linkbutton({ text:'移除',plain:true, onClick: function () {
        self.remove(this.id);
    }})

}
gtgdm.DownloadCar.prototype.pageFilter = function(data) {
    if(typeof  data.length === 'number' && typeof data.splice === 'function')
    {
        data = {
            total: data.length,
            rows:data
        };
    }
    var dg = $('#shoppingCar_dataGrid');
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
//DownloadCar.prototype.showDialog 显示下载车窗口
gtgdm.DownloadCar.prototype.showDialog = function () {
    var bodyWidth = document.body.clientWidth;
    var bodyHeight = document.body.clientHeight;
    var width = bodyWidth * 0.6;
    var height = bodyHeight * 0.8;
    var dlg = this.dlg_;
    var self = this;
    var data = this.data_;

    dlg.window({
        title: '购物车',
        width:width,
        height:height,
        modal:true,
        onClose: function () {
            // 处理持久化
        }
    });

    self.initMenu();

    self.initDatagrid(width,height);

    $('#download', dlg).linkbutton({
        width: 300,
        height: 30,
        plain: true,
        onClick: function () {
            self.downloadFiles_();
        }
    });

    $('#clearCar', dlg).linkbutton({
        width: 100,
        height: 30,
        plain: true,
        onClick: function () {
            self.clearCar_();
        }

    });

    // $('#current_type').html('全部类型');

    this.refreshControlBtn();

    $('#shoppingCar_dataGrid', dlg).datagrid('loadData', data);


};

gtgdm.DownloadCar.prototype.refreshControlBtn = function () {
    var data = this.data_;
    $('#download_shopCount').html(data.length);
        if (data.length == 0) {
            //按钮应该处于禁用状态
            $('#clearCar').linkbutton('disable');
            $('#download').linkbutton('disable');

        } else {
            $('#clearCar').linkbutton('enable');
            $('#download').linkbutton('enable');
        }
    // }
}

//DownloadCar.prototype.showDataByType选择某类数据进行显示
gtgdm.DownloadCar.prototype.showDataByType = function (dataType) {

    if(dataType == this.currentType){
        return;
    }
    var self = this;
    var data =null;
    if(dataType == 'all'){
        data = this.data_;
    }else{
        data = this[dataType+'Data_'];
    }
    var dlg = this.dlg_;
    this.currentType = dataType;

    $('#shoppingCar_dataGrid').datagrid('loadData',data);

}

//DownloadCar.prototype.downloadFile元数据信息窗口,下载单个数据
gtgdm.DownloadCar.prototype.downloadFile = function (data) {
    var ff1 = data.classifierCode;
    var ff2 = data.dataType;
    var ff3 = data.geoResID;
    var token = '' + ff1 + ff2 + ff3;
    var endpoint = gtgdm.Global.getAppContext() + 'geodata/v1/product/profiles/' + token +'?encoding=utf-8';
    var p = gtgdm.utils.getJSON(endpoint);
    p.then(function (json) {
        if (!json) {
            return;
        }
        var url = [];
        for (var l = 0, ll = json.length; l < ll; ++l) {
            url.push(json[l].link);
        }
        gtgdm.DownloadFiles(url);

    }).catch(function (error) {

        // TODO: 错误处理
        console.log('Error: ' + error);

    });
};
//DownloadCar.prototype.downloadFiles_下载车中下载批量数据
gtgdm.DownloadCar.prototype.downloadFiles_ = function () {
    var dlg = this.dlg_,
        data = this.data_,
        self = this;
    var tokens = [];
    if (data.length == 0) {
        return;
    }

    var rows = $('#shoppingCar_dataGrid').datagrid('getChecked');
    if (rows.length < 1) {
        return;
    }
    var arr_index = [];
    for (var i = 0, ii = rows.length; i < ii; ++i) {
        var index1 = $('#shoppingCar_dataGrid').datagrid('getRowIndex', rows[i]);
        arr_index.push(index1);
    }

    for (var j = 0, jj = arr_index.length; j < jj; ++j) {
        var index = arr_index[j];
        var ff1 = data[index].classifierCode;
        var ff2 = data[index].dataType;
        var ff3 = data[index].geoResID;
        var str = '' + ff1 + ff2 + ff3;
        tokens.push(str);
    }
    //只下载一条元数据时请求的服务
    var endpoint = gtgdm.Global.getAppContext() + 'geodata/v1/product/profiles/' + tokens[0];
    //下载多条元数据时请求的服务
    var endpoint2 = gtgdm.Global.getAppContext() + 'geodata/v1/product/profiles?tokens=' + tokens.toString();
    var p;
    if (tokens.length == 1) {
        p = gtgdm.utils.getJSON(endpoint);
    } else if (tokens.length > 1) {
        p = gtgdm.utils.getJSON(endpoint2);
    } else {
        return;
    }

    p.then(function (json) {
        if (!json) {
            return;
        }
        var url = [];
        for (var l = 0, ll = json.length; l < ll; ++l) {
            url.push(json[l].link);
        }
        new gtgdm.DownloadFiles(url);
    }).catch(function (error) {
        // TODO: 错误处理
        console.log('Error: ' + error);

    });


};

//DownloadCar.prototype.clearCar_清空下载车
gtgdm.DownloadCar.prototype.clearCar_ = function () {
    var self = this;
    var data = self.data_;

    var gridData = $('#shoppingCar_dataGrid').datagrid('getData');// 已经分页， 不能使用self.data_的长度
    $.messager.confirm('提示', '确认清空下载车吗？', function (r) {
        if (r) {
            for (var i = 0, ii = gridData.rows.length; i < ii; ++i) {
                $('#shoppingCar_dataGrid').datagrid('deleteRow', 0);
            }
            self.data_ = [];
            self.updateCount();
        }
    })
};




