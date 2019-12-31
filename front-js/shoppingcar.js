'use strict';
// ���빺�ﳵdataType����������������001 ֮�� һ��object����
//Object { dataType: "ʸ������", dataTypeNum: "003", classifierCode: "001", geoResID: "2aa2400aca5f25e0b0008dac2d653fde", tileNumber: "094905", productDate: "20041016", spatialRefCaption: "GCS2000��������ϵ_��˹ͶӰ�����뾭��111�ȣ��ٶ�500���", operator: "<div style="color: blue; width: 58p��" }
//DownloadCar.function ���س�������
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
        // TODO: ������
        console.log('Error: ' + error);
    })
};
//DownloadCar.prototype.addOneShop�����س������һ������
gtgdm.DownloadCar.prototype.addOneShop = function (data) {
    //���ж����س����Ƿ��Ѿ��и�����
    var dataArr = this.data_;
    for (var i = 0, ii = dataArr.length; i < ii; ++i) {
        if (dataArr[i].geoResID == data.geoResID) {
        	 $.messager.alert('��ʾ', '�������Ѿ������س���');
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
//DownloadCar.prototype.updateCount �������س�������
gtgdm.DownloadCar.prototype.updateCount = function () {
    $('.download_shopCount').html(this.data_.length);

}

//DownloadCar.prototype.remove �ѵ�ǰ�����Ƴ����س�
gtgdm.DownloadCar.prototype.remove = function (index) {

    var self = this;
    var obj =  $('#shoppingCar_dataGrid').datagrid("getRows")[index];
    var gridData = $('#shoppingCar_dataGrid').datagrid('getData');// �Ѿ���ҳ�� ����ʹ��self.data_�ĳ���
    // gridData.originalRows.indexOf(obj)
    // gridData.rows .indexOf(obj)
    $.messager.confirm('��ʾ', 'ȷ���ӹ��ﳵ�Ƴ�����������', function (r) {
        if (r) {
            //  ��� data_ ,  *data_ , datagrid �Ƴ�
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
//DownloadCar.prototype.refreshDatagrid ˢ�����س� datagrid
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
            pagination:true,//��ҳ
            pageSize: 18,
            pageList: [18],
            loadFilter:self.pageFilter,
            emptyMsg: '���ﳵ��û������',
            striped: true,//��ż��ʹ�ò�ͬ�ı���ɫ
            // nowrap: true,
            //multiSort: false,//�Ƿ��������
            remotesort:false,//�Ƿ�ӷ�������������
            columns: [[
                {
                    field: 'dataType',
                    title: '��������',
                    width: 140,
                    fixed: true,
                    align: 'center',
                    halign: 'center'

                },
                {
                    field: 'productDate',
                    title: '����ʱ��',
                    width: 140,
                    fixed: true,
                    align: 'center',
                    halign: 'center'
                },
                {
                    field: 'spatialRefCaption',
                    title: 'ͶӰ��Ϣ',
                    width: 450,
                    fixed: true,
                    align: 'center',
                    halign: 'center'
                },
                {
                    field: 'tileNumber',
                    title: 'ͼ����',
                    width: 140,
                    fixed: true,
                    align: 'center',
                    halign: 'center'
                }, {
                    field: 'operator',
                    title: '����',
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
                    title: 'ȫѡ',
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
    $("a[name ='remove']") .linkbutton({ text:'�Ƴ�',plain:true, onClick: function () {
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
//DownloadCar.prototype.showDialog ��ʾ���س�����
gtgdm.DownloadCar.prototype.showDialog = function () {
    var bodyWidth = document.body.clientWidth;
    var bodyHeight = document.body.clientHeight;
    var width = bodyWidth * 0.6;
    var height = bodyHeight * 0.8;
    var dlg = this.dlg_;
    var self = this;
    var data = this.data_;

    dlg.window({
        title: '���ﳵ',
        width:width,
        height:height,
        modal:true,
        onClose: function () {
            // ����־û�
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

    // $('#current_type').html('ȫ������');

    this.refreshControlBtn();

    $('#shoppingCar_dataGrid', dlg).datagrid('loadData', data);


};

gtgdm.DownloadCar.prototype.refreshControlBtn = function () {
    var data = this.data_;
    $('#download_shopCount').html(data.length);
        if (data.length == 0) {
            //��ťӦ�ô��ڽ���״̬
            $('#clearCar').linkbutton('disable');
            $('#download').linkbutton('disable');

        } else {
            $('#clearCar').linkbutton('enable');
            $('#download').linkbutton('enable');
        }
    // }
}

//DownloadCar.prototype.showDataByTypeѡ��ĳ�����ݽ�����ʾ
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

//DownloadCar.prototype.downloadFileԪ������Ϣ����,���ص�������
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

        // TODO: ������
        console.log('Error: ' + error);

    });
};
//DownloadCar.prototype.downloadFiles_���س���������������
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
    //ֻ����һ��Ԫ����ʱ����ķ���
    var endpoint = gtgdm.Global.getAppContext() + 'geodata/v1/product/profiles/' + tokens[0];
    //���ض���Ԫ����ʱ����ķ���
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
        // TODO: ������
        console.log('Error: ' + error);

    });


};

//DownloadCar.prototype.clearCar_������س�
gtgdm.DownloadCar.prototype.clearCar_ = function () {
    var self = this;
    var data = self.data_;

    var gridData = $('#shoppingCar_dataGrid').datagrid('getData');// �Ѿ���ҳ�� ����ʹ��self.data_�ĳ���
    $.messager.confirm('��ʾ', 'ȷ��������س���', function (r) {
        if (r) {
            for (var i = 0, ii = gridData.rows.length; i < ii; ++i) {
                $('#shoppingCar_dataGrid').datagrid('deleteRow', 0);
            }
            self.data_ = [];
            self.updateCount();
        }
    })
};




