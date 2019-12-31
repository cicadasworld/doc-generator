/**
 * Created by xuxiaorong on 2018/11/28.
 */
//SearchControl.function 查询界面管控类
gtgdm.SearchControl = function() {

    var self = this;
    $('#geoSearchTab').append('<div id="geoSearchTreeDiv"></div>');
    $('#geoResTabs').tabs();
    $('#geoResTabs').tabs('disableTab',1);

    $('#search').click(function () {
        self.searchByConditions();
    });
    $('#expandBtn').linkbutton({
        plain:true,
        onClick:function () {
            $('#queryContainer').animate({'left':'0'},'fast','swing');
        }
    })
    $('#collapseBtn').linkbutton({
        plain:true,
        onClick:function () {
            $('#queryContainer').animate({'left':'-1010px'},'fast','swing');
            gtgdm.Global.dispatchEvent('reset',null);
        }
    })
    // $('#expandBtn').click(function () {
    //     $('#queryContainer').animate({'left':'0'},'fast','swing');
    //     $('#expandBtn').hide();
    //     $('#collapseBtn').show();
    // })
    // $('#collapseBtn').click(function () {
    //     $('#queryContainer').animate({'left':'-1010px'},'fast','swing');
    //     $('#expandBtn').show();
    //      $('#collapseBtn').hide();
    //     gtgdm.Global.dispatchEvent('reset',null);
    // })
    $('#vector_ck').change(function (event) {
        if(event.target.checked){
            $('.checkByLayerName input').attr('disabled',false);
            $('.checkByLayerName input').val('');
            $('.checkByLayerName input').attr('placeholder','请输入图层名');
        }else{
            $('.checkByLayerName input').attr('disabled',true);
            $('.checkByLayerName input').val('');
            $('.checkByLayerName input').attr('placeholder','勾选矢量数据后此项可用');

        }
    })
    $('#rectangleSearch').click(function (e) {

        //此处的query，在监听事件函数中通过event.target来访问，约定
        // ‘query’表示是查询面板中的拉框选取
        //'extract'表示是提取的拉框选取
        gtgdm.Global.dispatchEvent('rectangleSearch','query');

    });
    $('#reset').click(function (e) {
        gtgdm.Global.dispatchEvent('reset',null);
    })
}

//SearchControl.prototype.searchByConditions 按照综合条件查询
gtgdm.SearchControl.prototype.searchByConditions = function() {
    var extent = gtgdm.AsyncVar.searchExtent;
    var dateFrom = $('#dateFrom').val();
    var dateTo = $('#dateTo').val();
    var value = $('.queryKeyWord input').val();
    var tileNum = $('.checkByTileNumber input').val();
    var layerName = $('.checkByLayerName input').val();
    var checkBox_divs = document.getElementsByName('dateType');
    var dateType_arr = [];
    for(var p in checkBox_divs){
        if(checkBox_divs[p].checked){
            dateType_arr.push(checkBox_divs[p].value);
        }
    }

    var from = '',
        to = '';
    if(dateType_arr.length ===0 &&!extent && !dateFrom && !dateTo && !value &&!tileNum && !layerName ){
        $.messager.alert('警告','请选择一个查询条件');
        return;
    }

    if(dateFrom || dateTo){
        var reg = /-/g;
        from = dateFrom.replace(reg,'');
        to = dateTo.replace(reg,'');
    }
    //如果只填写了开始时间，默认结束时间是today，如果只填写了结束时间，默认开始时间是1970年1月1日
    if (from && !to){
        var date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();
        if(month < 10){
            month = '0'+ month;
        }
        if(day < 10){
            day = '0' + day;
        }
        to = ''+year + month + day ;
    }
    if (!from && to){
        from = '19700101';
    }
    if (+from > +to) {
        $.messager.alert('警告', '开始日期必须早于结束日期');
        return;
    }
    //把5万转成50000

    if(value !== ''){
        var reg1 = /\u4e07/g;
        value = value.replace(reg1,'0000');
    }
    //如果没有填写任何条件，点击无效

    //tab页跳转到搜索tab
    $('#geoResTabs').tabs('enableTab',1);
    $('#geoResTabs').tabs('select',1);

    // $('.gt-tabs-imakgerk', this.dlg_).tabs('select', 1);
    var endPoint = gtgdm.Global.getAppContext() + 'geodata/v1/metadata/aggregations?encoding=utf-8';

    if (extent){
        endPoint += '&extent=[' + extent + ']';
    }
    if (from || to){
        endPoint += '&from=' + from + '&to=' + to;
    }
    if (value){
        value = encodeURI(value);
        endPoint += '&keyword=' + value;
    }
    if(tileNum){
        endPoint += '&tilenumber=' + tileNum;
    }
    if(layerName){
        endPoint += '&layername=' + encodeURI(layerName);
    }
    if(dateType_arr.length > 0){
        endPoint += '&datatype=' + dateType_arr.join(',');
    }

    var searchOption = {
        extent,
        from,
        to,
        key:value,
        tileNum,
        layerName,
        dateType_arr
    }

    var promise = gtgdm.utils.getJSON(endPoint);
    promise.then(function (json) {
        for(let i = 0,ii = json.length;i < ii; i++){
            if(json[i].childrenCount !== 0){
                break;
            }
            if(i === json.length -1){
                $.messager.alert('提示','没有符合条件的数据');
            }
        }

        var name = gtgdm.ObjectNames.SEARCH_RESULT_TREE;
        var tree = gtgdm.Global.getObject(name);
        if(!tree){
            tree = new gtgdm.SearchResultTree('#geoSearchTreeDiv',json,searchOption);
            gtgdm.Global.putObject(name,tree);

        }else{
            tree.setData(json);
        }

    }).catch(function (error) {
        var name = gtgdm.ObjectNames.SEARCH_RESULT_TREE;
        var tree = gtgdm.Global.getObject(name);
        if(tree != null && tree!= undefined){
            tree.destroyTree();
        }
        console.log('Error:'+ error);
    })

}
//响应框选查询
gtgdm.Global.addEventListener('rectangleSearch', function (event) {

    var georect= [];
    var target = event.target;
    var map_ = gtgdm.Global.getObject(gtgdm.ObjectNames.GEO_DATA_DIST_MAP),
        map = map_.getMap();
    //清除拉框提取小按钮， 有必要
    var rectDiv = gtgdm.Global.getObject(gtgdm.ObjectNames.RECTEXTRACT_MINIMENU);
    if (rectDiv !== null && rectDiv !== undefined) {
        rectDiv.hidden()
    }
    // 清除上一次的框选范围
    if (map_.searchVector_) {

        var vector = map_.searchVector_;
        var draw = map_.searchDraw_;
        map.removeLayer(vector);
        map.removeInteraction(draw);
        map_.searchVector_ = null;
        map_.searchDraw_ = null;
        gtgdm.AsyncVar.searchExtent = '';

    }
    var source = new ol.source.Vector();
    var vector = map_.searchVector_ = new ol.layer.Vector({
        source: source,
        zIndex: gtgdm.LayerIndex.RectExtractlayerIndex
    });
    var vectorTrackLayer = map_.rectangleVectorTrackLayer_ = new gtgdm.TrackLayer(map);
    var draw = map_.searchDraw_ = new ol.interaction.Draw({
        source: source,
        type: 'LineString',
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 153, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            })
            ,
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        }),
        maxPoints: 2,
        geometryFunction: function (coordinates, geometry) {
            if (!geometry) {
                geometry = new ol.geom.Polygon(null);
            }
            var start = coordinates[0];
            var end = coordinates[1];
            geometry.setCoordinates([
                [start, [start[0], end[1]], end, [end[0], start[1], start]]
            ]);
            geometry.draggable_ = true;
            //georect = [geometry];

            return geometry;
        }
    });
    map.addInteraction(draw);
    map.addLayer(vector);
    map.addLayer(vectorTrackLayer);

    map_.toolTipListener = gtmap.events.listen(map, 'pointermove', map_.handlePointerMove_, map_);

    draw.addEventListener('drawstart', function (e) {
        var toolTip = map_.tooltipLabel_;
        if (toolTip) {
            map.removeOverlay(toolTip);
        }
        map_.tooltipLabel_ = undefined;
        var key = map_.toolTipListener;
        gtmap.events.unlistenByKey(key);
    })
    draw.addEventListener('drawend', function (e) {
        // console.log('end:' + e.target.coordinates);
        var feature = e.feature;
        if (feature) {
            var geom = feature.getGeometry();
            var coors = geom.getCoordinates();
            var style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(0, 153, 255, 0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                })
            })
            feature.setStyle(style);
        }
        map.removeInteraction(draw);
        var coor = coors[0];
        var minX = coor[0][0],
            minY = coor[0][1],
            maxX = coor[0][0],
            maxY = coor[0][1];
        for (var i = 1; i < 4; ++i) {
            minX = Math.min(minX, coor[i][0]);
            minY = Math.min(minY, coor[i][1]);
            maxX = Math.max(maxX, coor[i][0]);
            maxY = Math.max(maxY, coor[i][1]);
        }

//左下右上

        var lonlat1 = gtmap.xyToLonLat([minX,minY]);
        var lonlat2 = gtmap.xyToLonLat([maxX,maxY]);
        var extent = lonlat1.concat(lonlat2);

        var topVal = extent[1].toFixed(2),
            bottomVal = extent[3].toFixed(2),
            leftVal = extent[0].toFixed(2),
            rightVal = extent[2].toFixed(2);
        var preTop = '北纬',
            preRight = '东经',
            preLeft = '东经',
            preBottom = '北纬',
            end = '度';
        if (topVal < 0) {
            //南半球
            preTop = '南纬';
        }
        if (bottomVal < 0) {
            preBottom = '南纬';
        }
        if (leftVal < 0) {
            preLeft = '西经';
        }
        if (rightVal < 0) {
            preRight = '西经';
        }
        var top = preTop + Math.abs(topVal) + end,
            bottom = preBottom + Math.abs(bottomVal) + end,
            left = preLeft + Math.abs(leftVal) + end,
            right = preRight + Math.abs(rightVal) + end;
        $('.extentArea_bottom').text(bottom);
        $('.extentArea_top').text(top);
        $('.extentArea_left').text(left);
        $('.extentArea_right').text(right);
        // $('#right_ch').css('marginRight', '50px');
        gtgdm.AsyncVar.searchExtent = extent;

    })

})
//响应查询条件重置
gtgdm.Global.addEventListener('reset', function (event) {
    var map_ = gtgdm.Global.getObject(gtgdm.ObjectNames.GEO_DATA_DIST_MAP),
        map = map_.getMap();
    var vector = map_.searchVector_;
    var draw = map_.searchDraw_;
    if (draw) {
        map.removeInteraction(draw);
        map_.searchDraw_ = null;
    }
    if (vector) {
        var source = vector.getSource();
        source.clear();
        map.removeLayer(vector);
        map_.searchVector_ = null;
    }


    gtgdm.AsyncVar.searchExtent = '';

    $('.extentArea_bottom').html('');
    $('.extentArea_top').html('');
    $('.extentArea_left').html('');
    $('.extentArea_right').html('');
    $('.queryKeyWord input').val('');
    $('#dateFrom').val('');
    $('#dateTo').val('');
    $('.checkByTileNumber input').val('');
    $('.checkByLayerName input').val('');
    var inputs = document.getElementsByName('dateType');
    for(let i = 0, ii = inputs.length; i < ii ; i++ ){
        inputs[i].checked = false;
    }
    // $('#right_ch').css('marginRight', '-30px');

})