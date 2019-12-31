//
// Copyright 2018 GTTech Team. All Rights Reserved.
//
'use strict';

//
// Ŀ¼���е�ÿ��ztreenode�ڵ���������ֶ�:
//
// (1) gtClassifierCode {String} �����ǿ�����ݲ�Ʒ�⡢Ӧ�ÿ⻹����������Ʒ��, ȡֵΪgtgdm.GeoRepo.PRODUCT��;
// (2) gtDataType {String} ���������������ͣ�ȡֵΪgtgdm.GeoDataType.IMAGE��;
// (3) gtNodeKind {Integer} ����ztreenode�ڵ����࣬ȡֵΪgtgdm.GeoCatalogNodeKind.AGG��;
// (4) gtObject {Object} ztreenode������Ӧ�ò�����;
// (5) gtChildrenLoaded {Boolean} �ӽڵ��Ƿ��Ѿ�����;
// (6) gtDistVectorLayer {Object} ���ݷֲ���ʾʸ���㣬��ĳЩ����Ľڵ���и��ֶ�.
//

//
// Ŀ¼���и��ڵ����ೣ��
//
gtgdm.GeoCatalogNodeKind = {
    // �ڵ���"�ۺϷ���ڵ�",������gtObjectΪGeoEntityAggNodeDO��ȡֵ��������:
    // {
    //   "fieldName": "dataType",
    //   "rangedValue": false,
    //   "children": [],
    //   "caption": "Ӱ������",
    //   "virtualNode": false,
    //   "fieldValue1": "001",
    //   "childrenCount": 16
    //}
    AGG: 1,

    // �ڵ���"������Դʵ��ڵ�",������gtObjectΪGeoEntityDescriptorDO(������Դʵ��Ԫ����)��ȡֵ��������:
    // {
    //     "geoResID": "bf93eeb3bd862317478bf0de53494d03",
    //     "extentBottom": -20037508.342789,
    //     "classifierCode": "002",
    //     "spatialRefCaption": "Webī����ͶӰ����ϵ",
    //     "extentRight": 20037508.342789,
    //     "dataType": "001",
    //     "extraProperties": {
    //       "tilingScheme": "1",
    //       "tileFormat": "jpeg",
    //       "tileMapRole": "basemap",
    //       "_storageType": "tdb"
    //     },
    //     "lonlatExtentLeft": -179.9999999999978,
    //     "lonlatExtentTop": 85.05112877980642,
    //     "subtype": "001",
    //     "lonlatExtentBottom": -85.0511287798064,
    //     "extentLeft": -20037508.342789,
    //     "extentTop": 20037508.342789,
    //     "geoResName": "jwmap",
    //     "lonlatExtentRight": 180,
    //     "spatialRefCode": "EPSG:3857"
    //   },
    GEO_ENTITY: 2,

    // �ڵ���"������Դʵ����ļ��нڵ�",������gtObjectΪGeoEntityDescriptorDO(������Դʵ��Ԫ��
    // �����"2018������\����Ӱ��"������"2018������"��Ӧ"�ļ��нڵ�""��
    GEO_ENTITY_FOLDER: 3,

    // �ڵ���"Ӧ�ÿ���VESʸ����Դʵ���ĳ��Layer",������gtObjectΪVESʸ����Դʵ��Ԫ����(GeoEntityDescriptorDO)
    VES_LAYER: 4,

    // �ڵ���"Ӧ�ÿ�����Ƭ����Դʵ���ĳ������",������gtObjectΪLevelDataDistDO
    TILE_LEVEL: 5
};

////////////////////////////////////////////////////////////////////////////////

//
//
//GeoCatalogTree.function  ������ԴĿ¼����
gtgdm.GeoCatalogTree = function (parentDiv, treeId) {
    this.treeId_ = treeId || 'catalogtree';
    this.parentDiv_ = parentDiv;
    this.ztree_ = undefined;
    this.initZtree_();
};

gtgdm.GeoCatalogTree.prototype.getAppContext = function() {
    return gtgdm.Global.getAppContext();
};


//GeoCatalogTree.prototype.getDataDistMap  ��ȡ������ʾ���ݷֲ��ĵ�ͼ
gtgdm.GeoCatalogTree.prototype.getDataDistMap = function() {
    return gtgdm.Global.getObject(gtgdm.ObjectNames.GEO_DATA_DIST_MAP);
};

// GeoCatalogTree.prototype.reload ���¼�������Ŀ¼��
gtgdm.GeoCatalogTree.prototype.reload = function() {
    if (this.ztree_ !== undefined) {
        this.ztree_.destroy();
        this.ztree_ = undefined;
    }
    this.initZtree_();

    // ����֮ǰ�����ݷֲ����ͼ
    let distMap = this.getDataDistMap();
    if (distMap) {
        distMap.hideDistVectorLayer();
    }

    //�ӷ������˻�ȡĿ¼������, ��չʾ������
    let endpoint = this.getAppContext() + 'geodata/v1/metadata/aggregations?encoding=utf-8';
    let promise = gtgdm.utils.getJSON(endpoint);
    let self = this;
    promise.then(function (aggNodeList) {
        self.createTreeSkeleton_(aggNodeList);
    })
    ['catch'](function (error) {
        // TODO: ������
        console.log('Error: ' + error);
    });
};

// GeoCatalogTree.prototype.initZtree_ ����ztree
gtgdm.GeoCatalogTree.prototype.initZtree_ = function () {
    let self = this;
    let setting = {
        treeId: this.treeId_,
        data: {
            simpleData: {
                enable: false,
                idKey: 'id'
            }
        },
        view: {
            showLine: true,
            dblClickExpand: false,
            selectedMulti: false
        },
        check: {
            enable: false
        },
        callback: {
            onClick: function(event, treeId, zTreeNode, clickFlag) {
                self.handleTreeNodeClick_(event, treeId, zTreeNode, clickFlag);
            },

            onExpand: function(event, treeId, zTreeNode) {
                self.handleTreeNodeExpand_(event, treeId, zTreeNode);
            },

            onDblClick: function (event, treeId, zTreeNode) {
                self.handleTreeNodeDoubleClick_(event, treeId, zTreeNode);
            }
        }
    };

    // ����DOM�ڵ�
    if (!document.getElementById(this.treeId_)) {
        let html = "<ul id=\"{treeId}\" class=\"ztree\"></ul>".replace('{treeId}', this.treeId_);
        $(this.parentDiv_).append(html);
    }

    // ��ʼ��ztree
    this.ztree_ = $.fn.zTree.init($('#' + this.treeId_), setting, null);
};

// GeoCatalogTree.prototype.createTreeSkeleton_ �÷������˷��ص�Ŀ¼�����������������ṹ
gtgdm.GeoCatalogTree.prototype.createTreeSkeleton_ = function(aggNodeList) {
    const zParentNode = null;
    const level = 0;
    for (let i=0, ii=aggNodeList.length; i<ii; ++i) {
        const aggNode = aggNodeList[i];
        if (aggNode.childrenCount === 0 || aggNode.fieldName != 'classifierCode') {
            continue;
        }

        let classifierCode = aggNode.fieldValue1;
        if (classifierCode === gtgdm.GeoRepo.PRODUCT) { //��ܲ�Ʒ��
            let zAggNode = this.fillAggNode_PrdRepo_(zParentNode, aggNode, level);
            if (zAggNode) {
                this.ztree_.expandNode(zAggNode, true, false);
            }
            continue;
        }

        if (classifierCode === gtgdm.GeoRepo.APP) { //Ӧ�ÿ�
            let zAggNode = this.fillAggNode_AppRepo_(zParentNode, aggNode, level);
            if (zAggNode) {
                this.ztree_.expandNode(zAggNode, true, false);
            }
            continue;
        }

        if (classifierCode === gtgdm.GeoRepo.SO) { //��������Ʒ��
            let zAggNode = this.fillAggNode_SoRepo_(zParentNode, aggNode, level);
            if (zAggNode) {
                this.ztree_.expandNode(zAggNode, true, false);
            }
            continue;
        }
    }
};

//gtgdm.GeoCatalogTree.prototype.createDummyZnode_ α��һ���ӽڵ㣬չ��ʱ����ʾ"loading..."
gtgdm.GeoCatalogTree.prototype.createDummyZnode_ = function(zParentNode) {
    let vsettings = {
        name: 'loading...',
        icon:  this.getAppContext() + 'mconsole/gdmp/common/images/loading.gif',
        isFakedNode_: true
    };
    this.ztree_.addNodes(zParentNode, -1, vsettings, true);
};
//GeoCatalogTree.prototype.handleTreeNodeExpand_ չ�����ڵ�
gtgdm.GeoCatalogTree.prototype.handleTreeNodeExpand_ = function(event, treeId, zTreeNode) {
    this.hiddenFloatMenu();
    if (!zTreeNode || zTreeNode.gtChildrenLoaded) {
        return;
    }
    // Ϊ"Ӧ�ÿ�"����ۺϽڵ�����ӽڵ�
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.APP) {
        this.handleTreeNodeExpand_AppRepo_(zTreeNode);
        return;
    }

    // Ϊ"������ݲ�Ʒ��"����ۺϽڵ�����ӽڵ�
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.PRODUCT) {
        this.handleTreeNodeExpand_PrdRepo_(zTreeNode);
        return;
    }

    // Ϊ"��������Ʒ��"����ۺϽڵ�����ӽڵ�
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.SO) {
        this.handleTreeNodeExpand_SoRepo_(zTreeNode);
        return;
    }
};
//gtgdm.GeoCatalogTree.prototype.handleTreeNodeClick_ �������ڵ㵥��
gtgdm.GeoCatalogTree.prototype.handleTreeNodeClick_ = function(event, treeId, zTreeNode, clickFlag) {
    if (!zTreeNode) {
        return;
    }
    this.hiddenFloatMenu();
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.APP) {
        this.handleTreeNodeClick_AppRepo_(zTreeNode);
        return;
    }
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.PRODUCT) {
        this.handleTreeNodeClick_PrdRepo_(event, treeId, zTreeNode, clickFlag);
        return;
    }
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.SO) {
        this.handleTreeNodeClick_SoRepo_(zTreeNode);
        return;
    }
};
//gtgdm.GeoCatalogTree.prototype.handleTreeNodeDoubleClick_ �������ڵ�˫��
gtgdm.GeoCatalogTree.prototype.handleTreeNodeDoubleClick_ = function(event, treeId, zTreeNode) {
    if (!zTreeNode) {
        return;
    }
    this.hiddenFloatMenu();
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.APP) {
        this.handleTreeNodeDoubleClick_AppRepo_(zTreeNode);
        return;
    }
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.PRODUCT) {
        this.handleTreeNodeDoubleClick_PrdRepo_(zTreeNode);
        return;
    }
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.SO) {
        this.handleTreeNodeDoubleClick_SoRepo_(zTreeNode);
        return;
    }    
};
//GeoCatalogTree.prototype.hiddenFloatMenu ���ظ���С�˵�
gtgdm.GeoCatalogTree.prototype.hiddenFloatMenu= function () {
    //����ѡ��ʸ��С����ʱ���Ҳ��floatMenu�˵�
    var name = gtgdm.ObjectNames.FLOAT_MENU;
    var floatMenu = gtgdm.Global.getObject(name);
    if (floatMenu) {
        floatMenu.hidden();
    }
    var distmap = this.getDataDistMap();
    if(distmap !== null && distmap !== undefined)
    {
        distmap.clearGridVectorLayer();
    }
}