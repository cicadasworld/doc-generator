/**
 * Created by xuxiaorong on 2018/11/28.
 */
//SearchControl.function ��ѯ����ܿ���
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
            $('.checkByLayerName input').attr('placeholder','������ͼ����');
        }else{
            $('.checkByLayerName input').attr('disabled',true);
            $('.checkByLayerName input').val('');
            $('.checkByLayerName input').attr('placeholder','��ѡʸ�����ݺ�������');

        }
    })
    $('#rectangleSearch').click(function (e) {

        //�˴���query���ڼ����¼�������ͨ��event.target�����ʣ�Լ��
        // ��query����ʾ�ǲ�ѯ����е�����ѡȡ
        //'extract'��ʾ����ȡ������ѡȡ
        gtgdm.Global.dispatchEvent('rectangleSearch','query');

    });
    $('#reset').click(function (e) {
        gtgdm.Global.dispatchEvent('reset',null);
    })
}

//SearchControl.prototype.searchByConditions �����ۺ�������ѯ
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
        $.messager.alert('����','��ѡ��һ����ѯ����');
        return;
    }

    if(dateFrom || dateTo){
        var reg = /-/g;
        from = dateFrom.replace(reg,'');
        to = dateTo.replace(reg,'');
    }
    //���ֻ��д�˿�ʼʱ�䣬Ĭ�Ͻ���ʱ����today�����ֻ��д�˽���ʱ�䣬Ĭ�Ͽ�ʼʱ����1970��1��1��
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
        $.messager.alert('����', '��ʼ���ڱ������ڽ�������');
        return;
    }
    //��5��ת��50000

    if(value !== ''){
        var reg1 = /\u4e07/g;
        value = value.replace(reg1,'0000');
    }
    //���û����д�κ������������Ч

    //tabҳ��ת������tab
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
                $.messager.alert('��ʾ','û�з�������������');
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
//��Ӧ��ѡ��ѯ
gtgdm.Global.addEventListener('rectangleSearch', function (event) {

    var georect= [];
    var target = event.target;
    var map_ = gtgdm.Global.getObject(gtgdm.ObjectNames.GEO_DATA_DIST_MAP),
        map = map_.getMap();
    //���������ȡС��ť�� �б�Ҫ
    var rectDiv = gtgdm.Global.getObject(gtgdm.ObjectNames.RECTEXTRACT_MINIMENU);
    if (rectDiv !== null && rectDiv !== undefined) {
        rectDiv.hidden()
    }
    // �����һ�εĿ�ѡ��Χ
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

//��������

        var lonlat1 = gtmap.xyToLonLat([minX,minY]);
        var lonlat2 = gtmap.xyToLonLat([maxX,maxY]);
        var extent = lonlat1.concat(lonlat2);

        var topVal = extent[1].toFixed(2),
            bottomVal = extent[3].toFixed(2),
            leftVal = extent[0].toFixed(2),
            rightVal = extent[2].toFixed(2);
        var preTop = '��γ',
            preRight = '����',
            preLeft = '����',
            preBottom = '��γ',
            end = '��';
        if (topVal < 0) {
            //�ϰ���
            preTop = '��γ';
        }
        if (bottomVal < 0) {
            preBottom = '��γ';
        }
        if (leftVal < 0) {
            preLeft = '����';
        }
        if (rightVal < 0) {
            preRight = '����';
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
//��Ӧ��ѯ��������
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