/**
 * Created by user on 2018/9/11.
 */
//IndexMapUI.function 接图表界面初始化
gtgdm.IndexMapUI = function(){
    $('body').append("<div id=\"indexmapMenuItems\" style=\"width:100px;\"/>");
    $('#indexmapMenuItems').html(
        // "<div id='auto'>自动接图表</div>"+
        "<div id='100w' >1:100w</div>"
        + "<div id='50w'>1:50w</div>"
        + "<div id='25w'>1:25w</div>"
        + "<div id='10w'>1:10w</div>"
        + "<div id='5w' >1:5w</div>"
        + "<div id='2w5'>1:2.5w</div>"
        + "<div id='1w' >1:1w</div>"
        + "<div id='clearIndexMapLayer'>清除</div>"
    );
    $('#indexmapMenu').menubutton({
        //showEvent: 'click',
        menu: '#indexmapMenuItems'
    });

    $("#indexmapMenuItems").menu({
        onClick: function (item) {
            var ary = this.getElementsByClassName("menu-icon");
            var id = item.id;
            var text = item.text;
            for(var i=0; i<ary.length;i++){
                ary[i].outerHTML = "<div class='menu-icon icon-blank'></div>"
            }
            item.target.innerHTML +=  "<div class='menu-icon icon-ok'></div>"
            gtgdm.Global.dispatchEvent('indexmapshow', null, item.id);

        }
    });
}

gtgdm.Global.addEventListener('indexmapshow',respondIndexMap);
//IndexMapUI.function 响应接图表事件
function respondIndexMap(event, scaleType) {

    var map_ = gtgdm.Global.getObject(gtgdm.ObjectNames.GEO_DATA_DIST_MAP);
    var map = map_.getMap();
    //var maplayer = new gtgdm.GTIndexMapLayer({},map);

    if(map_.indexMapLayer ===null )
    {
        map_.indexMapLayer = new gtgdm.GTIndexMapLayer({},map);
        map_.indexMapLayer.setMap(map);
        map.addLayer(map_.indexMapLayer);

        // map_.indexMapLayer.bindClickFeature();
    }
    var maplayer = map_.indexMapLayer;

    switch (scaleType) {
        case 'auto':
        {
            break;
        }
        case '100w':
        {
            maplayer.show(1000000);
            break;
        }
        case'50w':
        {
            maplayer.show(500000);
            break;
        }
        case '25w':
        {
            maplayer.show(250000);
            break;
        }
        case '10w':
        {
            maplayer.show(100000);
            break;
        }
        case '5w':
        {
            maplayer.show(50000);
            break;
        }
        case '2w5':
        {
            maplayer.show(25000);
            break;
        }
        case '1w':
        {
            maplayer.show(10000);
            break;
        }
        case 'clearIndexMapLayer':
        {
            map_.indexMapLayer.clear();
            map_.indexMapLayer.removeEvents();
            map.removeLayer(map_.indexMapLayer);
            map_.indexMapLayer = null;
            // gtgdm.Global.removeEventListener('indexmapshow', respondIndexMap);
        }
        default:
            return;
    }

}