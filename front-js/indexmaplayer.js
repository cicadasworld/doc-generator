/**
 * Created by user on 2018/9/11.
 */


///////////////////////////////////////////////////////////////////////////////
// 接图表类定义
// map: OpenLayer地图对象
///////////////////////////////////////////////////////////////////////////////
//GTIndexMapLayer.function 接图表图层类定义
gtgdm.GTIndexMapLayer = function(options,map) {
        options = options || {};
        var wrapX = options.wrapX ? options.wrapX : false;
        var style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(200, 100, 100, 0.4)'
            }),
            stroke: new ol.style.Stroke({
                color: '#319FD3',
                width: 1
            }),
            text: new ol.style.Text({
                font: '12px Calibri,sans-serif',
                fill: new ol.style.Fill({
                    color: '#000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 1
                })
            })
        });
        var styles = [style];

        options.source = new ol.source.Vector({
            useSpatialIndex: false,
            wrapX: wrapX
        });
        options.style = function(feature, resolution) {
            style.getText().setText(feature.get('name'));
            return styles;
        };
        options.zIndex=gtgdm.LayerIndex.MapIndexLayerIndex;
        ol.layer.Vector.call(this, options);

        // OpenLayer地图
        this.map = map;

        // 当前选取的图幅编号数组，元素为图幅号
        this.selectedFeatures = [];
        this.selectClick = null;
        // this.selectLayer =new ol.layer.Vector({
        //     title:'select layer',
        //     source:new ol.source.Vector(),
        //     style :new ol.style.Style({
        //         stroke: new ol.style.Stroke({
        //             width: 2,
        //             color: 'black'
        //         }),
        //         fill: new ol.style.Fill({
        //             color: 'rgb(0, 255, 0)'

        //         })
        //     })
        //
        //  });

        //当前设置的接图表比例尺
        this.currentIndexScale = 0;
        this.listenerKeys_ =[];

};
ol.inherits(gtgdm.GTIndexMapLayer, ol.layer.Vector);


//GTIndexMapLayer.prototype.createTileData 创建polygon Tile
    gtgdm.GTIndexMapLayer.prototype.createTileData = function (tile) {
        var coor_ = [],//三维数组
            coor2 = [];//转换成墨卡托坐标


        var left_ = tile.left,
        top_ = tile.top,
        right_ = tile.right,
        bottom_ = tile.bottom;

        coor_.push([[left_,top_],[left_,bottom_],[right_,bottom_],[right_,top_],[left_,top_]]);

        for (var i = 0, ii = coor_.length; i < ii; ++i) {
            var coor = [];
            for (var j = 0, jj = 5; j < jj; ++j) {
                coor.push(gtmap.lonlatToXy(coor_[i][j]));
            }
            coor2.push(coor);
        }

            //所有feature加起来的边界值
            _left = coor2[0][0][0],
            _right = coor2[0][2][0],
            _bottom = coor2[0][0][1],
            _top = coor2[0][2][1];
        var left = Math.min(_left,_right),
            right = Math.max(_left,_right),
            bottom = Math.min(_bottom,_top),
            top = Math.max(_bottom,_top);
        //创建feature
        this.widthOfPerUnit_ = Math.abs(right - left);

        //for (var k = 0, kk = coor2.length; k < kk; ++k) {

            var polygon_feature = new ol.Feature({
                geometry: new ol.geom.Polygon([coor2[0]]),
                name: tile.name,

            });


        var sourceObj = this.getSource();
        sourceObj.addFeature(polygon_feature);

    }

    // 根据当前屏幕范围筛选图幅
    gtgdm.GTIndexMapLayer.prototype._getTileByScreenRect = function(tileList) {

    var bounds = this.getMapBoundsLL();	// 当前屏幕可见地理范围
    var width = bounds.right - bounds.left;
    var height = bounds.top - bounds.bottom;

    // 扩大屏幕范围
    bounds.left = bounds.left - width/10;
    bounds.right = bounds.right + width/10;
    bounds.bottom = bounds.bottom - height/10;
    bounds.top = bounds.top + height/10;

    // var p1 = gtgdm.CoordUtil.AntiCoordAdapter(bounds.left, bounds.top);
    // var p2 = gtgdm.CoordUtil.AntiCoordAdapter(bounds.right, bounds.bottom);
    // var rect = {left: p1.x, bottom: p2.y, right: p2.x, top: p1.y};
    var rect = bounds;
    this.adjustTileLL(rect.left,-180,180);
    this.adjustTileLL(rect.right,-180,180);
    this.adjustTileLL(rect.top,-90,90);
    this.adjustTileLL(rect.bottom,-90,90);
    var count = tileList.length;

    var tList = new Array();
    for (i=0; i<count; i++) {
        var tile = tileList[i];
        if (this._isTileInScreenRect(tile, rect) == true) {
            tList.push(tile);
        }
        else if (this._isScreenRectInTile(tile, rect) == true) {
            tList.push(tile);
        }
    }
    return tList;
};
// 判断一个图幅是否在矩形区域内
// tile: GTIndexMapTile对象
// rect: {left: 0, bottom: 0, right: 0, top: 0}

//GTIndexMapLayer.prototype._isTileInScreenRect 判断一个图幅是否在矩形区域内
    gtgdm.GTIndexMapLayer.prototype._isTileInScreenRect = function (tile, rect) {

        // 图幅的四个顶点至少有一个在区域内
        if ( this._isPointInRect({x: tile.left, y: tile.top}, rect) ) {
            return true;
        }
        else if ( this._isPointInRect({x: tile.left, y: tile.bottom}, rect) ) {
            return true;
        }
        else if ( this._isPointInRect({x: tile.right, y: tile.top}, rect) ) {
            return true;
        }
        else if ( this._isPointInRect({x: tile.right, y: tile.bottom}, rect) ) {
            return true;
        }
        else if ( tile.left > rect.left && tile.left < rect.right && tile.top > rect.top && tile.bottom < rect.bottom ) {
            return true;
        }
        else if ( tile.right > rect.left && tile.right < rect.right && tile.top > rect.top && tile.bottom < rect.bottom ) {
            return true;
        }
        else if ( tile.left < rect.left && tile.right > rect.right && tile.top < rect.top && tile.top > rect.bottom ) {
            return true;
        }
        else if ( tile.left < rect.left && tile.right > rect.right && tile.bottom < rect.top && tile.bottom > rect.bottom ) {
            return true;
        }
        return false;
    };

// 判断一个矩形区域是否在图幅内
// tile: GTIndexMapTile对象
// rect: {left: 0, bottom: 0, right: 0, top: 0}
//GTIndexMapLayer.prototype._isScreenRectInTile 判断一个矩形区域是否在图幅内
    gtgdm.GTIndexMapLayer.prototype._isScreenRectInTile = function (tile, rect) {

        // 区域的四个顶点至少有一个在图幅内
        var r = {left: tile.left, bottom: tile.bottom, right: tile.right, top: tile.top};
        if ( this._isPointInRect({x: rect.left, y: rect.top}, r) ) {
            return true;
        }
        else if ( this._isPointInRect({x: rect.left, y: rect.bottom}, r) ) {
            return true;
        }
        else if ( this._isPointInRect({x: rect.right, y: rect.top}, r) ) {
            return true;
        }
        else if ( this._isPointInRect({x: rect.right, y: rect.bottom}, r) ) {
            return true;
        }
        return false;
    };
// 判断一个点是否在矩形屏幕区域内
// point: {x: 0, y: 0}
// rect: {left: 0, bottom: 0, right: 0, top: 0}
//GTIndexMapLayer.prototype._isPointInRect 判断一个点是否在矩形屏幕区域内
    gtgdm.GTIndexMapLayer.prototype._isPointInRect = function (point, rect) {

        if (point.x >= rect.left && point.x <=rect.right && point.y >= rect.bottom && point.y <=rect.top) {
            return true;
        }
        return false;
    };

// GTIndexMapLayer.prototype.getMapBoundsLL 获取地图经纬度范围，做了 转换
    gtgdm.GTIndexMapLayer.prototype.getMapBoundsLL = function () {

        var bounds = this.map.getBounds();	// 当前屏幕可见地理范围
        var prj = this.map.getProjection();
        var LLp1 = gtmap.xyToLonLat([bounds.left, bounds.bottom],prj);
        var LLp2 = gtmap.xyToLonLat([bounds.right,bounds.top],prj);
        // bounds.concat(LLp1);
        // bounds.concat(LLp2);
        var boundsLL =new gtmap.Bounds(LLp1[0],LLp1[1],LLp2[0],LLp2[1]);
        return boundsLL;

    };
// GTIndexMapLayer.prototype.show 绘制可见范围接图表
    gtgdm.GTIndexMapLayer.prototype.show = function(scale) {

        // 显示已经选取的图幅
        this.getSource().clear();
        if(this.selectedFeatures.length>0 && this.selectClick.featureOverlay_)
            this.selectClick.featureOverlay_.getSource().clear();//选中后， 放缩时，清理掉 选中 的图形 ol-debug.js 可以  ol.js 会不正确， 应该是调用了私有的成员导致
        this.selectedFeatures=[];

        this.currentIndexScale = scale;
        var zoom = this.map.getZoom();
        var minShowZoom = this.getZoomByScale(scale);	// 地图级别小于该值时，不显示接图表

        if (zoom < minShowZoom) {

            $.messager.alert('当前地图比例尺过小，接图表过于密集，暂时不显示，放大地图可显示');
            // this.bInvalidScaleShow = false;
            return;
        }
        // this.bInvalidScaleShow = true;
        var util = new gtgdm.GTIndexMapUtil();

        var bounds = this.getMapBoundsLL();


        // 显示屏幕范围内的图幅
        var tileList = util.getTileInRectangle(scale, bounds.left, bounds.bottom, bounds.right, bounds.top);
        var tList = this._getTileByScreenRect(tileList);
        var count = tList.length;
        for (i=0; i<count; i++) {
            var tile = tList[i];
            if (tile.left >= 180) {
                continue;	// 超出地图范围
            }
            this.createTileData(tile);
        }
        this.bindClickFeature();
    };

gtgdm.GTIndexMapLayer.prototype.setMap = function(map) {

    ol.layer.Vector.prototype.setMap.call(this, map);
    if (!map) {
        return;
    }
    var view = map.getView();
    var vec = this.listenerKeys_;
    for (var i = 0, ii = vec.length; i < ii; ++i) {
        gtmap.events.unlistenByKey(vec[i]);
    }
    this.listenerKeys_.push(gtmap.events.listen(view, 'change:center', this.updateFeatures, this)),//平移
    this.listenerKeys_.push(gtmap.events.listen(view, 'change:resolution', this.updateFeatures, this));// 放缩
        //gtmap.events.listen(map, 'change:size', this.updateFeatures, this)


};
gtgdm.GTIndexMapLayer.prototype.removeEvents = function()
{
    // 取消之前注册的事件处理器
    var vec = this.listenerKeys_;
    for (var i = 0, ii = vec.length; i < ii; ++i) {
        gtmap.events.unlistenByKey(vec[i]);
    }

}
gtgdm.GTIndexMapLayer.prototype.getZoomByScale = function(scale)
{

    var minShowZoom = 0;	// 地图级别小于该值时，不显示接图表

    switch(scale)
    {
        case 1000000:
            minShowZoom = 4;
            break;
        case 500000:
            minShowZoom = 5;
            break;
        case 250000:
            minShowZoom = 6;
            break;
        case 100000:
            minShowZoom = 7;
            break;
        case 50000:
            minShowZoom = 8;
            break;
        case 25000:
            minShowZoom = 9;
            break;
        case 10000:
            minShowZoom = 10;
            break;
    }
    return minShowZoom;
}
gtgdm.GTIndexMapLayer.prototype.clear = function () {
    this.map.removeInteraction(this.selectClick);
    var source = this.getSource();
    source.clear();
    source.refresh();

}
gtgdm.GTIndexMapLayer.prototype.updateFeatures = function()
{
    var zoom = this.map.getZoom();
    var minShowZoom = this.getZoomByScale(this.currentIndexScale);	// 地图级别小于该值时，不显示接图表

    if (zoom < minShowZoom) {
        this.clear();
        return;
    }
    this.show(this.currentIndexScale);
};
gtgdm.GTIndexMapLayer.prototype.adjustTileLL = function(value,min,max)
{
    if(value < min) value = min;
    if(value > max) value = max;
    return value;
};

gtgdm.GTIndexMapLayer.prototype.bindClickFeature= function () {


    this.selectClick = new ol.interaction.Select({
        addCondition:function (e) {
            if(e.type ==='click'&& e.originalEvent.ctrlKey === true){
                return true;
            }

        },
        removeCondition:function (e) {
            if(e.originalEvent.UNSELECTED){
                return true;
            }
            // return true;
        },
        condition: ol.events.condition.click,
        style: function (feature) {

            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 1,
                    color: 'red'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.7)'
                }),
                text: new ol.style.Text({
                    text: feature.get('name')
                })
            })
        },
        layers:[this],
        //是否显示当前位置所有的feature
        //multi:true, 必须是false，  否则hit 有问题？
        features:this.selectedFeatures
    });

    this.map.addInteraction(this.selectClick);
    // var source_= this.selectLayer.getSource();
    // var ClickEvent = function (e) {
    //      var select = e.target;
    //      var collection = select.getFeatures();
    //      var features = collection.getArray();
    //     //  var style =  new ol.style.Style({
    //     //      stroke: new ol.style.Stroke({
    //     //          width: 2,
    //     //          color: 'black'
    //     //      }),
    //     //      fill: new ol.style.Fill({
    //     //          color: 'rgb(0, 255, 0)'
    //     //      })
    //     //  });
    //     //
    //     //  select.fillStyle = style.fillStyle;
    //     //  var count = features.length;
    //     // for (i=0; i<count; i++) {
    //     //
    //     //     //source_.addFeature(features[i]);
    //     // }
    // }
    //  selectClick.on("select", ClickEvent);
}