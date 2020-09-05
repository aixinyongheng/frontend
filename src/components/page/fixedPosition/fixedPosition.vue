<template>
  <div class="myMap" id="myMap">
    <div id="mapDiv">
      <el-card class="box-card" style="position:absolute;z-index:666;top:20px;">
         <el-tabs v-model="searchType">
            <el-tab-pane label="地理编码" name="dlbm">
                  <el-radio v-model="keytype" label="gd">高德</el-radio>
                  <el-radio v-model="keytype" label="bd">百度</el-radio>
                  <el-radio v-model="keytype" label="tdt">天地图</el-radio>
                  <div class="demo-input-suffix">
                 地址： <el-input v-model="searchAddress"  prefix-icon="el-icon-search" placeholder="请输入内容"></el-input>
                  </div>
            </el-tab-pane>
            <el-tab-pane label="逆地理编码" name="ndlbm">
                  <el-radio v-model="keytype" label="gd">高德</el-radio>
                  <el-radio v-model="keytype" label="bd">百度</el-radio>
                  <el-radio v-model="keytype" label="tdt">天地图</el-radio>
                    <div class="demo-input-suffix">
                 经纬度 <el-input v-model="searchJwd"  prefix-icon="el-icon-search" placeholder="请输入经纬度（,分隔）"></el-input>
                  </div>
            </el-tab-pane>
              <!-- <el-button :disabled="searchType=='ndlbm'" style="margin-top:20px;float:right;" type="primary" @click="queryAddress" round>查询</el-button> -->
              <el-button  style="margin-top:20px;float:right;" type="primary" @click="queryAddress" round>查询</el-button>
        </el-tabs>
    </el-card>
    </div>
    
</div>
</template>

<script>
export default {
  name: "fixedPositionMap",
  data() {
    return {
      searchType:'dlbm',
      keytype:'gd',
      map: null,
      searchAddress:'',
      searchJwd:'',
      screenWidth:'',
      screenHeight:''
    };
  },
  methods: {
 
    //加载wmts服务
    addWMTSClick(){
    //   var vectorLayerUrl = "http://localhost:8088/geoserver/gwc/service/wmts?"+
    //     "REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=cite:town" +
    //     "&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&" +
    //     "FORMAT=application/vnd.mapbox-vector-tile&TILECOL={x}&TILEROW={y}";
    // //application/vnd.mapbox-vector-tile,GEoServer版本不同，这里可能不同，注意在GeoServer里查看
  
    //    var url="http://yingxiang2019.geo-compass.com/api/wmts?layer=d%3a5000dcd59bdcd6079e7b92a4a6745173&style=time%3D1574065096602&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}&threshold=100";
    //    var url2="http://tdt.fuzhou.gov.cn/serviceaccess/wmts/Vector2012CGCS2000?request=GetCapabilities&service=wmts&TILEMATRIX={z}TileCol={x}&TileRow={y}";
    //    var url3="http://192.168.100.2:8899/newmapserver4/tianditu/hlbe/tdtyxzj/wmts?request=GetCapabilities&service=wmts&TILEMATRIX={z}TileCol={x}&TileRow={y}";
    //    //var url4="http://yingxiang2019.geo-compass.com/api/wmts?layer=s%3ABusiness&style=time%3D1574065096602&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}&threshold=100";

    var url="http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=tttyt&STYLE=default&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX=z&TILEROW=y&TILECOL=x";
       this.addRasterLayer({url:url,id:"testid",visible:true});
    },
    addRasterLayer({
        url,
        id,
        minzoom = 0,
        maxzoom = 22,
        visible = true
    }) {
        if (this.map.getLayer(id)) return;
        this.map.addLayer({
            id: id,
            type: 'raster',
            source: {
                type: 'raster',
                tiles: [url],
                tileSize: 256,
                zoomOffset: 1
            },
            layout: {
                visibility: visible ? 'visible' : 'none'
            },
            minzoom,
            maxzoom
        });
    },
    // 加载聚合个数图层
    addEnclavesCountLayer(code) {
      var boundscopy = window.MAP.getBounds();
      var bounds = [
        [boundscopy._sw.lng, boundscopy._sw.lat],
        [boundscopy._ne.lng, boundscopy._ne.lat]
      ];
      var zoom = this.GET_MAP_ZOOM && this.GET_MAP_ZOOM > 0 ? this.GET_MAP_ZOOM : 4;
      var color = [
        "#007cbf",
        "#24A9F4",
        "#B0C54E",
        "#24A9F4",
        "#EF6234",
        "#43B079",
        "#E0C542",
        "#2556FB"
      ];
      var parma = {
        code: code,
        zoom: zoom,
        field: "flyland_num",
        bounds: bounds
      };
      var radius = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
      this.geoRequest.getRange(parma).then(res => {
        if (res.data.code == 1) {
          let min = res.data.data.min ? Number(res.data.data.min) : 0;
          let max = res.data.data.max ? Number(res.data.data.max) : 2000;
          var step = this.util.orgnizeStep(min, max);
          var data = {
            code: "00",
            bounds: JSON.stringify(bounds),
            zoom: zoom
          };
          this.geoRequest.getXzqhNextCenter(data).then(res => {
            if (res.data.code == 1 && res.data.data.geojson.features) {
              var result = res.data.data;
              var that = this;
              var timer = setInterval(function() {
                if (window.MAP && window.MAP.isStyleLoaded()) {
                  var map = window.MAP;
                  if (map.getLayer("building_clusters")) {
                    map.removeLayer("building_clusters");
                  }
                  if (map.getLayer("cluster-count")) {
                    map.removeLayer("cluster-count");
                  }
                  if (map.getSource("arrPointSource")) {
                    map.removeSource("arrPointSource");
                  }
                  map.addSource("arrPointSource", {
                    type: "geojson",
                    data: result.geojson,
                    cluster: true,
                    clusterMaxZoom: 10, // Max zoom to cluster points on
                    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                  });
                  map.addLayer({
                    id: "building_clusters",
                    type: "circle",
                    source: "arrPointSource",
                    filter: ["has", "flyland_num"],
                    paint: {
                      "circle-color": that.util.orgnizeCircleColor(
                        "flyland_num",
                        color,
                        step
                      ),
                      "circle-radius": that.util.orgnizeCircleRadius(
                        "flyland_num",
                        radius,
                        step
                      )
                    }
                  });

                  map.addLayer({
                    id: "cluster-count",
                    type: "symbol",
                    source: "arrPointSource",
                    filter: ["has", "flyland_num"],
                    layout: {
                      "text-field": "{name}\n{flyland_num}",
                      "text-font": [
                        "DIN Offc Pro Medium",
                        "Arial Unicode MS Bold"
                      ],
                      "text-size": 12
                    },
                    paint: {
                      "text-color": "#fff"
                    }
                  });
                  clearInterval(timer);
                }
              }, 200);
            } else {
              if (res.data.code == 0) {
                this.$Notice.error({
                  desc: res.data.msg
                });
              }
            }
          });
        } else {
          this.$Notice.error({
            desc: res.data.msg
          });
        }
      });
    },
    // 
    toggleLayer() {
      console.log(this.map.getSource("national-park"));
      this.map.setPaintProperty('drawpolygonlayer', 'fill-color', '#faafee');
    },
 
    addGeoJson(json) {
      console.log(json);
      if (this.map.getLayer('drawpolygonlayer')) this.map.removeLayer('drawpolygonlayer');
      if (this.map.getLayer('drawpointlayer')) this.map.removeLayer('drawpointlayer');
      if (this.map.getLayer('drawlinelayer')) this.map.removeLayer('drawlinelayer');
      if(this.map.getSource('national-park')!=null){
        this.map.getSource('national-park').setData(json);
      }else{
        this.map.addSource("national-park", {
        type: "geojson",
        data: json
        });
      }
      this.map.addLayer({
        id: "drawpolygonlayer",
        layout: {
          'visibility': 'visible'
        },
        type: "fill",
        source: "national-park",
        paint: {
          "fill-color": "#888888",
          //"fill-opacity": 0.4
        },
        filter: ["==", "$type", "Polygon"]
      });
      this.map.addLayer({
        id: "drawpointlayer",
        type: "circle",
        layout: {
          'visibility': 'visible'
        },
        source: "national-park",
        paint: {
          "circle-radius": 6,
          "circle-color": "#B42222"
        },
        filter: ["==", "$type", "Point"]
      });
      this.map.addLayer({
        id: "drawlinelayer",
        type: "line",
        source: "national-park",
        layout: {
          'visibility': 'visible'
        },
        paint: {
          "line-width": 6,
          "line-color": "#B42222",
          "line-opacity": 0.8
        },
        filter: ["==", "$type", "LineString"]
      });
      this.map.getLayer("drawpolygonLayer=")
    },
    // 切换图层显隐
    toggleLayerGroup(id){
        var visibility = this.map.getLayoutProperty(id,"visibility"
        );
          if (visibility === "visible") {
        this.map.setLayoutProperty(id, "visibility", "none");
        } else {
        this.map.setLayoutProperty(id, "visibility", "visible");
        }
    },
    addAnimateImages(){
       {
              var frameCount = 5;
              var _this=this;
              for (var i = 0; i < frameCount; i++) {
                _this.map.addSource('radar' + i, {
                    type: 'image',     /* iamge类型资源 */
                    url: 'https://www.mapbox.com/mapbox-gl-js/assets/radar'+i+'.gif', /* image的url */
                    coordinates: [
                        [114, 32],
                        [114, 33],
                        [116, 32],
                        [116, 33]
                    ]
                });
                _this.map.addLayer({
                    id: 'radar' + i,
                    source: 'radar' + i,
                    type: 'raster',        /* 栅格类型layer，这里图片用的是raster layer */
                    paint: {
                        'raster-opacity': 0,   /* 图片透明度 */
                        'raster-opacity-transition': {
                            duration: 0
                        }
                    }
                });
            }
            var frame = frameCount - 1;
            /* 通过周期设置不同图片的透明度实现动画效果 */
            setInterval(function() {      /* setInterval(callback,delay)实现动画效果，每隔delay毫秒调用一下callback */     
                _this.map.setPaintProperty('radar' + frame, 'raster-opacity', 0);  /* setPaintProperty(ID,name，value):设置id为ID的layer的属性name的属性值是value */
                frame = (frame + 1) % frameCount;
                _this.map.setPaintProperty('radar' + frame, 'raster-opacity', 1);
            }, 200);
        
        }


    },
   
    queryAddress(){
      // 清除所有图层
      this.clearAllLayers();
      let url="";
      if(this.searchType=='dlbm'){
            if(this.keytype=='gd'){// 高德
        //  console.log(encodeURI(`https://restapi.amap.com/v3/geocode/geo?address="${this.searchAddress}"&output=JSON&key=76c52a1be09375ac80cb68bfe55906dd`))
              this.$axios.get(`https://restapi.amap.com/v3/geocode/geo?address="${encodeURIComponent(this.searchAddress)}"&output=JSON&key=76c52a1be09375ac80cb68bfe55906dd`).then(res=>{
                if (res.data.status == 1 && res.data.infocode == '10000' && res.data.geocodes[0]) {
                 var resultZb = this.$gcoord.transform(
                  res.data.geocodes[0].location.split(','),    // 经纬度坐标
                    this.$gcoord.GCJ02,
                    this.$gcoord.WGS84,          
                  );
                console.log(  res.data.geocodes[0].location.split(','),resultZb)
                this.map.jumpTo({
                center: resultZb,
                zoom: 8,
                });
                var popup = new mapboxgl.Popup({ offset: 25 }).setText(
                  `${res.data.geocodes[0].location}`
                );
                 new mapboxgl.Marker().setLngLat(resultZb).setPopup(popup).addTo(mapboxglMap);  // 需要坐标转换
                  }else{
                    this.$message({
                    showClose: true,
                    message: '未查询到该地址',
                    type: 'warning'
                  });
                  }

              })
            }else if(this.keytype=='bd'){// 百度
                this.$axios.get(`/bdapi/geocoding/v3/?output=json&address="${encodeURIComponent(this.searchAddress)}"&ak=qr3knqGBH0yt7s5MQZYlclbv1aciREt6`).then(res=>{
                 if (res.data.status == 0) {
                console.log(res)
                var resultZb = this.$gcoord.transform(
                        [res.data.result.location.lng,res.data.result.location.lat],    // 经纬度坐标
                        this.$gcoord.BD09 ,
                        this.$gcoord.WGS84,               // 当前坐标系
                    // 目标坐标系
                    );
                this.map.jumpTo({
                center: resultZb,
                zoom: 8,
                });
                var popup = new mapboxgl.Popup({ offset: 25 }).setText(
                  `${res.data.result.location.lng},${res.data.result.location.lat}`
                );
                 new mapboxgl.Marker().setLngLat(resultZb).setPopup(popup).addTo(mapboxglMap); // 需要坐标转换
                 }else{
                    this.$message({
                    showClose: true,
                    message: '未查询到该地址',
                    type: 'warning'
                  });
                 }
              })
            }
            else if(this.keytype=='tdt'){ // 天地图
               this.$axios.get(`http://api.tianditu.gov.cn/geocoder?ds={"keyWord":"${encodeURIComponent(this.searchAddress)}"}&type=geocode&tk=80a23aed6ba5c4ad7d1f0647a619f294`).then(res=>{
                if(res.data&&res.data.location){
                console.log(res)
                this.map.jumpTo({
                center: [res.data.location.lon,res.data.location.lat],
                zoom: 8,
                });
                 var popup = new mapboxgl.Popup({ offset: 25 }).setText(
                  `${res.data.location.lon},${res.data.location.lat}`
                );
                 new mapboxgl.Marker().setLngLat([res.data.location.lon,res.data.location.lat]).setPopup(popup).addTo(mapboxglMap); // 需要坐标转换
                }
                else {
                   this.$message({
                    showClose: true,
                    message: '未查询到该地址',
                    type: 'warning'
                  });
                }
               
              })
            }
           
      }else{
         this.map.jumpTo({
                center: this.searchJwd.split(','),
                zoom: 8,
         });
         new mapboxgl.Marker().setLngLat(this.searchJwd.split(',')).addTo(mapboxglMap); // 需要坐标转换  
         this.$axios.post(`http://localhost:9005/qgzhdc/dataManage/api/v1/createOrUpdateMessageNotice`,{datajson:[{"id":"657c2150-b9e3-11ea-a5e0-3126eff45d91","sfyd":"1"}]}).then(result=>{

         });
      }
    },
    // 清除所有图层
    clearAllLayers (containid) {
      var layers = window.mapboxglMap.getStyle().layers
      var sources = window.mapboxglMap.getStyle().sources
      if (containid == null) {
        // 清除layers
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].id.indexOf('base_') !== -1) {
          } else {
            window.mapboxglMap.removeLayer(layers[i].id)
          }
        }
        // 清除sources
        for (var key in sources) {
          if (key.indexOf('base_') !== -1) {
          } else {
            window.mapboxglMap.removeSource(key)
          }
        }
      } else {
        var contains = containid.split(',')
        for (var containitem of contains) {
          // 清除layers
          for (var j = 0; j < layers.length; j++) {
            if (layers[j].id.indexOf('base_') !== -1) {
            } else if (layers[j].id.indexOf(containitem) !== -1) {
              window.mapboxglMap.removeLayer(layers[j].id)
            }
          }
          // 清除sources
          for (var key2 in sources) {
            if (key2.indexOf('base_') !== -1) {
            } else if (key2.indexOf(containitem) !== -1) {
              window.mapboxglMap.removeSource(key2)
            }
          }
        }
      }
    },
  },
  computed: {
    unreadNum() {
      return this.unread.length;
    }
  },
  mounted() {

    mapboxgl.accessToken =
      "pk.eyJ1IjoieWFuZ3pob3VoYW8iLCJhIjoiY2ppbG9sMXJnMXc5YjNxbnhrOWl1bXppMyJ9.-JL3W32NYV_lHqsTUIGw9Q";
        //加载天地图底图
        //天地图（各个区域的token可以在网上查到）
        var vecUrl = "http://t0.tianditu.com/vec_w/wmts?tk="+window.tdtToken;     // 墨卡托
        var cvaUrl = "http://t0.tianditu.com/cva_w/wmts?tk="+window.tdtToken;     // 墨卡托  注记
        //使用严格模式
        "use strict";
        //实例化source对象
        var tdtVec = {
            //类型为栅格瓦片
            "type": "raster",
            'tiles': [
                //请求地址
                vecUrl + "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles" 
            ],
            //分辨率
            'tileSize': 256
        };
        var tdtCva = {           
            "type": "raster",
            'tiles': [               
                 cvaUrl + "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles" 
            ],            
            'tileSize': 256
        }; 
        //实例化Map地图对象
        this.map=new mapboxgl.Map({
            //地图容器div的id
            container: 'mapDiv', 
            style: {
                //设置版本号，一定要设置
                "version": 8,
                
                //添加来源
                "sources": {
                    "base_tdtVec": tdtVec,
                    "base_tdtCva": tdtCva
                },
                "layers": [
                     {
                         //图层id，要保证唯一性
                         "id": "base_tdtVec",
                         //图层类型
                         "type": "raster",
                         //数据源
                         "source": "base_tdtVec",
                         //图层最小缩放级数
                         "minzoom": 0,
                         //图层最大缩放级数
                         "maxzoom": 18
                     },
                     {
                         "id": "base_tdtCva",
                         "type": "raster",
                         "source": "base_tdtCva",
                         "minzoom": 0,
                         "maxzoom": 18
                     },
                    
                ],
            },
            //  pitchWithRotate:false,
            //  dragRotate:false,
    
             maxZoom:17,
            //地图中心点
            center: [113.679943564,22.559617265],
            //地图当前缩放级数
            zoom: 8 
        });
    
    window.mapboxglMap=this.map;
    // 比例尺
      var scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'imperial'
      });
      mapboxglMap.addControl(scale);
      scale.setUnit('metric');
      //级别
      mapboxglMap.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true
        }));
      // 鹰眼
      mapboxglMap.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));
    var nav = new mapboxgl.NavigationControl();
    mapboxglMap.addControl(nav, 'top-right');
      this.screenWidth = document.body.clientWidth;
      this.screenHeight = document.body.clientHeight;
      window.onresize = () => {
        return (() => {
          this.screenWidth = document.body.clientWidth;
          this.screenHeight = document.body.clientHeight;
          console.log(this.screenWidth,this.screenHeight);
        })();
      };
  },
  watch:{
    newgeojson:{
      handler: function (val, oldVal) {
        try{
           var json= JSON.parse(val);
           this.addGeoJson(json);
        }catch(e){
            console.log("请输入正确的geojson");
        }
          
      },
      deep: true,
      immediate: false
    },
     pointcolor:function(val,old){
       this.map.setPaintProperty('drawpointlayer', 'circle-color', val);
     },
      linecolor:function(val,old){

      },
      polygoncolor:function(val,old){
        this.map.setPaintProperty('drawpolygonlayer', 'fill-color', val);
      }

  }
};
</script>

<style>

.myMap {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  position: absolute;
  
}
#mapDiv {
  width: 100%;
  height: 100%;
}


.funcBtn {
  width: 400px;
  position: absolute;
  right: 10px;
  top: 20px;
  z-index: 20;
}
.funcBtn .itembtn {
    width:40px;
    height:40px;
  margin-top: 5px;
  margin-left: 5px;
  background:white;
}
</style>

