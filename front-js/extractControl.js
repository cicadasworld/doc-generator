'use strict';
//ExtractControl.function ������ȡ�ܿ���
gtgdm.ExtractControl = function (json, extent, tilenumber) {// ���е���Extraction�ĵط���������� ֧�ֶ��extent �� ���titleNumber���������Ҫ ����������޸ģ� ����������Ҫ���ĳ��������ʽ��
    var self = this;
    //����ѡȡʱ�ķ�Χ
    this.extent = extent;
    this.tilenumber = [];
    if(extent.length === 4)
        this.ExtractionMode = 'extentMode';//����γ�ȷ�Χ��ȡģʽ
    else if(tilenumber !== undefined && tilenumber !==null )
    {
        this.ExtractionMode = 'tilenumberMode';
        this.tilenumber = tilenumber;
    }//��ͼ������ȡģʽ

    this.dlg = null;
    //��������Ӧ��json����
    this.data = json;
    //����ڶ�����ȡû��������ʾ�����⣬ԭ���ǵ�һ����ȡ���󵽵�divû�����٣��ڶ��ε����ݼ��ص���һ�ε�div���ˡ�
    var dlg = $('.gt-extract-dialog');
    if(dlg){
        dlg.remove();
    }

    this.tree = null;//��ȡ���� gtgdm.ExtractTree ����
    this.treeToCar = null;//ѡ�����ڵ��ŵ���ȡ���Ĳ��� ������treeToCar��Ӧ���ദ��gtgdm.ExtractTreeToCar����
    this.initUI();// ��ʼ������
}
//ExtractControl.prototype.initUI ������ȡ������Ľ����ʼ��
gtgdm.ExtractControl.prototype.initUI = function ( ) {
    var self =  this;
    var endpoint = gtgdm.Global.getAppContext_Localpath() + 'mconsole/gdmp/bzk/eggs/extractdialog/extraction.html';

    var promise = gtgdm.utils.getText(endpoint);
    promise.then(function(html) {
        self.construct_(html);
    })
        ['catch'](function(error) {
        // TODO: ������
        console.log('Error: ' + error);
    });
}

//ExtractControl.prototype.construct ���ù��캯��ʱ����������������ʼ����ȡ����
gtgdm.ExtractControl.prototype.construct_ = function (html) {
    var bodyWidth = document.body.clientWidth;
    var bodyHeight = document.body.clientHeight;
    var width = bodyWidth * 0.6;
    var height = bodyHeight * 0.8;
    var self = this;
    var dlg = this.dlg = $(html);
    dlg.dialog({
        title:'������ȡ',
        // doSize:false,
        // modal:true,
        width:width,
        height:height,
        onClose:function () {
            //�������ѡȡʱ������
             var rectDiv = gtgdm.Global.getObject(gtgdm.ObjectNames.RECTEXTRACT_MINIMENU);
            if (rectDiv !== null && rectDiv !== undefined) {
                rectDiv.hidden()
            }
            gtgdm.Global.dispatchEvent('RectDrawClear');
        }
    });

        $('.gt-catlog-tab').append('<div id="gt-catlog-product"title="��Ʒ������"></div>')
        $('.gt-catlog-tab').append('<div id="gt-catlog-app"title="Ӧ�ÿ�����"></div>')
        $('#gt-catlog-app').append("<input id='check_level' type='checkbox' checked='false' style='float:right;'><label for='check_level' style='float:right '>����ѡȡ���ݼ���</label>")
        $('.gt-catlog-tab').append('<div id="gt-catlog-service"title="���������"></div>')

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
    //������ȡ��Ŀ¼��
    this.tree = new gtgdm.ExtractTree('#gt-catlog-tab',this.data,this.extent,this.tilenumber);

}

//ExtractControl.prototype.clickAddToExtraCar ������뵽��ȡ����ť�Ĵ�������
gtgdm.ExtractControl.prototype.clickAddToExtraCar =async function () {
    this.treeToCar = new gtgdm.ExtractTreeToCar(this.tree,this.extent,this.tilenumber);
    var treeList = await this.treeToCar.getTreeList();
    var name = gtgdm.ObjectNames.EXTRACT_CAR;
    var car = gtgdm.Global.getObject(name);
    car.setExtractFactor(this.extent,this.tilenumber);
    car.addShops(treeList);
}





























