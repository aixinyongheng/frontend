<template>
  <div class="myMap" id="myMap">
    <!-- <div style="position:absolute;top:0px;left:0px;width:200px;height:100%;z-index:20;background:white">
        <el-tree
          :data="layerData"
          node-key="id"
          default-expand-all
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag">
        </el-tree>
    </div> -->
    <div id="mapDiv">
        <!-- <div class="funcBtn"> -->
            <!-- <i class="itembtn iconfont icon-tushuguan"  @click="toggleJsonEdit" title="显示geojson编辑器"></i>
             <i class="itembtn iconfont icon-tushuguan"  @click="addGoeJsonClick" title="加载矢量切片数据"></i>
              <i class="itembtn iconfont icon-tushuguan" @click="addWMTSClick" title="加载WMTS服务"></i>
             <i class="itembtn iconfont icon-tushuguan" @click="toggleLayer" title="显示隐藏geojosn"></i>
              <i class="itembtn iconfont icon-tushuguan" @click="addJhTest1" title="加载聚合图测试1"></i> -->
                <!-- <i class="itembtn iconfont icon-tushuguan" @click="addJhTest2" title="加载聚合图测试2"></i> -->
                 <!-- <i class="itembtn iconfont icon-tushuguan" @click="addAnimateImages" title="加载动画"></i> -->
            <!-- <div class="itembtn">
              样式修改测试<hr>
              <span class="demonstration">点</span>
              <el-color-picker @active-change="function(e){pointcolor=e}" show-alpha  v-model="pointcolor"></el-color-picker>
              <span class="demonstration">线</span>
               <el-color-picker show-alpha v-model="linecolor"></el-color-picker>
              <span class="demonstration">面</span>
               <el-color-picker @active-change="function(e){polygoncolor=e}" show-alpha v-model="polygoncolor"></el-color-picker>
            </div> -->
              <!-- <el-upload class="itembtn el-button" :action="uploadShp" :on-success="uploadShpSuccess">
                <div class="el-upload__text">
                  <em>添加shp(zip)</em>
                </div>
                <div class="el-upload__tip" slot="tip"></div>
              </el-upload>
              <FileUpload class="itembtn el-button" 
                    ref="fileuploadShp"
                    isMultiple="false"
                    labelname="上传数据（大文件）"
                    onlyid="fileinput666"
                    :fileUploadURL="uploadBigShp"
                    :histFileArr="[]"
                    @successvalue="successvalue"
                    @fileDelOper="fileDelOper"
               ></FileUpload> -->
               <!-- <div v-show="geojsonEditShow" style="width:500px;height:500px; position: absolute;;top:0px;right:150px;z-index:20">
               
          <el-input
            type="textarea"
            debounce="500"
            :rows="30"
            placeholder="请输入内容"
            v-model="newgeojson">
          </el-input>
            <el-button class="itembtn" slot="reference" @click="toggleJsonEdit">关闭</el-button>
             <el-button class="itembtn" slot="reference" @click="downloadToShp">转为shp</el-button>
      </div>
       -->
    <!-- </div>   -->
    <el-card  class="box-card" style="position:absolute;z-index:666;top:20px;transition: width 2s;">
      测试:<br>
        <el-button size="mini" @click="addThematicLayer">唯一值专题图测试</el-button>  
        <el-button size="mini" @click="addVectLayerTest">加载矢量mvt图层</el-button>
        <el-button size="mini" @click="addheatmap">加载热力图</el-button>
        <el-button size="mini" @click="addclusters">加载聚合图</el-button>
        <el-button size="mini" @click="addGoeJsonClick">加载geojson</el-button>
        level:{{mapzoom}}
       <!-- <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 40}"
          placeholder="请输入内容"
          v-model="textarea">
        </el-input> -->

        <!-- <div class="block">
            <span class="demonstration">默认</span>
            <el-date-picker
              v-model="mytime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
       </div>
       <el-input v-model="mytime"></el-input> -->


        {{messageTest}}
    </el-card>
 </div>
</div>
</template>

<script>
import FileUpload from "../components/bigfiles";
export default {
  name: "mainMap",
  components: {
    FileUpload
  },
  data() {
    return {
      message: "first",
      map: null,
      uploadShp: window.processServiceURL + "file/uploadShp",
      messageTest:'',
      mytime:'',
      geojsonEditShow:false,
      newgeojson:'',
      pointcolor:'rgba(255, 69, 0, 0.9)',
      linecolor:'rgba(255, 69, 0, 0.9)',
      polygoncolor:'rgba(255, 69, 0, 0.9)',
      layerData:null,
       //大文件shp路径
      uploadBigShp:window.processServiceURL+"file/uploadBigShp",
      mapzoom:5,
      // textarea:""
    };
  },
  methods: {
    addThematicLayer(){
      if(this.map.getLayer('thematicLayer')){
        this.map.removeLayer('thematicLayer');
      }
      if(this.map.getLayer('thematicLayer-borders')){
        this.map.removeLayer('thematicLayer-borders');
      }
        if(this.map.getLayer('thematic-ano')){
        this.map.removeLayer('thematic-ano');
      }
      if(this.map.getSource('thematicSource')){
          this.map.removeSource('thematicSource');
      }
    
      var expression = ['match', ['get', 'zxzt']];
      expression.push('0','#FF0000');
      expression.push('1','#00FF00');
      expression.push('2','#0000FF');
      expression.push('rgba(255,255,255,0)')
       this.map.addSource('thematicSource', { type: 'geojson', data: 'http://localhost:9010/qgzhdc/task/api/v1/getTaskListGeojson?code=110111' })
       this.map.addLayer(
          {
            'id': 'thematicLayer',
            'type': 'fill',
            'source': 'thematicSource',
            'paint': {
              'fill-color': expression,
             'fill-opacity':0.7
            }
          }
        )
       this.map.addLayer({
          'id': 'thematicLayer-borders',
          'type': 'line',
          'source': 'thematicSource',
          'layout': {},
          'paint': {
            'line-color': '#627BC1',
            'line-width': 1.5
          }
        })
        this.map.on('click','thematicLayer',e=>{
          this.messageTest=e.features[0].properties;
        });
      
    
        this.map.addLayer({
          'id': 'thematic-ano',
          'source': 'thematicSource',
          'type': 'symbol',
          'minzoom': 1,
          'maxzoom': 20,
          'layout': {
            'text-size': 9,
            'symbol-placement': 'point',
            'text-field': '{rwmc}-{cjrid}',
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top'
          }
        })


    },
    toggleJsonEdit(){
       this.geojsonEditShow=!this.geojsonEditShow;
    },
    //加载geojson文件
    addGoeJsonClick() {
        //this.addGeoJson("http://172.16.106.5:8083/tdt_xz/resources/shpJsonFile/hyd_1572578137027.json");//240Mgeojson不行
        //this.addGeoJson("http://172.16.106.5:8083/tdt_xz/resources/shpJsonFile/hyd_new_1572579759634.json");//17Mshp  
       // this.addGeoJson("http://172.16.106.5:8083/tdt_xz/resources/shpJsonFile/hyd_new2_1572584793269.json"); //71Mshp   119M geojson
       // this.addGeoJson("http://172.16.104.140:8079/tdt-xz/resources/shpJsonFile/%E5%BB%BA%E7%AD%91%E7%89%A9_1594975140587.json");
       // this.addGeoJson("http://localhost:8082/tdt_xz/resources/shpJsonFile/BUIA.json");
         this.addGeoJson("http://localhost:8082/tdt_xz/resources/shpJsonFile/shp2json_1599541869344.json");
       
        // this.addGeoJson("http://172.16.104.140:8079/tdt-xz/resources/shpJsonFile/%E5%BB%BA%E7%AD%91%E7%89%A9_1599530937948.json")
    },
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
    // add raster
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
    // add vectlayer
    addVectLayerTest(){
      if(this.map.getLayer('drawpointlayer')){
        this.map.removeLayer('drawpointlayer');
      }
      if(this.map.getSource('national-park')){
          this.map.removeSource('national-park');
      }
      this.map.addSource("national-park", {
          type: "vector",
            // tiles: ['https://qgzhdc.geo-compass.com/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=0&tablename=&cjrid=3669&dwmc=&yhlx=0&sfdw=&shzt=&queryCode=&hczt=&gids=&querytype=2&pid=&tag=2'],
            //tiles: ['http://172.16.100.156:9005/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=110111&cjrid=10507&yhlx=1&pid=10507&tag=2'],
            // tiles: ['http://172.16.100.156:9005/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=0'],
            // tiles: ['http://172.16.106.5:9005/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=0'],
            // tiles: ['http://172.16.106.5:9005/qgzhdc/dataManage/api/v1/queryListSjsbCommonMvt/{z}/{x}/{y}.mvt?code=0'],
             tiles: ['http://172.16.106.5:7001/queryMvt/{z}/{x}/{y}.mvt?code=0&tablename=geo_xian,geo_road,geo_lake'],
      });
       this.map.addSource("clickSource", {
          type: "geojson",
          data:{"type":"Polygon","coordinates":[[[111.23382568359375,33.79969117325108],[111.3134765625,33.77686437792359],[111.346435546875,33.77001515278013],[111.38763427734375,33.749464192325775],[111.42059326171875,33.726624014010284],[111.45904541015625,33.71748624018193],[111.500244140625,33.72890830547334],[111.533203125,33.73576081504463],[111.566162109375,33.72890830547334],[111.64581298828125,33.70377775573253],[111.676025390625,33.68549637289138],[111.71173095703125,33.67178278364436],[111.7474365234375,33.66721110119755],[111.785888671875,33.64434904445888],[111.807861328125,33.59403114663236],[111.81060791015625,33.53681606773303],[111.8023681640625,33.50704924881552],[111.76116943359375,33.50017852824229],[111.71722412109375,33.50475906922608],[111.67877197265625,33.488726115350275],[111.6595458984375,33.465816745730024],[111.62109375,33.470399104258505],[111.58538818359375,33.45894275368764],[111.58538818359375,33.42685691828501],[111.6046142578125,33.39017286472249],[111.6265869140625,33.362649660256636],[111.6705322265625,33.35806161277887],[111.7034912109375,33.33282302850358],[111.7144775390625,33.280027811732154],[111.73919677734375,33.206520451760625],[111.75018310546875,33.15364887320581],[111.74468994140625,33.12375082971022],[111.70623779296875,33.10994829789429],[111.65679931640625,33.09844453136719],[111.6156005859375,33.10304621868762],[111.5716552734375,33.09844453136719],[111.55517578125,33.13065128220441],[111.55517578125,33.16514540824029],[111.5386962890625,33.199625968296345],[111.49749755859375,33.208818492255475],[111.4508056640625,33.20422235093439],[111.40960693359375,33.215712251730736],[111.37115478515625,33.27543541298162],[111.3409423828125,33.286915956862074],[111.214599609375,33.28461996888768],[111.17889404296875,33.289211884431424],[111.11572265625,33.33741240611175],[111.08001708984375,33.34200154191562],[111.00860595703125,33.33282302850358],[111.01409912109375,33.34659043589842],[111.01959228515625,33.408516828002675],[111.0113525390625,33.495597744865705],[111.0003662109375,33.53452667616054],[110.9783935546875,33.552840110956154],[111.04705810546875,33.557417863242165],[111.09649658203125,33.568861182555565],[111.1212158203125,33.59174327144986],[111.1376953125,33.61690656060317],[111.1322021484375,33.651208299204995],[111.1322021484375,33.68321092658006],[111.1761474609375,33.69006708322202],[111.181640625,33.7197707748314],[111.17889404296875,33.75631505992706],[111.18988037109375,33.78599582629231],[111.23382568359375,33.79969117325108]]]}
      });
   
    
        this.map.addLayer({
                id: "drawpointlayer",
                type: "circle",
                layout: {
                    'visibility': 'visible',
                },
                      source: "national-park",
                      "source-layer":"mvt",
                      paint: {
                        "circle-radius": 3,
                        "circle-color": "#B42222"
                      },
                      filter: ["==", "$type", "Point"],
                
                    // layout: {
                    //     visibility: visible ? 'visible' : 'none'
                    // },
                    // minzoom:4,
                    // maxzoom
                });
        var popup = new mapboxgl.Popup(  {
            closeButton: false,
            closeOnClick: false
        });
        var _this=this;
        this.map.on('mouseenter', 'drawpointlayer', function(e) {
            // this.map.getCanvas().style.cursor = 'pointer';
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.dwmc;
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
          popup
          .setLngLat(coordinates)
          .setHTML(`<div style='color:green;'>${description}</div>`)
          .addTo(_this.map);
          });
             var _this=this;
        this.map.on('click', 'drawpointlayer', function(e) {
            // this.map.getCanvas().style.cursor = 'pointer';
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.dwmc;
            alert(`<div style='color:green;'>${description}</div>`)
         
          });
        this.map.on('mouseleave', 'drawpointlayer', function() {
            popup.remove();
        });
        this.map.addLayer({
          id: "drawXianlayer",
          layout: {
            'visibility': 'visible'
          },
          type: "fill",
          source: "national-park",
          "source-layer":"geo_xian",
          paint: {
            "fill-color": "#F5F4EE",
            "fill-outline-color": "#3bb2d0",
            "fill-opacity": 1
          },
          filter: ["==", "$type", "Polygon"]
        });
        this.map.addLayer({
          id: "drawLakelayer",
          layout: {
            'visibility': 'visible'
          },
          type: "fill",
          source: "national-park",
          "source-layer":"geo_lake",
          paint: {
            "fill-color": "#ABC6EF",
            "fill-outline-color": "#3bb2d0",
            "fill-opacity": 0.6
          },
          filter: ["==", "$type", "Polygon"]
        });
        this.map.addLayer({
          id: "drawRoadlayer",
          type: "line",
          source: "national-park",
          "source-layer":"geo_road",
          layout: {
            'visibility': 'visible'
          },
          paint: {
            "line-width": 2,
            "line-color": "#DAC9F0",
            "line-opacity": 1
          },
          filter: ["==", "$type", "LineString"]
        });
        this.map.on('click', 'drawpointlayer', function(e) {
              // this.map.getCanvas().style.cursor = 'pointer';
              var coordinates = e.features[0].geometry.coordinates.slice();
              var description = e.features[0].properties.dwmc;
              alert(`<div style='color:green;'>${description}</div>`)
        });
        var _this=this;
        this.map.on('click', 'drawXianlayer', function(e) {
           // 选中高亮
            _this.map.getSource('clickSource').setData(e.features[0].geometry);
       });
         // 选中高亮图层
         this.map.addLayer({
          id: "drawClick",
          layout: {
            'visibility': 'visible'
          },
          type: "fill",
          source: "clickSource",
          paint: {
            "fill-color": "#ff0000",
            "fill-outline-color": "#3bb2d0",
            "fill-opacity": 1
          },
          filter: ["==", "$type", "Polygon"]
        });
    },
    // 添加热力图
    addheatmap(){
                  //  var datajson=require('../../../assets/xian.json');
                  //  this.addGeoJson(datajson)

      if(this.map.getSource('national-park')){
          // this.map.removeSource('national-park');
      }else{
          this.map.addSource("national-park", {
             type: "vector",
                      // tiles: ['http://vecpt8.geo-compass.com/api/v1/map/srcmvt/{z}/{x}/{y}.mvt?sid=11001001468'],
             tiles: ['http://172.16.100.156:9005/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=0'],
          });
      }
          this.map.addLayer({
                  id: 'trees-heat',
                  type: 'heatmap',
                  source: "national-park",
                  "source-layer":"mvt",
                  maxzoom: 15,
            // paint: {
            //   // increase weight as diameter breast height increases
            //   'heatmap-weight': {
            //     property: 'dwmc',
            //     type: 'exponential',
            //     stops: [
            //       [1, 0],
            //       [1000, 1]
            //     ]
            //   },
            //   // increase intensity as zoom level increases
            //   'heatmap-intensity': {
            //     stops: [
            //       [11, 1],
            //       [15, 3]
            //     ]
            //   },
            //   // assign color values be applied to points depending on their density
            //   'heatmap-color': [
            //     'interpolate',
            //     ['linear'],
            //     ['heatmap-density'],
            //     0, 'rgba(255,0,0,0)',
            //     0.2, 'rgb(0,0,255)',
            //     0.4, 'rgb(0,255,0)',
            //     0.6, 'rgb(255,255,0)',
            //     0.8, 'rgb(255,0,0)'
            //   ],
            //   // increase radius as zoom increases
            //   // 'heatmap-radius': {
            //   //   stops: [
            //   //     [11, 15],
            //   //     [15, 20]
            //   //   ]
            //   // },
            //   'heatmap-radius': [
            //       'interpolate', ['linear'], ['zoom'],
            //       // zoom is 5 (or less) -> circle radius will be 1px
            //       5, 10,
            //       // zoom is 10 (or greater) -> circle radius will be 5px
            //       8, 20
            //   ],
            //   // decrease opacity to transition into the circle layer
            //   'heatmap-opacity': {
            //     default: 1,
            //     stops: [
            //       [14, 1],
            //       [15, 0]
            //     ]
            //   },
            
            
            // }
                  paint:{
                      "heatmap-radius": [
                       'interpolate', ['linear'], ['zoom'],
                              // zoom is 5 (or less) -> circle radius will be 1px
                              5, 10,
                              // zoom is 10 (or greater) -> circle radius will be 5px
                              8, 20
                            ],
                            "heatmap-weight": 1,
                            "heatmap-intensity": 1,
                            "heatmap-color": [
                              "interpolate",
                              ["linear"],
                              ["heatmap-density"],
                              0,
                              "rgba(33,102,172,0)",
                              0.1,
                              "#4169e1",
                              0.3,
                              "#00ffff",
                              0.5,
                              "#00ff00",
                              0.7,
                              "#ffff00",
                              1,
                              "#ff0000"
                            ],
                            "heatmap-opacity": 1
                          }
              });
                        var _this=this;
                        // inspect a cluster on click
                        this.map.on('click', 'clusters', function(e) {
                        var features = _this.map.queryRenderedFeatures(e.point, {
                            layers: ['clusters']
                        });
                        var clusterId = features[0].properties.cluster_id;
                        _this.map.getSource('national-park').getClusterExpansionZoom(
                        clusterId,
                        function(err, zoom) {
                        if (err) return;
                        
                        _this.map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                        });
                        }
                        );
                        });
          
          // When a click event occurs on a feature in
          // the unclustered-point layer, open a popup at
          // the location of the feature, with
          // description HTML from its properties.
                this.map.on('click', 'unclustered-point', function(e) {
                var coordinates = e.features[0].geometry.coordinates.slice();
                var mag = e.features[0].properties.dwmc;
                var tsunami;
                
                if (e.features[0].properties.dwmc === 1) {
                tsunami = 'yes';
                } else {
                tsunami = 'no';
                }
 
                // Ensure that if the map is zoomed out such that
                // multiple copies of the feature are visible, the
                // popup appears over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                
                new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(
                'magnitude: ' + mag + '<br>Was there a tsunami?: ' + tsunami
                )
                .addTo(_this.map);
                });
 





                  //  if (this.map.getLayer("clusters")) this.map.removeLayer("clusters");
                  //   if (this.map.getLayer("cluster-count")) this.map.removeLayer("cluster-count");
                  //   if (this.map.getLayer("unclustered-point")) this.map.removeLayer("unclustered-point");
                  //   if(this.map.getSource("clusterSource"))this.map.removeSource("clusterSource");

                  //   this.map.addSource("clusterSource", {
                  //     type: "geojson",
                  //     data:datajson,
                  //     cluster: true,
                  //     clusterMaxZoom: 14, // Max zoom to cluster points on
                  //     clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                  // });
            //   var color = [
            //           "#007cbf",
            //           "#24A9F4",
            //           "#B0C54E",
            //           "#24A9F4",
            //           "#EF6234",
            //           "#43B079",
            //           "#E0C542",
            //           "#2556FB"
            //     ];
            // var radius = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
            //        this.map.addLayer({
            //         id: "clusters",
            //         type: "circle",
            //         source: "national-park",
            //        "source-layer":"mvt",
            //         // filter: ["has", "dwmc"],
            //         paint: {
            //            "circle-color": [
            //                   "step",
            //                   ["get", "point_count"],
            //                   "#007cbf",
            //                   10,
            //                   "#f1f075",
            //                   20,
            //                   "#f28cb1"
            //               ],
            //               "circle-radius": [
            //                   "step",
            //                   ["get", "point_count"],
            //                   20,
            //                   100,
            //                   30,
            //                   750,
            //                   40
            //               ]
            //         }
            //       });


              //                   var paint = {
              //       'text-color': 'rgb(250,0,0)',
              //       'text-halo-color': 'rgb(255,255,255)',
              //       'text-halo-width': 1.5,
              //       'text-halo-blur': 1
              //     }
              // this.map.addLayer({
              //       'id': 'thematic_countryPolygonlayer-ano',
              //       'source': 'national-park',
              //       'source-layer':'mvt',
              //       'type': 'symbol',
              //       'minzoom': 0,
              //       'maxzoom': 20,
              //       'layout': {
              //         'text-size': 12,
              //         //   'text-font': [
              //         //     'STXinwei Regular'
              //         //   ],
              //         'symbol-placement': 'point',
              //         'text-field': '{dwmc}',
              //         'text-max-width': 8
              //       },
              //        'paint': paint
              //     })
                              
                              // this.map.addLayer({
                              //   id: "cluster-count",
                              //   type: "symbol",
                              //   source: "national-park",
                              //   "source-layer":"mvt",
                              //   //filter: ["has", "countTotal"],
                              //   layout: {
                              //     "text-field": "{dwmc}",
                              //     "text-font": [
                              //       "DIN Offc Pro Medium",
                              //       "Arial Unicode MS Bold"
                              //     ],
                              //     "text-size": 12
                              //   },
                              //   paint: {
                              //     "text-color": "#f00"
                              //   }
                              // });





                              // this.map.addLayer({
                              //     id: "clusters",
                              //     type: "circle",
                              //     source: "clusterSource",
                              //     filter: ["has", "point_count"],
                              //     paint: {
                              //         // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                              //         // with three steps to implement three types of circles:
                              //         //   * Blue, 20px circles when point count is less than 100
                              //         //   * Yellow, 30px circles when point count is between 100 and 750
                              //         //   * Pink, 40px circles when point count is greater than or equal to 750
                              //         "circle-color": [
                              //             "step",
                              //             ["get", "point_count"],
                              //             "#51bbd6",
                              //             10,
                              //             "#f1f075",
                              //             20,
                              //             "#f28cb1"
                              //         ],
                              //         "circle-radius": [
                              //             "step",
                              //             ["get", "point_count"],
                              //             20,
                              //             100,
                              //             30,
                              //             750,
                              //             40
                              //         ]
                              //     }
                              // });

                              // this.map.addLayer({
                              //     id: "cluster-count",
                              //     type: "symbol",
                              //     source: "clusterSource",
                              //     filter: ["has", "point_count"],
                              //     layout: {
                              //         "text-field": "{point_count_abbreviated}",
                              //         "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                              //         "text-size": 12
                              //     }
                              // });

                              // this.map.addLayer({
                              //     id: "unclustered-point",
                              //     type: "circle",
                              //     source: "clusterSource",
                              //     filter: ["!", ["has", "point_count"]],
                              //     paint: {
                              //         "circle-color": "#11b4da",
                              //         "circle-radius": 4,
                              //         "circle-stroke-width": 1,
                              //         "circle-stroke-color": "#fff"
                              //     }
                              // });

                              // // inspect a cluster on click
                              // this.map.on('click', 'clusters', function (e) {
                              //     var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                              //     var clusterId = features[0].properties.cluster_id;
                              //     map.getSource('clusterSource').getClusterExpansionZoom(clusterId, function (err, zoom) {
                              //         if (err)
                              //             return;

                              //         map.easeTo({
                              //             center: features[0].geometry.coordinates,
                              //             zoom: zoom
                              //         });
                              //     });
                              // });
                              // this.map.on('mouseenter', 'clusters', function () {
                              //     map.getCanvas().style.cursor = 'pointer';
                              // });
                              // this.map.on('mouseleave', 'clusters', function () {
                              //     map.getCanvas().style.cursor = '';
                              // });
    },
    // 添加聚合图
    addClustersLayer(){
      if(this.map.getLayer('drawpointlayer')){
        this.map.removeLayer('drawpointlayer');
      }
      if(this.map.getSource('national-park')){
          this.map.removeSource('national-park');
      }
      this.map.addSource("national-park", {
          cluster: false,  // 是否避让
          // type: "vector",
          //   // tiles: ['http://vecpt8.geo-compass.com/api/v1/map/srcmvt/{z}/{x}/{y}.mvt?sid=11001001468'],
          //   tiles: ['https://qgzhdc.geo-compass.com/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=0'],
          // tiles: ['http://172.16.100.156:9005/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=0'],
          // tiles: ['http://172.16.106.5:9005/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=0'],
          // tiles: ['http://172.16.106.5:9005/qgzhdc/dataManage/api/v1/queryListSjsbCommonMvt/{z}/{x}/{y}.mvt?code=0'],
          type:'geojson',
          // data:'http://localhost:9007/qgzhdc/statistics/api/v1/cluster/statisticClusterGeojson?level=1&tag=2&yhjb=null&querycode='
          data:'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
     });
     this.map.addLayer({
                id: "clusters",
                type: "circle",
                source: "national-park",
                filter: ["has", "count"],
                paint: {
              // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
              // with three steps to implement three types of circles:
              //   * Blue, 20px circles when point count is less than 100
              //   * Yellow, 30px circles when point count is between 100 and 750
              //   * Pink, 40px circles when point count is greater than or equal to 750
              "circle-color": [
                  "step",
                  ["get", "count"],
                  "#51bbd6",
                  100,
                  "#f1f075",
                  750,
                  "#f28cb1"
              ],
              "circle-radius": [
                  "step",
                  ["get", "count"],
                  20,
                  100,
                  30,
                  750,
                  40
              ]
          }
      });
     // 添加数字图层
     this.map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "national-park",
        filter: ["has", "count"],
        layout: {
            "text-field": "{count}",
            // "text-font": ["Simsun (Founder Extended) Regular"],
            // "text-font": ["SimHeiRegular"],
            "text-size": 12
        }
    });
    },
    addclusters(){
           this.map.addSource('earthquakes', {
                  type: 'geojson',
                  // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
                  // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                  data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
                  cluster: false,
                  clusterMaxZoom: 14, // Max zoom to cluster points on
                  clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                  });
            this.map.addLayer({
                      id: 'clusters',
                      type: 'circle',
                      source: 'earthquakes',
                      filter: ['has', 'point_count'],
                      paint: {
                      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                      // with three steps to implement three types of circles:
                      //   * Blue, 20px circles when point count is less than 100
                      //   * Yellow, 30px circles when point count is between 100 and 750
                      //   * Pink, 40px circles when point count is greater than or equal to 750
                      'circle-color': [
                      'step',
                      ['get', 'point_count'],
                      '#51bbd6',
                      100,
                      '#f1f075',
                      750,
                      '#f28cb1'
                      ],
                      'circle-radius': [
                      'step',
                      ['get', 'point_count'],
                      20,
                      100,
                      30,
                      750,
                      40
                      ]
                      }
                      });
 
                  this.map.addLayer({
                  id: 'cluster-count',
                  type: 'symbol',
                  source: 'earthquakes',
                  filter: ['has', 'point_count'],
                  layout: {
                  'text-field': '{point_count}',
                  'text-font': ['SimHeiRegular'],
                  'text-size': 12
                  }
                  });
                    
                    this.map.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'earthquakes',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                    'circle-color': '#11b4da',
                    'circle-radius': 4,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff'
                    }
             });
    },
    toggleLayer() {
      console.log(this.map.getSource("national-park"));
      this.map.setPaintProperty('drawpolygonlayer', 'fill-color', '#faafee');
     //this.toggleLayerGroup("park-boundary");
    },
    //上传成功事件
    uploadShpSuccess(res) {
      let data=JSON.parse(res.data)
      let json=JSON.parse(data.geojson);
      this.geojsonEditShow=true;
      this.newgeojson=data.geojson//触发加载geojson事件
    },
    addGeoJson(json) {
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
      this.map.on("click","drawpolygonlayer",function(data){
        alert(JSON.stringify(data.features[0]));
        console.log(data.features);
      });
    },
    toggleLayerGroup(id){
        var visibility = this.map.getLayoutProperty(id,"visibility"
        );
          if (visibility === "visible") {
        this.map.setLayoutProperty(id, "visibility", "none");
        } else {
        this.map.setLayoutProperty(id, "visibility", "visible");
        }

    },
    downloadToShp(){  
    },
    //大文件上传回调函数
    successvalue(value){
      let status = false;
      this.histFileArr.forEach(element => {
        if (element.WDMC == value.WDMC) status = true;
      });
      if (!status) {
        this.histFileArr.push({
          WDMC: value.WDMC,
          WJLJ: value.WJLJ,
          CJSJ: this.formatTime(new Date())
        });
        console.log("文件上传成功：" + this.histFileArr);
      }
    },
    fileDelOper() {
      this.histFileArr = val;
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


    }
  },
  computed: {
    unreadNum() {
      return this.unread.length;
    }
  },
  mounted() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoieWFuZ3pob3VoYW8iLCJhIjoiY2ppbG9sMXJnMXc5YjNxbnhrOWl1bXppMyJ9.-JL3W32NYV_lHqsTUIGw9Q";
        // 加载天地图底图
        // 天地图（各个区域的token可以在网上查到）
        var vecUrl = "http://t0.tianditu.com/vec_w/wmts?tk="+window.tdtToken;
        var cvaUrl = "http://t0.tianditu.com/cva_w/wmts?tk="+window.tdtToken;     //注记
      
        //vecUrl=`http://t0.tianditu.com/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${window.tdtToken}`;
        //使用严格模式
        // "use strict";
        //实例化source对象
//         vecUrl=`
// http://xizang.tianditu.gov.cn:81/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=00a9eefd8372800ea54252be21308ee3
// `    ;
    var tdtVec = {
            //类型为栅格瓦片
            "type": "raster",
            'tiles': [
                //请求地址
                vecUrl 
                 + "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles" 
            ],
            // 'tiles': [
            //     //请求地址
            //     vecUrl  
            // ],
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
                    "tdtVec": tdtVec,
                    "tdtCva": tdtCva
                },
                  //'glyphs': 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
                 //'glyphs': '/static/fonts/{fontstack}/{range}.pbf',
                //'glyphs':'http://jydtn-geoc_map.geo-compass.com/api/v1/font/11001000031/{fontstack}/{range}.pbf',
                'glyphs':'http://39.105.87.199:8082/fonts/mapboxFonts/{fontstack}/{range}.pbf',
                "layers": [
                     {
                         //图层id，要保证唯一性
                         "id": "tdtVec",
                         //图层类型
                         "type": "raster",
                         //数据源
                         "source": "tdtVec",
                         //图层最小缩放级数
                         "minzoom": 0,
                         //图层最大缩放级数
                         "maxzoom": 17
                     },
                     {
                         "id": "tdtCva",
                         "type": "raster",
                         "source": "tdtCva",
                         "minzoom": 0,
                         "maxzoom": 17
                     }
                ],
               
            },
             minZoom:1,
            //地图中心点
            center: [114,32],
            //地图当前缩放级数
            zoom: this.mapzoom
        });
        // 添加控件
        var nav = new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true
        });
       // 图层切换组件
       // var home = new HomeControl({ center: [98, 37], zoom: 3 });
       // map.homecontrol = home;
       this.map.addControl(nav, "bottom-right"); //放大缩小控件
       // map.addControl(home, "bottom-right"); //homeControl
       this.map.on("load",()=>{
          //this.addclusters();
        })
        let _this=this;
        this.map.on("zoom",()=>{
          _this.mapzoom= _this.map.getZoom(); 
        })
          // window.map=this.map;
          // this.newgeojson='{"features":[{"geometry":{"type":"MultiLineString","coordinates":[[[111.4342,40.9371],[114.8619,40.9039]]]},"id":"LineString-shape.1","type":"Feature","properties":{}},{"geometry":{"type":"Point","coordinates":[113.0162,41.6306]},"id":"Point-shape.1","type":"Feature","properties":{}},{"geometry":{"type":"Point","coordinates":[121.5855,45.2041]},"id":"Point-shape.2","type":"Feature","properties":{}},{"geometry":{"type":"Point","coordinates":[116.1803,40.0684]},"id":"Point-shape.3","type":"Feature","properties":{}},{"geometry":{"type":"MultiPolygon","coordinates":[[[[112.4889,40.4707],[114.6861,39.4264],[113.983,39.2224],[111.2584,39.2224],[112.4889,40.4707]]]]},"id":"Polygon-shape.1","type":"Feature","properties":{}}],"type":"FeatureCollection"}';
          // var draw = new MapboxDraw({
          //       displayControlsDefault: false,
          //       controls: {
          //       polygon: true,
          //       trash: true
          //   }
          // });
          // this.map.addControl(draw);
          // this.map.on('draw.create', updateArea);
          // this.map.on('draw.delete', updateArea);
          // this.map.on('draw.update', updateArea);

          //   function updateArea(e) {
          //         var data = draw.getAll();
          //         console.log("draw.getAll",data);
          //         if (data.features.length > 0) {
          //           var area = turf.area(data);
          //           // restrict to area to 2 decimal points
          //           var rounded_area = Math.round(area*100)/100;
          //           console.log("area:",area);
          //         } else {
          //         if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
          //       }
          //   }

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
.content {
  position: relative;
}
.myMap {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  position: relative;
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

