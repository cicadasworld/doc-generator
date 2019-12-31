//
// Copyright 2018 GTTech Team. All Rights Reserved.
//
'use strict';

//
// 目录树中的每个ztreenode节点具有以下字段:
//
// (1) gtClassifierCode {String} 给出是框架数据产品库、应用库还是面向服务产品库, 取值为gtgdm.GeoRepo.PRODUCT等;
// (2) gtDataType {String} 给出地理数据类型，取值为gtgdm.GeoDataType.IMAGE等;
// (3) gtNodeKind {Integer} 给出ztreenode节点种类，取值为gtgdm.GeoCatalogNodeKind.AGG等;
// (4) gtObject {Object} ztreenode关联的应用层数据;
// (5) gtChildrenLoaded {Boolean} 子节点是否已经加载;
// (6) gtDistVectorLayer {Object} 数据分布显示矢量层，仅某些种类的节点才有该字段.
//

//
// 目录树中各节点种类常量
//
gtgdm.GeoCatalogNodeKind = {
    // 节点是"聚合分类节点",关联的gtObject为GeoEntityAggNodeDO，取值样子如下:
    // {
    //   "fieldName": "dataType",
    //   "rangedValue": false,
    //   "children": [],
    //   "caption": "影像数据",
    //   "virtualNode": false,
    //   "fieldValue1": "001",
    //   "childrenCount": 16
    //}
    AGG: 1,

    // 节点是"地理资源实体节点",关联的gtObject为GeoEntityDescriptorDO(地理资源实体元数据)，取值样子如下:
    // {
    //     "geoResID": "bf93eeb3bd862317478bf0de53494d03",
    //     "extentBottom": -20037508.342789,
    //     "classifierCode": "002",
    //     "spatialRefCaption": "Web墨卡托投影坐标系",
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

    // 节点是"地理资源实体的文件夹节点",关联的gtObject为GeoEntityDescriptorDO(地理资源实体元数
    // 如对于"2018年数据\北京影像"，其中"2018年数据"对应"文件夹节点""。
    GEO_ENTITY_FOLDER: 3,

    // 节点是"应用库中VES矢量资源实体的某个Layer",关联的gtObject为VES矢量资源实体元数据(GeoEntityDescriptorDO)
    VES_LAYER: 4,

    // 节点是"应用库中瓦片类资源实体的某个级别",关联的gtObject为LevelDataDistDO
    TILE_LEVEL: 5
};

////////////////////////////////////////////////////////////////////////////////

//
//
//GeoCatalogTree.function  地理资源目录树。
gtgdm.GeoCatalogTree = function (parentDiv, treeId) {
    this.treeId_ = treeId || 'catalogtree';
    this.parentDiv_ = parentDiv;
    this.ztree_ = undefined;
    this.initZtree_();
};

gtgdm.GeoCatalogTree.prototype.getAppContext = function() {
    return gtgdm.Global.getAppContext();
};


//GeoCatalogTree.prototype.getDataDistMap  获取用于显示数据分布的底图
gtgdm.GeoCatalogTree.prototype.getDataDistMap = function() {
    return gtgdm.Global.getObject(gtgdm.ObjectNames.GEO_DATA_DIST_MAP);
};

// GeoCatalogTree.prototype.reload 重新加载整个目录树
gtgdm.GeoCatalogTree.prototype.reload = function() {
    if (this.ztree_ !== undefined) {
        this.ztree_.destroy();
        this.ztree_ = undefined;
    }
    this.initZtree_();

    // 隐藏之前的数据分布情况图
    let distMap = this.getDataDistMap();
    if (distMap) {
        distMap.hideDistVectorLayer();
    }

    //从服务器端获取目录树架子, 并展示于树中
    let endpoint = this.getAppContext() + 'geodata/v1/metadata/aggregations?encoding=utf-8';
    let promise = gtgdm.utils.getJSON(endpoint);
    let self = this;
    promise.then(function (aggNodeList) {
        self.createTreeSkeleton_(aggNodeList);
    })
    ['catch'](function (error) {
        // TODO: 错误处理
        console.log('Error: ' + error);
    });
};

// GeoCatalogTree.prototype.initZtree_ 创建ztree
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

    // 创建DOM节点
    if (!document.getElementById(this.treeId_)) {
        let html = "<ul id=\"{treeId}\" class=\"ztree\"></ul>".replace('{treeId}', this.treeId_);
        $(this.parentDiv_).append(html);
    }

    // 初始化ztree
    this.ztree_ = $.fn.zTree.init($('#' + this.treeId_), setting, null);
};

// GeoCatalogTree.prototype.createTreeSkeleton_ 用服务器端返回的目录树架子数据生成树结构
gtgdm.GeoCatalogTree.prototype.createTreeSkeleton_ = function(aggNodeList) {
    const zParentNode = null;
    const level = 0;
    for (let i=0, ii=aggNodeList.length; i<ii; ++i) {
        const aggNode = aggNodeList[i];
        if (aggNode.childrenCount === 0 || aggNode.fieldName != 'classifierCode') {
            continue;
        }

        let classifierCode = aggNode.fieldValue1;
        if (classifierCode === gtgdm.GeoRepo.PRODUCT) { //框架产品库
            let zAggNode = this.fillAggNode_PrdRepo_(zParentNode, aggNode, level);
            if (zAggNode) {
                this.ztree_.expandNode(zAggNode, true, false);
            }
            continue;
        }

        if (classifierCode === gtgdm.GeoRepo.APP) { //应用库
            let zAggNode = this.fillAggNode_AppRepo_(zParentNode, aggNode, level);
            if (zAggNode) {
                this.ztree_.expandNode(zAggNode, true, false);
            }
            continue;
        }

        if (classifierCode === gtgdm.GeoRepo.SO) { //面向服务产品库
            let zAggNode = this.fillAggNode_SoRepo_(zParentNode, aggNode, level);
            if (zAggNode) {
                this.ztree_.expandNode(zAggNode, true, false);
            }
            continue;
        }
    }
};

//gtgdm.GeoCatalogTree.prototype.createDummyZnode_ 伪造一个子节点，展开时可显示"loading..."
gtgdm.GeoCatalogTree.prototype.createDummyZnode_ = function(zParentNode) {
    let vsettings = {
        name: 'loading...',
        icon:  this.getAppContext() + 'mconsole/gdmp/common/images/loading.gif',
        isFakedNode_: true
    };
    this.ztree_.addNodes(zParentNode, -1, vsettings, true);
};
//GeoCatalogTree.prototype.handleTreeNodeExpand_ 展开树节点
gtgdm.GeoCatalogTree.prototype.handleTreeNodeExpand_ = function(event, treeId, zTreeNode) {
    this.hiddenFloatMenu();
    if (!zTreeNode || zTreeNode.gtChildrenLoaded) {
        return;
    }
    // 为"应用库"分类聚合节点加载子节点
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.APP) {
        this.handleTreeNodeExpand_AppRepo_(zTreeNode);
        return;
    }

    // 为"框架数据产品库"分类聚合节点加载子节点
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.PRODUCT) {
        this.handleTreeNodeExpand_PrdRepo_(zTreeNode);
        return;
    }

    // 为"面向服务产品库"分类聚合节点加载子节点
    if (zTreeNode.gtClassifierCode === gtgdm.GeoRepo.SO) {
        this.handleTreeNodeExpand_SoRepo_(zTreeNode);
        return;
    }
};
//gtgdm.GeoCatalogTree.prototype.handleTreeNodeClick_ 处理树节点单击
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
//gtgdm.GeoCatalogTree.prototype.handleTreeNodeDoubleClick_ 处理树节点双击
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
//GeoCatalogTree.prototype.hiddenFloatMenu 隐藏浮动小菜单
gtgdm.GeoCatalogTree.prototype.hiddenFloatMenu= function () {
    //隐藏选中矢量小格子时的右侧的floatMenu菜单
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