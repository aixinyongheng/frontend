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
       <el-input
  type="textarea"
  :autosize="{ minRows: 2, maxRows: 40}"
  placeholder="请输入内容"
  v-model="textarea">
</el-input>

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
      textarea:""
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
        this.addGeoJson("http://172.16.104.140:8079/tdt-xz/resources/shpJsonFile/%E5%BB%BA%E7%AD%91%E7%89%A9_1594975140587.json");
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
             tiles: ['https://qgzhdc.geo-compass.com/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=0&tablename=&cjrid=3669&dwmc=&yhlx=0&sfdw=&shzt=&queryCode=&hczt=&gids=&querytype=2&pid=&tag=2'],
            //tiles: ['http://172.16.100.156:9005/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=110111&cjrid=10507&yhlx=1&pid=10507&tag=2'],
            // tiles: ['http://172.16.100.156:9005/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=0'],
            // tiles: ['http://172.16.106.5:9005/qgzhdc/dataManage/api/v1/queryListCommonMvt/{z}/{x}/{y}.mvt?code=0'],
            // tiles: ['http://172.16.106.5:9005/qgzhdc/dataManage/api/v1/queryListSjsbCommonMvt/{z}/{x}/{y}.mvt?code=0'],
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
            paint: {
              // increase weight as diameter breast height increases
              'heatmap-weight': {
                property: 'dwmc',
                type: 'exponential',
                stops: [
                  [1, 0],
                  [1000, 1]
                ]
              },
              // increase intensity as zoom level increases
              'heatmap-intensity': {
                stops: [
                  [11, 1],
                  [15, 3]
                ]
              },
              // assign color values be applied to points depending on their density
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(255,0,0,0)',
                0.2, 'rgb(0,0,255)',
                0.4, 'rgb(0,255,0)',
                0.6, 'rgb(255,255,0)',
                0.8, 'rgb(255,0,0)'
              ],
              // increase radius as zoom increases
              'heatmap-radius': {
                stops: [
                  [11, 15],
                  [15, 20]
                ]
              },
              // decrease opacity to transition into the circle layer
              'heatmap-opacity': {
                default: 1,
                stops: [
                  [14, 1],
                  [15, 0]
                ]
              },
            }
          });

      
                      // 聚合效果
                      //           this.map.addLayer({
                      //             id: 'clusters',
                      //             type: 'circle',
                      //             source: 'national-park',
                      //             "source-layer":"mvt",
                      //             filter: ['has', 'point_count'],
                      //             paint: {
                      //             // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                      //             // with three steps to implement three types of circles:
                      //             //   * Blue, 20px circles when point count is less than 100
                      //             //   * Yellow, 30px circles when point count is between 100 and 750
                      //             //   * Pink, 40px circles when point count is greater than or equal to 750
                      //             'circle-color': [
                      //             'step',
                      //             ['get', 'point_count'],
                      //             '#51bbd6',
                      //             10,
                      //             '#f1f075',
                      //             100,
                      //             '#f28cb1'
                      //             ],
                      //             'circle-radius': [
                      //             'step',
                      //             ['get', 'point_count'],
                      //             20,
                      //             100,
                      //             30,
                      //             750,
                      //             40
                      //             ]
                      //             }
                      //             });
          
                      // this.map.addLayer({
                      //   id: 'cluster-count',
                      //   type: 'symbol',
                      //   source: 'national-park',
                      //   "source-layer":"mvt",
                      //   filter: ['has', 'point_count'],
                      //   layout: {
                      //   // 'text-field': '{id}',
                      //   // 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                      //   'text-size': 12
                      //   }
                      // });
                      
                      // this.map.addLayer({
                      // id: 'unclustered-point',
                      // type: 'circle',
                      // source: 'national-park',
                      // "source-layer":"mvt",
                      // filter: ['!', ['has', 'point_count']],
                      // paint: {
                      // 'circle-color': '#ff0000',
                      // 'circle-radius': 4,
                      // 'circle-stroke-width': 1,
                      // 'circle-stroke-color': '#fff'
                      // }
                      // });

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
            //  "text-font": ["Simsun (Founder Extended) Regular"],
          //  "text-font": ["SimHeiRegular"],
             
            "text-size": 12
        }
    });
      
    
    },
    addclusters(){
                 this.map.addSource('earthquakes', {
                                    type: 'geojson',
                                    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
                                    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                                    data:
                                    'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
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
        var tdtVec = {
            //类型为栅格瓦片
            "type": "raster",
            'tiles': [
                //请求地址
                vecUrl + "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles" 
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
             minZoom:5,
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



const updateSqlArr=`COMMENT ON COLUMN "public"."config_table_info"."qcqsjb" IS '（省1 市2 县（县以上）3 ）';

COMMENT ON COLUMN "public"."config_table_info"."pcqsjb" IS '（省1 市2 县 （县以上）3 ）';

ALTER TABLE "public"."config_table_info" ADD COLUMN "sfcm" int2 DEFAULT 1;

COMMENT ON COLUMN "public"."config_table_info"."sfcm" IS '是否采面';

ALTER TABLE "public"."config_table_info" ADD COLUMN "sfcd" int2 DEFAULT 1;

COMMENT ON COLUMN "public"."config_table_info"."sfcd" IS '是否采点';

ALTER TABLE "public"."config_table_info" DROP COLUMN "11_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "12_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "21_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "22_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "23_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "31_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "32_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "33_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "41_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "42_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "43_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "51_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "52_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "53_qc";

ALTER TABLE "public"."config_table_info" DROP COLUMN "sctjsj";

ALTER TABLE "public"."config_table_info" DROP COLUMN "yztjbtzd_pc";

CREATE TABLE "public"."data_jbxx" (
  "id" int4 ,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default",
  "sjly" int4,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int4,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default",
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6),
  "hczt" int2,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2,
  "cybmpy" int4,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default",
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
;

ALTER TABLE "public"."data_jbxx" OWNER TO "postgres";

COMMENT ON COLUMN "public"."data_jbxx"."id" IS '数据id';

COMMENT ON COLUMN "public"."data_jbxx"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."data_jbxx"."jgbm" IS '统一社会信用代码/机构编码';

COMMENT ON COLUMN "public"."data_jbxx"."shzt" IS '审核状态  1已通过、2待通过、3被驳回、 4填报';

COMMENT ON COLUMN "public"."data_jbxx"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."data_jbxx"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."data_jbxx"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."data_jbxx"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."data_jbxx"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."data_jbxx"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."data_jbxx"."code" IS '代码';

COMMENT ON COLUMN "public"."data_jbxx"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."data_jbxx"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."data_jbxx"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."data_jbxx"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."data_jbxx"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."data_jbxx"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."data_jbxx"."address" IS '单位地址';

COMMENT ON COLUMN "public"."data_jbxx"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."data_jbxx"."dmlx" IS '代码类型';

COMMENT ON COLUMN "public"."data_jbxx"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."data_jbxx"."shztpc" IS '审核状态（1已通过、2待通过、3被驳回、 4填报）默认1';

COMMENT ON COLUMN "public"."data_jbxx"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."data_jbxx"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."data_jbxx"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."data_jbxx"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."data_jbxx"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."data_jbxx"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."data_jbxx"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."data_jbxx"."hczt" IS '核查状态[0:未核查；1：已核查；2：待审核（app已提交);3:已通过；4:驳回]';

COMMENT ON COLUMN "public"."data_jbxx"."csshjbqc" IS '初始审核级别清查';

COMMENT ON COLUMN "public"."data_jbxx"."csshjbpc" IS '初始审核级别普查';

COMMENT ON COLUMN "public"."data_jbxx"."xtbs" IS '系统标识[1:清查（默认）;2:普查]';

COMMENT ON COLUMN "public"."data_jbxx"."cybmpy" IS '参与部门批阅 （2省未批3市未批 默认）';

COMMENT ON COLUMN "public"."data_jbxx"."shyj_wyhc" IS '审核意见';

COMMENT ON COLUMN "public"."data_jbxx"."bjsm_wyhc" IS '标记说明';

COMMENT ON COLUMN "public"."data_jbxx"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON TABLE "public"."data_jbxx" IS '数据-公共服务设施-基本信息';

CREATE TABLE "public"."data_jbxx_fc" (
  "id" int4 ,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default",
  "sjly" int4,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int4,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default",
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6),
  "hczt" int2,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2,
  "cybmpy" int4,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "fcsj" timestamp(6) DEFAULT now(),
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
;

ALTER TABLE "public"."data_jbxx_fc" OWNER TO "postgres";

COMMENT ON COLUMN "public"."data_jbxx_fc"."id" IS '数据id';

COMMENT ON COLUMN "public"."data_jbxx_fc"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."data_jbxx_fc"."jgbm" IS '统一社会信用代码/机构编码';

COMMENT ON COLUMN "public"."data_jbxx_fc"."shzt" IS '审核状态';

COMMENT ON COLUMN "public"."data_jbxx_fc"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."data_jbxx_fc"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."data_jbxx_fc"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."data_jbxx_fc"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."data_jbxx_fc"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."data_jbxx_fc"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."data_jbxx_fc"."code" IS '代码';

COMMENT ON COLUMN "public"."data_jbxx_fc"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."data_jbxx_fc"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."data_jbxx_fc"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."data_jbxx_fc"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."data_jbxx_fc"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."data_jbxx_fc"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."data_jbxx_fc"."address" IS '单位地址';

COMMENT ON COLUMN "public"."data_jbxx_fc"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."data_jbxx_fc"."dmlx" IS '代码类型';

COMMENT ON COLUMN "public"."data_jbxx_fc"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."data_jbxx_fc"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."data_jbxx_fc"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."data_jbxx_fc"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."data_jbxx_fc"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."data_jbxx_fc"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."data_jbxx_fc"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."data_jbxx_fc"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."data_jbxx_fc"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."data_jbxx_fc"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."data_jbxx_fc"."csshjbqc" IS '初始审核级别清查';

COMMENT ON COLUMN "public"."data_jbxx_fc"."csshjbpc" IS '初始审核级别普查';

COMMENT ON COLUMN "public"."data_jbxx_fc"."xtbs" IS '系统标识[1:清查（默认）;2:普查]';

COMMENT ON COLUMN "public"."data_jbxx_fc"."cybmpy" IS '参与部门批阅 （2省未批3市未批 默认）';

COMMENT ON COLUMN "public"."data_jbxx_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON COLUMN "public"."data_jbxx_fc"."bjsm_wyhc" IS '外业核查-标记说明';

COMMENT ON COLUMN "public"."data_jbxx_fc"."shyj_wyhc" IS '外业核查-审核意见';

COMMENT ON COLUMN "public"."data_jbxx_fc"."fcsj" IS '废除时间';

COMMENT ON TABLE "public"."data_jbxx_fc" IS '数据-公共服务设施-基本信息';

CREATE TABLE "public"."data_jbxx_fc_pc" (
  "id" int4 ,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default",
  "sjly" int4,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int4,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default",
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6),
  "hczt" int2,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2,
  "cybmpy" int4,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "fcsj" timestamp(6) DEFAULT now(),
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
;

ALTER TABLE "public"."data_jbxx_fc_pc" OWNER TO "postgres";

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."id" IS '数据id';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."jgbm" IS '统一社会信用代码/机构编码';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."shzt" IS '审核状态';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."code" IS '代码';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."address" IS '单位地址';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."dmlx" IS '代码类型';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."csshjbqc" IS '初始审核级别清查';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."csshjbpc" IS '初始审核级别普查';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."xtbs" IS '系统标识[1:清查（默认）;2:普查]';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."cybmpy" IS '参与部门批阅 （2省未批3市未批 默认）';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."sm_wyhc" IS '外业核查说明';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."dwmc_wyhc" IS '外业核查-单位名称';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."address_wyhc" IS '外业核查-地址';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."dgeom_wyhc" IS '外业核查-点';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."mgeom_wyhc" IS '外业核查-面';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

COMMENT ON COLUMN "public"."data_jbxx_fc_pc"."fcsj" IS '废除时间';

COMMENT ON TABLE "public"."data_jbxx_fc_pc" IS '数据-公共服务设施-基本信息';

CREATE TABLE "public"."data_jbxx_pc" (
  "id" int4 ,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 11,
  "sjly" int4 DEFAULT 2,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int8,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default",
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6),
  "hczt" int2 DEFAULT 0,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2,
  "cybmpy" int4,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
;

ALTER TABLE "public"."data_jbxx_pc" OWNER TO "postgres";

COMMENT ON COLUMN "public"."data_jbxx_pc"."id" IS '数据id';

COMMENT ON COLUMN "public"."data_jbxx_pc"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."data_jbxx_pc"."jgbm" IS '统一社会信用代码/机构编码';

COMMENT ON COLUMN "public"."data_jbxx_pc"."shzt" IS '审核状态1已通过、2待通过、3被驳回、 4填报';

COMMENT ON COLUMN "public"."data_jbxx_pc"."sjly" IS '数据来源（1：模板导入，2：pc端新建，3：app新建）';

COMMENT ON COLUMN "public"."data_jbxx_pc"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."data_jbxx_pc"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."data_jbxx_pc"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."data_jbxx_pc"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."data_jbxx_pc"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."data_jbxx_pc"."code" IS '代码';

COMMENT ON COLUMN "public"."data_jbxx_pc"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."data_jbxx_pc"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."data_jbxx_pc"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."data_jbxx_pc"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."data_jbxx_pc"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."data_jbxx_pc"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."data_jbxx_pc"."address" IS '单位地址';

COMMENT ON COLUMN "public"."data_jbxx_pc"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."data_jbxx_pc"."dmlx" IS '代码类型';

COMMENT ON COLUMN "public"."data_jbxx_pc"."shlcztpc" IS '审核流程状态（参与部门未上报5、县级未上报4、市级未上报3、省级未上报2、国家级待通过1）';

COMMENT ON COLUMN "public"."data_jbxx_pc"."shztpc" IS '审核状态（1已通过、2待通过、3被驳回、 4填报）默认2';

COMMENT ON COLUMN "public"."data_jbxx_pc"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."data_jbxx_pc"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."data_jbxx_pc"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."data_jbxx_pc"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."data_jbxx_pc"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."data_jbxx_pc"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."data_jbxx_pc"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."data_jbxx_pc"."hczt" IS '核查状态[0:未核查；2：已核查;4:未通过]';

COMMENT ON COLUMN "public"."data_jbxx_pc"."csshjbqc" IS '初始审核级别清查';

COMMENT ON COLUMN "public"."data_jbxx_pc"."csshjbpc" IS '初始审核级别普查';

COMMENT ON COLUMN "public"."data_jbxx_pc"."xtbs" IS '系统标识[1:清查（默认）;2:普查]';

COMMENT ON COLUMN "public"."data_jbxx_pc"."cybmpy" IS '参与部门批阅 （2省未批3市未批 默认）';

COMMENT ON COLUMN "public"."data_jbxx_pc"."sm_wyhc" IS '外业核查说明';

COMMENT ON COLUMN "public"."data_jbxx_pc"."dwmc_wyhc" IS '外业核查-单位名称';

COMMENT ON COLUMN "public"."data_jbxx_pc"."address_wyhc" IS '外业核查-地址';

COMMENT ON COLUMN "public"."data_jbxx_pc"."dgeom_wyhc" IS '外业核查-点';

COMMENT ON COLUMN "public"."data_jbxx_pc"."mgeom_wyhc" IS '外业核查-面';

COMMENT ON COLUMN "public"."data_jbxx_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON COLUMN "public"."data_jbxx_pc"."bjsm_wyhc" IS '外业核查-标记说明';

COMMENT ON COLUMN "public"."data_jbxx_pc"."shyj_wyhc" IS '外业核查-审核意见';

COMMENT ON COLUMN "public"."data_jbxx_pc"."hcrid_wyhc" IS '核查人id-外业核查';

COMMENT ON COLUMN "public"."data_jbxx_pc"."hcrmc_wyhc" IS '核查人名称-外业核查';

COMMENT ON COLUMN "public"."data_jbxx_pc"."hcsj_wyhc" IS '核查时间-外业核查';

COMMENT ON COLUMN "public"."data_jbxx_pc"."sfcn_wyhc" IS '是否采纳-外业核查【0：待采纳；1未采纳；2已采纳】';

COMMENT ON TABLE "public"."data_jbxx_pc" IS '数据-公共服务设施-基本信息';

ALTER TABLE "public"."geo_cun" DROP CONSTRAINT "geo_cun_new0620_pkey";

ALTER TABLE "public"."geo_cun" ALTER COLUMN "gid" SET DEFAULT NULL::character varying;

ALTER TABLE "public"."geo_cun" ADD CONSTRAINT "geo_cun_back_0623_zhanghj_copy1_pkey" PRIMARY KEY ("gid");



-- ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ALTER COLUMN "tfbh" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ALTER COLUMN "tfbh" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lsybzrzhsj_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."lszh_lszh_lsybzrzhsj_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);


-- ALTER TABLE "public"."lszh_lszh_lszdzhsj" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."lszh_lszh_lszdzhsj" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lszdzhsj" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lszdzhsj" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_lszdzhsj" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_lszdzhsj" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_lszdzhsj" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_lszdzhsj" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_lszdzhsj_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_lszdzhsj_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_lszdzhsj_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."lszh_lszh_lszdzhsj_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);



-- ALTER TABLE "public"."lszh_lszh_ndzrzh" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."lszh_lszh_ndzrzh" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_ndzrzh" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_ndzrzh" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_ndzrzh" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_ndzrzh" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_ndzrzh" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_ndzrzh" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_ndzrzh_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."lszh_lszh_ndzrzh_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."lszh_lszh_ndzrzh_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."lszh_lszh_ndzrzh_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

CREATE TABLE "public"."privs_funcprivs" (
  "id" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "description" varchar(500) COLLATE "pg_catalog"."default",
  "pid" varchar(50) COLLATE "pg_catalog"."default",
  "sytemid" varchar(50) COLLATE "pg_catalog"."default",
  "lev" int2,
  "icon" varchar(255) COLLATE "pg_catalog"."default",
  "router" varchar(255) COLLATE "pg_catalog"."default",
  "index" int2,
  CONSTRAINT "privs_funcprivs_pkey" PRIMARY KEY ("id")
)
;

ALTER TABLE "public"."privs_funcprivs" OWNER TO "postgres";

COMMENT ON COLUMN "public"."privs_funcprivs"."index" IS '排序';

CREATE TABLE "public"."privs_role" (
  "id" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "description" varchar(500) COLLATE "pg_catalog"."default",
  "cjrid" varchar(50) COLLATE "pg_catalog"."default" DEFAULT now(),
  "cjsj" timestamp(6) DEFAULT now(),
  "index" int4,
  "issystem" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "gjjsfyx" int2,
  "shengsfyx" int2,
  "xsfyx" int2,
  "cybmsfyx" int2,
  "shisfyx" int2,
  "code" varchar(255) COLLATE "pg_catalog"."default",
  CONSTRAINT "privs_role_pkey" PRIMARY KEY ("id")
)
;

ALTER TABLE "public"."privs_role" OWNER TO "postgres";

COMMENT ON COLUMN "public"."privs_role"."issystem" IS '是否系角色【1：系统角色】';

COMMENT ON COLUMN "public"."privs_role"."gjjsfyx" IS '0否1是（国家级）';

COMMENT ON COLUMN "public"."privs_role"."shengsfyx" IS '0否1是（省级）';

COMMENT ON COLUMN "public"."privs_role"."xsfyx" IS '0否1是（县级）';

COMMENT ON COLUMN "public"."privs_role"."cybmsfyx" IS '0否1是（参与部门）';

COMMENT ON COLUMN "public"."privs_role"."shisfyx" IS '0否1是（市级）';

COMMENT ON COLUMN "public"."privs_role"."code" IS '创建该角色的用户区划代码';

CREATE TABLE "public"."privs_role_funcprivs" (
  "roleid" varchar(50) COLLATE "pg_catalog"."default",
  "privsid" varchar(50) COLLATE "pg_catalog"."default"
)
;

ALTER TABLE "public"."privs_role_funcprivs" OWNER TO "postgres";

CREATE TABLE "public"."privs_user_role" (
  "roleid" varchar(50) COLLATE "pg_catalog"."default",
  "userid" int4
)
;

ALTER TABLE "public"."privs_user_role" OWNER TO "postgres";

ALTER TABLE "public"."sdqx" ADD COLUMN "sfyx" int4;

CREATE TABLE "public"."system_bzwj" (
  "id" int4 NOT NULL,
  "wjlj" varchar(500) COLLATE "pg_catalog"."default",
  "wjm" varchar(255) COLLATE "pg_catalog"."default",
  "wjms" varchar(255) COLLATE "pg_catalog"."default",
  "wjlx" varchar(255) COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6),
  "px" int4,
  "pdfwjlj" varchar(255) COLLATE "pg_catalog"."default",
  "qcsfyx" int2,
  "pcsfyx" int2,
  CONSTRAINT "system_bzwj_pkey" PRIMARY KEY ("id")
)
;

ALTER TABLE "public"."system_bzwj" OWNER TO "postgres";

COMMENT ON COLUMN "public"."system_bzwj"."wjlj" IS '文件路径';

COMMENT ON COLUMN "public"."system_bzwj"."wjm" IS '文件名';

COMMENT ON COLUMN "public"."system_bzwj"."wjms" IS '文件描述';

COMMENT ON COLUMN "public"."system_bzwj"."wjlx" IS '文件类型（word、excel、pdf、txt、jpg）';

COMMENT ON COLUMN "public"."system_bzwj"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."system_bzwj"."px" IS '排序';

COMMENT ON COLUMN "public"."system_bzwj"."pdfwjlj" IS 'pdf路径';

COMMENT ON COLUMN "public"."system_bzwj"."qcsfyx" IS '清查是否有效（0无效1有效）';

COMMENT ON COLUMN "public"."system_bzwj"."pcsfyx" IS '普查是否有效（0无效1有效）';

COMMENT ON TABLE "public"."system_log_operation" IS '日志表';

ALTER TABLE "public"."system_log_operation" ALTER COLUMN "wjlj" TYPE varchar(255) COLLATE "pg_catalog"."default" USING "wjlj"::varchar(255);

COMMENT ON COLUMN "public"."system_log_operation"."wjlj" IS '文件路径【如是上传服务，记录上传文件路径】';

CREATE TABLE "public"."system_log_operation_user" (
  "id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "yhmc" varchar(50) COLLATE "pg_catalog"."default",
  "yhid" varchar(50) COLLATE "pg_catalog"."default",
  "code" varchar(255) COLLATE "pg_catalog"."default",
  "mk" varchar(50) COLLATE "pg_catalog"."default",
  "czlx" varchar(50) COLLATE "pg_catalog"."default",
  "czsj" timestamp(6) DEFAULT now(),
  "bz" text COLLATE "pg_catalog"."default",
  "param" jsonb,
  "ly" varchar(255) COLLATE "pg_catalog"."default",
  "yhlx" varchar(255) COLLATE "pg_catalog"."default",
  "ip" varchar(255) COLLATE "pg_catalog"."default",
  CONSTRAINT "system_log_operation_user_pkey" PRIMARY KEY ("id")
)
;

ALTER TABLE "public"."system_log_operation_user" OWNER TO "postgres";

COMMENT ON COLUMN "public"."system_log_operation_user"."id" IS '数据id';

COMMENT ON COLUMN "public"."system_log_operation_user"."yhmc" IS '用户名称';

COMMENT ON COLUMN "public"."system_log_operation_user"."yhid" IS '用户ID';

COMMENT ON COLUMN "public"."system_log_operation_user"."code" IS '用户行政区划';

COMMENT ON COLUMN "public"."system_log_operation_user"."mk" IS '模块';

COMMENT ON COLUMN "public"."system_log_operation_user"."czlx" IS '操作类型新建、编辑、废除、通过、上报、驳回、导出、登录、登出、更新用户信息、重置密码';

COMMENT ON COLUMN "public"."system_log_operation_user"."czsj" IS '操作时间';

COMMENT ON COLUMN "public"."system_log_operation_user"."bz" IS '备注';

COMMENT ON COLUMN "public"."system_log_operation_user"."param" IS '参数';

COMMENT ON COLUMN "public"."system_log_operation_user"."ly" IS '路由';

COMMENT ON COLUMN "public"."system_log_operation_user"."yhlx" IS '用户类型（0应急管理部用户1行业用户2外业核查人员）';

COMMENT ON COLUMN "public"."system_log_operation_user"."ip" IS 'ip地址';

COMMENT ON TABLE "public"."system_log_operation_user" IS '日志表';

ALTER TABLE "public"."yw_privsuser_wyhcpz" ADD COLUMN "groupid" varchar COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."yw_privsuser_wyhcpz"."groupid" IS '分组【排序】';

CREATE TABLE "public"."yw_task" (
  "id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "rwmc" varchar(255) COLLATE "pg_catalog"."default",
  "xfr" varchar(255) COLLATE "pg_catalog"."default",
  "xfrmc" varchar(255) COLLATE "pg_catalog"."default",
  "xfsj" timestamp(6),
  "zxr" varchar(255) COLLATE "pg_catalog"."default",
  "wcsj" timestamp(6),
  "rwqhid" varchar(255) COLLATE "pg_catalog"."default",
  "rwqhmc" varchar(255) COLLATE "pg_catalog"."default",
  "zxzt" varchar(255) COLLATE "pg_catalog"."default" DEFAULT 0,
  "cjsj" timestamp(6) DEFAULT now(),
  "cjrid" varchar(255) COLLATE "pg_catalog"."default",
  "cjrmc" varchar(255) COLLATE "pg_catalog"."default",
  "gxsj" timestamp(6) DEFAULT now(),
  "gxrid" varchar(255) COLLATE "pg_catalog"."default",
  "pid" varchar(255) COLLATE "pg_catalog"."default" DEFAULT 0,
  "sfcf" varchar(255) COLLATE "pg_catalog"."default" DEFAULT 0,
  "yhcsl" varchar(255) COLLATE "pg_catalog"."default",
  "hczsl" varchar(255) COLLATE "pg_catalog"."default",
  "kssj" timestamp(6),
  "dhcsl_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "yhcsl_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "bbhsl_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dshsl_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "yshsl_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "xzqhmc_xiang" varchar(255) COLLATE "pg_catalog"."default",
  CONSTRAINT "yw_task_pkey" PRIMARY KEY ("id")
)
;

ALTER TABLE "public"."yw_task" OWNER TO "postgres";

COMMENT ON COLUMN "public"."yw_task"."rwmc" IS '任务名称';

COMMENT ON COLUMN "public"."yw_task"."xfr" IS '下发人id（分配人id)';

COMMENT ON COLUMN "public"."yw_task"."xfrmc" IS '下发人名称（分配人名称）';

COMMENT ON COLUMN "public"."yw_task"."xfsj" IS '下发时间（分配时间）';

COMMENT ON COLUMN "public"."yw_task"."zxr" IS '执行人id';

COMMENT ON COLUMN "public"."yw_task"."wcsj" IS '完成时间';

COMMENT ON COLUMN "public"."yw_task"."rwqhid" IS '任务区划id';

COMMENT ON COLUMN "public"."yw_task"."rwqhmc" IS '任务区划名称';

COMMENT ON COLUMN "public"."yw_task"."zxzt" IS '执行状态[0：未开展；1：已开展；2：已完成]';

COMMENT ON COLUMN "public"."yw_task"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."yw_task"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."yw_task"."cjrmc" IS '创建人名称';

COMMENT ON COLUMN "public"."yw_task"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."yw_task"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."yw_task"."pid" IS '任务父级id';

COMMENT ON COLUMN "public"."yw_task"."sfcf" IS '是否拆分【0：未拆分；1：已拆分】';

COMMENT ON COLUMN "public"."yw_task"."yhcsl" IS '已核查数量';

COMMENT ON COLUMN "public"."yw_task"."hczsl" IS '核查总数量';

COMMENT ON COLUMN "public"."yw_task"."kssj" IS '开始时间';

COMMENT ON COLUMN "public"."yw_task"."dhcsl_wyhc" IS '待核查数量_外业核查';

COMMENT ON COLUMN "public"."yw_task"."yhcsl_wyhc" IS '已核查数量_外业核查';

COMMENT ON COLUMN "public"."yw_task"."bbhsl_wyhc" IS '被驳回数量_外业核查';

COMMENT ON COLUMN "public"."yw_task"."dshsl_wyhc" IS '待审核数量_外业核查';

COMMENT ON COLUMN "public"."yw_task"."yshsl_wyhc" IS '已审核数量_外业核查';

COMMENT ON COLUMN "public"."yw_task"."xzqhmc_xiang" IS '行政区划名称-乡';



ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" DROP CONSTRAINT "zdyh_zrzhcsaqscsgyhss_hgyq_pkey";

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ADD COLUMN "yqslsj" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_hgyq"."yqslsj" IS '园区设立时间';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" ADD CONSTRAINT "zdyh_zrzhcsaqscsgyhss_hgyq_copy1_pkey1" PRIMARY KEY ("id");

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" INHERIT "public"."data_jbxx_fc";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" DROP CONSTRAINT "zdyh_zrzhcsaqscsgyhss_hgyq_copy1_pkey";

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ADD COLUMN "yqslsj" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc"."yqslsj" IS '园区设立时间';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc" ADD CONSTRAINT "zdyh_zrzhcsaqscsgyhss_hgyq_fc_copy1_pkey" PRIMARY KEY ("id");

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ADD COLUMN "yqslsj" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc"."yqslsj" IS '园区设立时间';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" INHERIT "public"."data_jbxx_pc";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" DROP CONSTRAINT "zdyh_zrzhcsaqscsgyhss_hgyq_pc_pkey";

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ADD COLUMN "yqslsj" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc"."yqslsj" IS '园区设立时间';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_pc" ADD CONSTRAINT "zdyh_zrzhcsaqscsgyhss_hgyq_pc_copy1_pkey" PRIMARY KEY ("id");

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq_temp" ADD COLUMN "yqslsj_str" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_hgyq_temp"."yqslsj_str" IS '园区设立时间';



ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" DROP CONSTRAINT "zdyh_zrzhcsaqscsgyhss_wxhxpqy_pkey";

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ADD COLUMN "kyclsj" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy"."kyclsj" IS '开业（成立）时间';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" ADD CONSTRAINT "zdyh_zrzhcsaqscsgyhss_wxhxpqy_copy1_pkey1" PRIMARY KEY ("id");

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ADD COLUMN "kyclsj" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc"."kyclsj" IS '开业（成立）时间';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ADD COLUMN "kyclsj" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc"."kyclsj" IS '开业（成立）时间';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" INHERIT "public"."data_jbxx_pc";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" DROP CONSTRAINT "zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc_pkey";

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ADD COLUMN "kyclsj" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc"."kyclsj" IS '开业（成立）时间';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc" ADD CONSTRAINT "zdyh_zrzhcsaqscsgyhss_wxhxpqy_pc_copy1_pkey" PRIMARY KEY ("id");

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_qywxyxxtzb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_qywxyxxtzb" ALTER COLUMN "id" DROP DEFAULT;

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_qywxyxxtzb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_temp" ADD COLUMN "kyclsj_str" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_temp"."kyclsj_str" IS '开业（成立）时间';

ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy_temp" ADD COLUMN "kyclsj" varchar(100) COLLATE "pg_catalog"."default";



-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_temp" ADD COLUMN "sczt_qtsm_str" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_temp" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_temp" ADD COLUMN "sczt_str" varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks_temp" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxkswxytzb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxkswxytzb" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxkswxytzb" ALTER COLUMN "jkmc" TYPE varchar(100) COLLATE "pg_catalog"."default";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxkswxytzb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxkswxytzb_fc" ALTER COLUMN "jkmc" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxkswxytzb_temp" ALTER COLUMN "jkmc" TYPE varchar(100) COLLATE "pg_catalog"."default";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_jcsjdcb" ALTER COLUMN "id" DROP DEFAULT;



-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_temp" ADD COLUMN "sczt_str" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_ltks_temp"."sczt_str" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_temp" ADD COLUMN "sczt_qtsm_str" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_temp" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks_temp" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltkswxytzb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltkswxytzb" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltkswxytzb" ALTER COLUMN "mc" TYPE varchar(100) COLLATE "pg_catalog"."default";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltkswxytzb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltkswxytzb_fc" ALTER COLUMN "mc" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltkswxytzb_temp" ALTER COLUMN "mc" TYPE varchar(100) COLLATE "pg_catalog"."default";



-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc"."sczt" IS '生产状态';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_temp" ADD COLUMN "sczt_str" varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_temp" ADD COLUMN "sczt_qtsm_str" varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_temp" ADD COLUMN "sczt_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk_temp" ADD COLUMN "sczt" jsonb DEFAULT '[]'::jsonb;

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb" ALTER COLUMN "wkkmc" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb" ADD COLUMN "dwmc" varchar COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb"."dwmc" IS '尾矿库名称';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb" ADD COLUMN "xtbs" int2 DEFAULT 1;

-- ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb_fc" ALTER COLUMN "wkkmc" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb_fc" ADD COLUMN "dwmc" varchar COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb_fc"."dwmc" IS '尾矿库名称';

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb_fc" ADD COLUMN "xtbs" int2 DEFAULT 1;

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb_temp" ALTER COLUMN "wkkmc" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb_temp" ADD COLUMN "dwmc" varchar COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkkwxytzb_temp" ADD COLUMN "xtbs" int2 DEFAULT 1;



-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk" ALTER COLUMN "id" DROP DEFAULT;

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_dzhizhcsmksgwxy" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_dzhizhcsmksgwxy" ALTER COLUMN "id" DROP DEFAULT;

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_dzhizhcsmksgwxy_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_dzzhcsmksgwxy" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_dzzhcsmksgwxy" ALTER COLUMN "id" DROP DEFAULT;

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_dzzhcsmksgwxy_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_hszhcsmksgwxy" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_hszhcsmksgwxy" ALTER COLUMN "id" DROP DEFAULT;

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_hszhcsmksgwxy_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk_pc" ALTER COLUMN "id" DROP DEFAULT;



-- ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ADD COLUMN "codery" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl"."codery" IS '区划代码（若有）';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ADD COLUMN "codery" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc"."codery" IS '区划代码（若有）';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ADD COLUMN "codery" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc"."codery" IS '区划代码（若有）';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ADD COLUMN "codery" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc"."codery" IS '区划代码（若有）';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_temp" ADD COLUMN "codery_str" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_temp"."codery_str" IS '区划代码（若有）';

ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl_temp" ADD COLUMN "codery" varchar(100) COLLATE "pg_catalog"."default";



-- ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ALTER COLUMN "tjfw" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ALTER COLUMN "sjycd" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ALTER COLUMN "tjfw" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_jtjzzy_jtjzzynlsjcjgf_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "fgsmc" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl"."fgsmc" IS '分公司名称';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "fgsdmlx" varchar(50) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl"."fgsdmlx" IS '分公司代码类型';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "fgsdm" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl"."fgsdm" IS '分公司代码';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "fgsdz" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl"."fgsdz" IS '分公司地址';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "fgswz" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl"."fgswz" IS '分公司位置';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "fgsmc" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc"."fgsmc" IS '分公司名称';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "fgsdmlx" varchar(50) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc"."fgsdmlx" IS '分公司代码类型';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "fgsdm" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc"."fgsdm" IS '分公司代码';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "fgsdz" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc"."fgsdz" IS '分公司地址';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "fgswz" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc"."fgswz" IS '分公司位置';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "fgsmc" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc"."fgsmc" IS '分公司名称';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "fgsdmlx" varchar(50) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc"."fgsdmlx" IS '分公司代码类型';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "fgsdm" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc"."fgsdm" IS '分公司代码';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "fgsdz" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc"."fgsdz" IS '分公司地址';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "fgswz" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc"."fgswz" IS '分公司位置';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "fgsmc" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc"."fgsmc" IS '分公司名称';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "fgsdmlx" varchar(50) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc"."fgsdmlx" IS '分公司代码类型';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "fgsdm" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc"."fgsdm" IS '分公司代码';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "fgsdz" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc"."fgsdz" IS '分公司地址';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "fgswz" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc"."fgswz" IS '分公司位置';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp" ADD COLUMN "fgsmc_str" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp"."fgsmc_str" IS '分公司名称';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp" ADD COLUMN "fgsdmlx_str" varchar(50) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp"."fgsdmlx_str" IS '分公司代码类型';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp" ADD COLUMN "fgsdm_str" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp"."fgsdm_str" IS '分公司代码';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp" ADD COLUMN "fgsdz_str" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp"."fgsdz_str" IS '分公司地址';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp" ADD COLUMN "fgswz_str" varchar(100) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp"."fgswz_str" IS '分公司位置';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp" ADD COLUMN "fgsmc" varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp" ADD COLUMN "fgsdmlx" varchar(50) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp" ADD COLUMN "fgsdm" varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp" ADD COLUMN "fgsdz" varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl_temp" ADD COLUMN "fgswz" varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ADD COLUMN "jyzsjsl" int4;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy"."jyzsjsl" IS '救援直升机数量';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ADD COLUMN "wrjsl" int4;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy"."wrjsl" IS '无人机数量';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ADD COLUMN "jyzsjsl" int4;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc"."jyzsjsl" IS '救援直升机数量';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ADD COLUMN "wrjsl" int4;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc"."wrjsl" IS '无人机数量';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ADD COLUMN "jyzsjsl" int4;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc"."jyzsjsl" IS '救援直升机数量';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ADD COLUMN "wrjsl" int4;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc"."wrjsl" IS '无人机数量';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ADD COLUMN "jyzsjsl" int4;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc"."jyzsjsl" IS '救援直升机数量';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ADD COLUMN "wrjsl" int4;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc"."wrjsl" IS '无人机数量';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_temp" ADD COLUMN "jyzsjsl_str" int4;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_temp"."jyzsjsl_str" IS '救援直升机数量';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_temp" ADD COLUMN "wrjsl_str" int4;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_jyzbzy_temp"."wrjsl_str" IS '无人机数量';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_temp" ADD COLUMN "jyzsjsl" int4;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_jyzbzy_temp" ADD COLUMN "wrjsl" int4;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ADD COLUMN "zzjb" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy"."zzjb" IS '组织级别';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ADD COLUMN "zzjb_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ADD COLUMN "zzjb" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc"."zzjb" IS '组织级别';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ADD COLUMN "zzjb_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ADD COLUMN "zzjb" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc"."zzjb" IS '组织级别';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ADD COLUMN "zzjb_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ADD COLUMN "zzjb" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc"."zzjb" IS '组织级别';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ADD COLUMN "zzjb_qtsm" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc" ADD CONSTRAINT "zhjzzy_qyyshlljzzy_shyjllzhjzzy_pc_pkey" PRIMARY KEY ("id");

-- ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_temp" ADD COLUMN "zzjb_str" jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_temp"."zzjb_str" IS '组织级别';

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_temp" ADD COLUMN "zzjb_qtsm_str" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_temp" ADD COLUMN "zzjb" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "public"."zhjzzy_qyyshlljzzy_shyjllzhjzzy_temp" ADD COLUMN "zzjb_qtsm" jsonb;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_dzzyjydwyzb_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hkhlzdwyzb_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_hsjydwyzb_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ADD COLUMN "mt" int4;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd"."mt" IS '毛毯';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ADD COLUMN "mt" int4;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc"."mt" IS '毛毯';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ADD COLUMN "mt" int4;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc"."mt" IS '毛毯';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ADD COLUMN "mt" int4;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc"."mt" IS '毛毯';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_jzwzcbkd_temp" ADD COLUMN "mt_str" int4;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_jzwzcbkd_temp"."mt_str" IS '毛毯';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_kssdhyjydwyzb_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ADD COLUMN "wzysc" int4;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb"."wzysc" IS '物资运输车';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ADD COLUMN "wzysc" int4;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc"."wzysc" IS '物资运输车';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ADD COLUMN "wzysc" int4;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc"."wzysc" IS '物资运输车';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ADD COLUMN "wzysc" int4;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc"."wzysc" IS '物资运输车';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_temp" ADD COLUMN "wzysc_str" int4;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_slxfdwyzb_temp"."wzysc_str" IS '物资运输车';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_slxfdwyzb_temp" ADD COLUMN "wzysc" int4;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_whyqhyjydwyzb_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

CREATE TABLE "public"."zhjzzy_zfzhjzzy_ycbfg" (
  "id" int4,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "sjly" int4 DEFAULT 1,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2 DEFAULT 5,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int4 DEFAULT 5,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6) DEFAULT now(),
  "hczt" int2 DEFAULT 1,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2 DEFAULT 1,
  "cybmpy" int4 DEFAULT 3,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "tyshxydm" varchar(100) COLLATE "pg_catalog"."default",
  "sjzt" int2 DEFAULT 1,
  "ycbfg_jchgpsj" timestamp(6) DEFAULT now(),
  "ycbfg_jsztz" numeric,
  "ycbfgjsmj" numeric,
  "sjrnycsl" int4,
  "ycbfg_syndqycs" int4,
  "syndjnzyycsl" int4,
  "zdzz_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncslx_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncsdj_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "rdhzgbm_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
INHERITS ("public"."data_jbxx")
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_ycbfg" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."shzt" IS '（1待审核、2审核通过、3审核不通过）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."code" IS '代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."address" IS '单位地址';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."tyshxydm" IS '统一社会信用代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."sjzt" IS '数据状态（1正常数据2废除数据3疑问标记数据）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."ycbfg_jchgpsj" IS '建成（或挂牌）时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."ycbfg_jsztz" IS '建设总投资';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."ycbfgjsmj" IS '渔船避风港建设面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."sjrnycsl" IS '设计容纳渔船数量';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."ycbfg_syndqycs" IS '上一年度启用次数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."syndjnzyycsl" IS '上一年度接纳转移渔船数量';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."bjsm_wyhc" IS '外业核查-标记说明';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg"."shyj_wyhc" IS '外业核查-审核意见';

COMMENT ON TABLE "public"."zhjzzy_zfzhjzzy_ycbfg" IS '综合减灾资源-政府综合减灾资源-渔船避风港调查表';

CREATE TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_fc" (
  "id" int4,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "sjly" int4 DEFAULT 1,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2 DEFAULT 5,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int4 DEFAULT 5,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6) DEFAULT now(),
  "hczt" int2 DEFAULT 1,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2 DEFAULT 1,
  "cybmpy" int4 DEFAULT 3,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "tyshxydm" varchar(100) COLLATE "pg_catalog"."default",
  "sjzt" int2 DEFAULT 1,
  "ycbfg_jchgpsj" timestamp(6) DEFAULT now(),
  "ycbfg_jsztz" numeric,
  "ycbfgjsmj" numeric,
  "sjrnycsl" int4,
  "ycbfg_syndqycs" int4,
  "syndjnzyycsl" int4,
  "zdzz_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncslx_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncsdj_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "rdhzgbm_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "fcsj" timestamp(6) DEFAULT now(),
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
INHERITS ("public"."data_jbxx_fc")
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_fc" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."shzt" IS '（1待审核、2审核通过、3审核不通过）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."code" IS '代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."address" IS '单位地址';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."bjsm_wyhc" IS '外业核查-标记说明';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."shyj_wyhc" IS '外业核查-审核意见';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."tyshxydm" IS '统一社会信用代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."sjzt" IS '数据状态（1正常数据2废除数据3疑问标记数据）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."ycbfg_jchgpsj" IS '建成（或挂牌）时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."ycbfg_jsztz" IS '建设总投资';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."ycbfgjsmj" IS '渔船避风港建设面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."sjrnycsl" IS '设计容纳渔船数量';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."ycbfg_syndqycs" IS '上一年度启用次数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc"."syndjnzyycsl" IS '上一年度接纳转移渔船数量';

COMMENT ON TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_fc" IS '综合减灾资源-政府综合减灾资源-渔船避风港调查表';

CREATE TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc" (
  "id" int4,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "sjly" int4 DEFAULT 1,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2 DEFAULT 5,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int4 DEFAULT 5,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6) DEFAULT now(),
  "hczt" int2 DEFAULT 1,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2 DEFAULT 1,
  "cybmpy" int4 DEFAULT 3,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "tyshxydm" varchar(100) COLLATE "pg_catalog"."default",
  "sjzt" int2 DEFAULT 1,
  "ycbfg_jchgpsj" timestamp(6) DEFAULT now(),
  "ycbfg_jsztz" numeric,
  "ycbfgjsmj" numeric,
  "sjrnycsl" int4,
  "ycbfg_syndqycs" int4,
  "syndjnzyycsl" int4,
  "zdzz_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncslx_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncsdj_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "rdhzgbm_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "fcsj" timestamp(6) DEFAULT now(),
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
INHERITS ("public"."data_jbxx_fc_pc")
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."shzt" IS '（1待审核、2审核通过、3审核不通过）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."code" IS '代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."address" IS '单位地址';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."tyshxydm" IS '统一社会信用代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."sjzt" IS '数据状态（1正常数据2废除数据3疑问标记数据）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."ycbfg_jchgpsj" IS '建成（或挂牌）时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."ycbfg_jsztz" IS '建设总投资';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."ycbfgjsmj" IS '渔船避风港建设面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."sjrnycsl" IS '设计容纳渔船数量';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."ycbfg_syndqycs" IS '上一年度启用次数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc"."syndjnzyycsl" IS '上一年度接纳转移渔船数量';

COMMENT ON TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_fc_pc" IS '综合减灾资源-政府综合减灾资源-渔船避风港调查表';

CREATE TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_pc" (
  "id" int4,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "sjly" int4 DEFAULT 2,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2 DEFAULT 5,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int8 DEFAULT 5,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6) DEFAULT now(),
  "hczt" int2 DEFAULT 0,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2 DEFAULT 1,
  "cybmpy" int4 DEFAULT 3,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "tyshxydm" varchar(100) COLLATE "pg_catalog"."default",
  "sjzt" int2 DEFAULT 1,
  "ycbfg_jchgpsj" timestamp(6) DEFAULT now(),
  "ycbfg_jsztz" numeric,
  "ycbfgjsmj" numeric,
  "sjrnycsl" int4,
  "ycbfg_syndqycs" int4,
  "syndjnzyycsl" int4,
  "zdzz_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncslx_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncsdj_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "rdhzgbm_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
INHERITS ("public"."data_jbxx_pc")
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_pc" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."shzt" IS '（1待审核、2审核通过、3审核不通过）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."code" IS '代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."address" IS '单位地址';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."bjsm_wyhc" IS '外业核查-标记说明';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."shyj_wyhc" IS '外业核查-审核意见';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."tyshxydm" IS '统一社会信用代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."sjzt" IS '数据状态（1正常数据2废除数据3疑问标记数据）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."ycbfg_jchgpsj" IS '建成（或挂牌）时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."ycbfg_jsztz" IS '建设总投资';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."ycbfgjsmj" IS '渔船避风港建设面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."sjrnycsl" IS '设计容纳渔船数量';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."ycbfg_syndqycs" IS '上一年度启用次数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_pc"."syndjnzyycsl" IS '上一年度接纳转移渔船数量';

COMMENT ON TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_pc" IS '综合减灾资源-政府综合减灾资源-渔船避风港调查表';

CREATE TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_shxx" (
  "sjid" int4,
  "shrid" varchar(255) COLLATE "pg_catalog"."default",
  "shjb" varchar(255) COLLATE "pg_catalog"."default",
  "shyj" varchar(255) COLLATE "pg_catalog"."default",
  "shlx" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '0'::character varying,
  "cjsj" timestamp(6) DEFAULT now(),
  "xtbs" int4,
  "shrmc" varchar(100) COLLATE "pg_catalog"."default"
)
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_shxx" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_shxx"."shlx" IS '审核类型【1上报，2驳回】';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_shxx"."xtbs" IS '系统标识【1清查，2普查】';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_shxx"."shrmc" IS '审核人名称';

CREATE TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_temp" (
  "id" int4,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "sjly" int4 DEFAULT 1,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6) DEFAULT now(),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(100) COLLATE "pg_catalog"."default",
  "shlczt" int2 DEFAULT 5,
  "tyshxydm" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int4 DEFAULT 5,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6) DEFAULT now(),
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "hczt" int2 DEFAULT 1,
  "sjzt" int2 DEFAULT 1,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "ycbfg_jchgpsj" timestamp(6) DEFAULT now(),
  "ycbfg_jsztz" numeric,
  "ycbfgjsmj" numeric,
  "sjrnycsl" int4,
  "ycbfg_syndqycs" int4,
  "syndjnzyycsl" int4,
  "xtbs" int2 DEFAULT 1,
  "cybmpy" int4 DEFAULT 3,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "zdzz_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncslx_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncsdj_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "rdhzgbm_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "mgeom_wyhc" "public"."geometry",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "ycbfgjsmj_str" varchar(1024) COLLATE "pg_catalog"."default",
  "ycbfg_jsztz_str" varchar(1024) COLLATE "pg_catalog"."default",
  "sjrnycsl_str" varchar(1024) COLLATE "pg_catalog"."default",
  "syndjnzyycsl_str" varchar(1024) COLLATE "pg_catalog"."default",
  "ycbfg_syndqycs_str" varchar(1024) COLLATE "pg_catalog"."default",
  "ycbfg_jchgpsj_str" varchar(1024) COLLATE "pg_catalog"."default",
  "dwmc_str" varchar(1024) COLLATE "pg_catalog"."default",
  "address_str" varchar(1024) COLLATE "pg_catalog"."default",
  "tbr_str" varchar(100) COLLATE "pg_catalog"."default",
  "dwfzr_str" varchar(100) COLLATE "pg_catalog"."default",
  "tjfzr_str" varchar(100) COLLATE "pg_catalog"."default",
  "tbrq_str" timestamp(6) DEFAULT now(),
  "lxdh_str" varchar(100) COLLATE "pg_catalog"."default",
  "sfxz" varchar(1024) COLLATE "pg_catalog"."default",
  "sjbs" varchar(1024) COLLATE "pg_catalog"."default",
  "cwxx" varchar(1024) COLLATE "pg_catalog"."default"
)
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_temp" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."shzt" IS '（1待审核、2审核通过、3审核不通过）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."code" IS '代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."address" IS '单位地址';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."tyshxydm" IS '统一社会信用代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."sjzt" IS '数据状态（1正常数据2废除数据3疑问标记数据）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."ycbfg_jchgpsj" IS '建成（或挂牌）时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."ycbfg_jsztz" IS '建设总投资';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."ycbfgjsmj" IS '渔船避风港建设面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."sjrnycsl" IS '设计容纳渔船数量';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."ycbfg_syndqycs" IS '上一年度启用次数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_ycbfg_temp"."syndjnzyycsl" IS '上一年度接纳转移渔船数量';

COMMENT ON TABLE "public"."zhjzzy_zfzhjzzy_ycbfg_temp" IS '综合减灾资源-政府综合减灾资源-渔船避风港调查表';

CREATE TABLE "public"."zhjzzy_zfzhjzzy_yjbncs" (
  "id" int4,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "sjly" int4 DEFAULT 1,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2 DEFAULT 5,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int4 DEFAULT 5,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6) DEFAULT now(),
  "hczt" int2 DEFAULT 1,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2 DEFAULT 1,
  "cybmpy" int4 DEFAULT 3,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "tyshxydm" varchar(100) COLLATE "pg_catalog"."default",
  "sjzt" int2 DEFAULT 1,
  "zdzz" jsonb DEFAULT '[]'::jsonb,
  "bncslx" jsonb DEFAULT '[]'::jsonb,
  "bnsc" jsonb DEFAULT '[]'::jsonb,
  "snswlx" jsonb DEFAULT '[]'::jsonb,
  "bnszdzmj" numeric,
  "yjbncssnmj" numeric,
  "bnsrnrs" numeric,
  "bzbsgfx" jsonb DEFAULT '[]'::jsonb,
  "wzcb" jsonb DEFAULT '[]'::jsonb,
  "yjss" jsonb DEFAULT '[]'::jsonb,
  "rcwhhglrysl" int4,
  "zzwhhglrys" int4,
  "zhyjbncs_syndqycs" int4,
  "syndjnjjzyazrc" int4,
  "rdbm" jsonb DEFAULT '[]'::jsonb,
  "zgdw" jsonb DEFAULT '[]'::jsonb,
  "jsdw" jsonb DEFAULT '[]'::jsonb,
  "zhyjbncs_jchgpsj" timestamp(6) DEFAULT now(),
  "jsbz" varchar(255) COLLATE "pg_catalog"."default",
  "ghqk" jsonb DEFAULT '[]'::jsonb,
  "zhyjbncs_jsztz" numeric,
  "cqywdw" jsonb DEFAULT '[]'::jsonb,
  "ywtr" jsonb DEFAULT '[]'::jsonb,
  "ywtrqd" jsonb DEFAULT '[]'::jsonb,
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "zdzz_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncslx_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncsdj_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "rdhzgbm_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
INHERITS ("public"."data_jbxx")
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_yjbncs" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."shzt" IS '（1待审核、2审核通过、3审核不通过）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."code" IS '代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."address" IS '单位地址';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."dmlx" IS '代码类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."tyshxydm" IS '统一社会信用代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."sjzt" IS '数据状态（1正常数据2废除数据3疑问标记数据）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."zdzz" IS '避灾种类';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."bncslx" IS '应急避难场所建设类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."bnsc" IS '避难时长';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."snswlx" IS '室内/室外类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."bnszdzmj" IS '应急避难场所占地总面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."yjbncssnmj" IS '应急避难场所室内面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."bnsrnrs" IS '避难所容纳人数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."bzbsgfx" IS '标志标识规范性';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."wzcb" IS '物资储备';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."yjss" IS '应急设施';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."rcwhhglrysl" IS '日常维护或管理人员数量';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."zzwhhglrys" IS '其中：专职维护或管理人员数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."zhyjbncs_syndqycs" IS '上一年度启用次数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."syndjnjjzyazrc" IS '上一年度接纳紧急转移安置人次';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."rdbm" IS '认定部门';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."zgdw" IS '主管单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."jsdw" IS '建设单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."zhyjbncs_jchgpsj" IS '建成（或挂牌）时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."jsbz" IS '建设标准';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."ghqk" IS '规划情况';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."zhyjbncs_jsztz" IS '建设总投资';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."cqywdw" IS '产权/运维单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."ywtr" IS '运维投入';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."ywtrqd" IS '运维投入渠道';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."bjsm_wyhc" IS '外业核查-标记说明';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs"."shyj_wyhc" IS '外业核查-审核意见';

COMMENT ON TABLE "public"."zhjzzy_zfzhjzzy_yjbncs" IS '综合减灾资源-政府综合减灾资源-应急避难场所调查表';

CREATE TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_fc" (
  "id" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "sjly" int4 DEFAULT 1,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2 DEFAULT 5,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int4 DEFAULT 5,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6) DEFAULT now(),
  "hczt" int2 DEFAULT 1,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2 DEFAULT 1,
  "cybmpy" int4 DEFAULT 3,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "tyshxydm" varchar(100) COLLATE "pg_catalog"."default",
  "sjzt" int2 DEFAULT 1,
  "zdzz" jsonb DEFAULT '[]'::jsonb,
  "bncslx" jsonb DEFAULT '[]'::jsonb,
  "bnsc" jsonb DEFAULT '[]'::jsonb,
  "snswlx" jsonb DEFAULT '[]'::jsonb,
  "bnszdzmj" numeric,
  "yjbncssnmj" numeric,
  "bnsrnrs" numeric,
  "bzbsgfx" jsonb DEFAULT '[]'::jsonb,
  "wzcb" jsonb DEFAULT '[]'::jsonb,
  "yjss" jsonb DEFAULT '[]'::jsonb,
  "rcwhhglrysl" int4,
  "zzwhhglrys" int4,
  "zhyjbncs_syndqycs" int4,
  "syndjnjjzyazrc" int4,
  "rdbm" jsonb DEFAULT '[]'::jsonb,
  "zgdw" jsonb DEFAULT '[]'::jsonb,
  "jsdw" jsonb DEFAULT '[]'::jsonb,
  "zhyjbncs_jchgpsj" timestamp(6) DEFAULT now(),
  "jsbz" varchar(255) COLLATE "pg_catalog"."default",
  "ghqk" jsonb DEFAULT '[]'::jsonb,
  "zhyjbncs_jsztz" numeric,
  "cqywdw" jsonb DEFAULT '[]'::jsonb,
  "ywtr" jsonb DEFAULT '[]'::jsonb,
  "ywtrqd" jsonb DEFAULT '[]'::jsonb,
  "zdzz_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncslx_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncsdj_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "rdhzgbm_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "fcsj" timestamp(6) DEFAULT now(),
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
INHERITS ("public"."data_jbxx_fc")
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_fc" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."shzt" IS '（1待审核、2审核通过、3审核不通过）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."code" IS '代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."address" IS '单位地址';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."dmlx" IS '代码类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."bjsm_wyhc" IS '外业核查-标记说明';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."shyj_wyhc" IS '外业核查-审核意见';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."tyshxydm" IS '统一社会信用代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."sjzt" IS '数据状态（1正常数据2废除数据3疑问标记数据）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."zdzz" IS '避灾种类';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."bncslx" IS '应急避难场所建设类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."bnsc" IS '避难时长';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."snswlx" IS '室内/室外类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."bnszdzmj" IS '应急避难场所占地总面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."yjbncssnmj" IS '应急避难场所室内面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."bnsrnrs" IS '避难所容纳人数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."bzbsgfx" IS '标志标识规范性';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."wzcb" IS '物资储备';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."yjss" IS '应急设施';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."rcwhhglrysl" IS '日常维护或管理人员数量';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."zzwhhglrys" IS '其中：专职维护或管理人员数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."zhyjbncs_syndqycs" IS '上一年度启用次数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."syndjnjjzyazrc" IS '上一年度接纳紧急转移安置人次';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."rdbm" IS '认定部门';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."zgdw" IS '主管单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."jsdw" IS '建设单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."zhyjbncs_jchgpsj" IS '建成（或挂牌）时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."jsbz" IS '建设标准';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."ghqk" IS '规划情况';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."zhyjbncs_jsztz" IS '建设总投资';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."cqywdw" IS '产权/运维单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."ywtr" IS '运维投入';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc"."ywtrqd" IS '运维投入渠道';

COMMENT ON TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_fc" IS '综合减灾资源-政府综合减灾资源-应急避难场所调查表';

CREATE TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc" (
  "id" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "sjly" int4 DEFAULT 1,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2 DEFAULT 5,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int4 DEFAULT 5,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6) DEFAULT now(),
  "hczt" int2 DEFAULT 1,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2 DEFAULT 1,
  "cybmpy" int4 DEFAULT 3,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "tyshxydm" varchar(100) COLLATE "pg_catalog"."default",
  "sjzt" int2 DEFAULT 1,
  "zdzz" jsonb DEFAULT '[]'::jsonb,
  "bncslx" jsonb DEFAULT '[]'::jsonb,
  "bnsc" jsonb DEFAULT '[]'::jsonb,
  "snswlx" jsonb DEFAULT '[]'::jsonb,
  "bnszdzmj" numeric,
  "yjbncssnmj" numeric,
  "bnsrnrs" numeric,
  "bzbsgfx" jsonb DEFAULT '[]'::jsonb,
  "wzcb" jsonb DEFAULT '[]'::jsonb,
  "yjss" jsonb DEFAULT '[]'::jsonb,
  "rcwhhglrysl" int4,
  "zzwhhglrys" int4,
  "zhyjbncs_syndqycs" int4,
  "syndjnjjzyazrc" int4,
  "rdbm" jsonb DEFAULT '[]'::jsonb,
  "zgdw" jsonb DEFAULT '[]'::jsonb,
  "jsdw" jsonb DEFAULT '[]'::jsonb,
  "zhyjbncs_jchgpsj" timestamp(6) DEFAULT now(),
  "jsbz" varchar(255) COLLATE "pg_catalog"."default",
  "ghqk" jsonb DEFAULT '[]'::jsonb,
  "zhyjbncs_jsztz" numeric,
  "cqywdw" jsonb DEFAULT '[]'::jsonb,
  "ywtr" jsonb DEFAULT '[]'::jsonb,
  "ywtrqd" jsonb DEFAULT '[]'::jsonb,
  "zdzz_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncslx_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncsdj_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "rdhzgbm_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "fcsj" timestamp(6) DEFAULT now(),
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
INHERITS ("public"."data_jbxx_fc_pc")
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."shzt" IS '（1待审核、2审核通过、3审核不通过）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."code" IS '代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."address" IS '单位地址';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."dmlx" IS '代码类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."tyshxydm" IS '统一社会信用代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."sjzt" IS '数据状态（1正常数据2废除数据3疑问标记数据）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."zdzz" IS '避灾种类';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."bncslx" IS '应急避难场所建设类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."bnsc" IS '避难时长';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."snswlx" IS '室内/室外类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."bnszdzmj" IS '应急避难场所占地总面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."yjbncssnmj" IS '应急避难场所室内面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."bnsrnrs" IS '避难所容纳人数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."bzbsgfx" IS '标志标识规范性';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."wzcb" IS '物资储备';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."yjss" IS '应急设施';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."rcwhhglrysl" IS '日常维护或管理人员数量';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."zzwhhglrys" IS '其中：专职维护或管理人员数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."zhyjbncs_syndqycs" IS '上一年度启用次数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."syndjnjjzyazrc" IS '上一年度接纳紧急转移安置人次';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."rdbm" IS '认定部门';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."zgdw" IS '主管单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."jsdw" IS '建设单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."zhyjbncs_jchgpsj" IS '建成（或挂牌）时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."jsbz" IS '建设标准';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."ghqk" IS '规划情况';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."zhyjbncs_jsztz" IS '建设总投资';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."cqywdw" IS '产权/运维单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."ywtr" IS '运维投入';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc"."ywtrqd" IS '运维投入渠道';

COMMENT ON TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_fc_pc" IS '综合减灾资源-政府综合减灾资源-应急避难场所调查表';

CREATE TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_pc" (
  "id" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "sjly" int4 DEFAULT 2,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(500) COLLATE "pg_catalog"."default",
  "shlczt" int2 DEFAULT 5,
  "dmlx" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int8 DEFAULT 5,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6) DEFAULT now(),
  "hczt" int2 DEFAULT 0,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "xtbs" int2 DEFAULT 1,
  "cybmpy" int4 DEFAULT 3,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "gid" varchar(255) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "mgeom_wyhc" "public"."geometry",
  "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0,
  "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "tyshxydm" varchar(100) COLLATE "pg_catalog"."default",
  "sjzt" int2 DEFAULT 1,
  "zdzz" jsonb DEFAULT '[]'::jsonb,
  "bncslx" jsonb DEFAULT '[]'::jsonb,
  "bnsc" jsonb DEFAULT '[]'::jsonb,
  "snswlx" jsonb DEFAULT '[]'::jsonb,
  "bnszdzmj" numeric,
  "yjbncssnmj" numeric,
  "bnsrnrs" numeric,
  "bzbsgfx" jsonb DEFAULT '[]'::jsonb,
  "wzcb" jsonb DEFAULT '[]'::jsonb,
  "yjss" jsonb DEFAULT '[]'::jsonb,
  "rcwhhglrysl" int4,
  "zzwhhglrys" int4,
  "zhyjbncs_syndqycs" int4,
  "syndjnjjzyazrc" int4,
  "rdbm" jsonb DEFAULT '[]'::jsonb,
  "zgdw" jsonb DEFAULT '[]'::jsonb,
  "jsdw" jsonb DEFAULT '[]'::jsonb,
  "zhyjbncs_jchgpsj" timestamp(6) DEFAULT now(),
  "jsbz" varchar(255) COLLATE "pg_catalog"."default",
  "ghqk" jsonb DEFAULT '[]'::jsonb,
  "zhyjbncs_jsztz" numeric,
  "cqywdw" jsonb DEFAULT '[]'::jsonb,
  "ywtr" jsonb DEFAULT '[]'::jsonb,
  "ywtrqd" jsonb DEFAULT '[]'::jsonb,
  "zdzz_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncslx_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncsdj_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "rdhzgbm_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bnsc_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "snswlx_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "bzbsgfx_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "wzcb_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "yjss_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "rdbm_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "zgdw_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "jsdw_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "ghqk_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "cqywdw_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "ywtr_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "ywtrqd_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "hcsj_wyhc" timestamp(6),
  "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0
)
INHERITS ("public"."data_jbxx_pc")
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_pc" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."shzt" IS '（1待审核、2审核通过、3审核不通过）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."code" IS '代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."address" IS '单位地址';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."dmlx" IS '代码类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."bjsm_wyhc" IS '外业核查-标记说明';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."shyj_wyhc" IS '外业核查-审核意见';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."tyshxydm" IS '统一社会信用代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."sjzt" IS '数据状态（1正常数据2废除数据3疑问标记数据）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."zdzz" IS '避灾种类';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."bncslx" IS '应急避难场所建设类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."bnsc" IS '避难时长';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."snswlx" IS '室内/室外类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."bnszdzmj" IS '应急避难场所占地总面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."yjbncssnmj" IS '应急避难场所室内面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."bnsrnrs" IS '避难所容纳人数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."bzbsgfx" IS '标志标识规范性';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."wzcb" IS '物资储备';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."yjss" IS '应急设施';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."rcwhhglrysl" IS '日常维护或管理人员数量';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."zzwhhglrys" IS '其中：专职维护或管理人员数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."zhyjbncs_syndqycs" IS '上一年度启用次数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."syndjnjjzyazrc" IS '上一年度接纳紧急转移安置人次';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."rdbm" IS '认定部门';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."zgdw" IS '主管单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."jsdw" IS '建设单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."zhyjbncs_jchgpsj" IS '建成（或挂牌）时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."jsbz" IS '建设标准';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."ghqk" IS '规划情况';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."zhyjbncs_jsztz" IS '建设总投资';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."cqywdw" IS '产权/运维单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."ywtr" IS '运维投入';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_pc"."ywtrqd" IS '运维投入渠道';

COMMENT ON TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_pc" IS '综合减灾资源-政府综合减灾资源-应急避难场所调查表';

CREATE TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_shxx" (
  "sjid" varchar(100) COLLATE "pg_catalog"."default",
  "shrid" varchar(255) COLLATE "pg_catalog"."default",
  "shjb" varchar(255) COLLATE "pg_catalog"."default",
  "shyj" varchar(255) COLLATE "pg_catalog"."default",
  "shlx" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '0'::character varying,
  "cjsj" timestamp(6) DEFAULT now(),
  "xtbs" int4,
  "shrmc" varchar(100) COLLATE "pg_catalog"."default"
)
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_shxx" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_shxx"."shlx" IS '审核类型【1上报，2驳回】';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_shxx"."xtbs" IS '系统标识【1清查，2普查】';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_shxx"."shrmc" IS '审核人名称';

CREATE TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_temp" (
  "id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT nextval('zhjzzy_zfzhjzzy_yjbncs_id_seq'::regclass),
  "dwmc" varchar COLLATE "pg_catalog"."default",
  "shzt" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "sjly" int4 DEFAULT 1,
  "rgbjly" varchar(255) COLLATE "pg_catalog"."default",
  "cjrid" varchar COLLATE "pg_catalog"."default",
  "gxrid" varchar COLLATE "pg_catalog"."default",
  "cjsj" timestamp(6) DEFAULT now(),
  "gxsj" timestamp(6) DEFAULT now(),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "dzsheng" varchar(50) COLLATE "pg_catalog"."default",
  "dzshi" varchar(50) COLLATE "pg_catalog"."default",
  "dzxian" varchar(50) COLLATE "pg_catalog"."default",
  "dzxiang" varchar(50) COLLATE "pg_catalog"."default",
  "dzjh" varchar(50) COLLATE "pg_catalog"."default",
  "flbm" varchar(50) COLLATE "pg_catalog"."default",
  "address" varchar(100) COLLATE "pg_catalog"."default",
  "shlczt" int2 DEFAULT 5,
  "tyshxydm" varchar(100) COLLATE "pg_catalog"."default",
  "shlcztpc" int4 DEFAULT 5,
  "shztpc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT '52'::character varying,
  "dgeom" "public"."geometry",
  "mgeom" "public"."geometry",
  "dwfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tjfzr" varchar(50) COLLATE "pg_catalog"."default",
  "tbr" varchar(50) COLLATE "pg_catalog"."default",
  "lxdh" varchar(50) COLLATE "pg_catalog"."default",
  "tbrq" timestamp(6) DEFAULT now(),
  "jgbm" varchar(255) COLLATE "pg_catalog"."default",
  "hczt" int2 DEFAULT 1,
  "sjzt" int2 DEFAULT 1,
  "cjrmc" varchar(100) COLLATE "pg_catalog"."default",
  "csshjbqc" varchar(50) COLLATE "pg_catalog"."default",
  "csshjbpc" varchar(50) COLLATE "pg_catalog"."default",
  "zdzz" jsonb DEFAULT '[]'::jsonb,
  "bncslx" jsonb DEFAULT '[]'::jsonb,
  "bnsc" jsonb DEFAULT '[]'::jsonb,
  "snswlx" jsonb DEFAULT '[]'::jsonb,
  "bnszdzmj" numeric,
  "yjbncssnmj" numeric,
  "bnsrnrs" numeric,
  "bzbsgfx" jsonb DEFAULT '[]'::jsonb,
  "wzcb" jsonb DEFAULT '[]'::jsonb,
  "yjss" jsonb DEFAULT '[]'::jsonb,
  "rcwhhglrysl" int4,
  "zzwhhglrys" int4,
  "zhyjbncs_syndqycs" int4,
  "syndjnjjzyazrc" int4,
  "rdbm" jsonb DEFAULT '[]'::jsonb,
  "zgdw" jsonb DEFAULT '[]'::jsonb,
  "jsdw" jsonb DEFAULT '[]'::jsonb,
  "zhyjbncs_jchgpsj" timestamp(6) DEFAULT now(),
  "jsbz" varchar(255) COLLATE "pg_catalog"."default",
  "ghqk" jsonb DEFAULT '[]'::jsonb,
  "zhyjbncs_jsztz" numeric,
  "cqywdw" jsonb DEFAULT '[]'::jsonb,
  "ywtr" jsonb DEFAULT '[]'::jsonb,
  "ywtrqd" jsonb DEFAULT '[]'::jsonb,
  "cybmpy" int4 DEFAULT 3,
  "dzcun" varchar(50) COLLATE "pg_catalog"."default",
  "zdzz_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncslx_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "bncsdj_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "rdhzgbm_qtsm" varchar(500) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "dwmc_wyhc" varchar COLLATE "pg_catalog"."default",
  "mgeom_wyhc" "public"."geometry",
  "address_wyhc" varchar(500) COLLATE "pg_catalog"."default",
  "dgeom_wyhc" "public"."geometry",
  "sm_wyhc" varchar(255) COLLATE "pg_catalog"."default",
  "bm" varchar(100) COLLATE "pg_catalog"."default",
  "dmlx_str" varchar(100) COLLATE "pg_catalog"."default",
  "xtbs" int2 DEFAULT 1,
  "tbr_str" varchar(100) COLLATE "pg_catalog"."default",
  "dwfzr_str" varchar(100) COLLATE "pg_catalog"."default",
  "tjfzr_str" varchar(100) COLLATE "pg_catalog"."default",
  "tbrq_str" timestamp(6) DEFAULT now(),
  "lxdh_str" varchar(100) COLLATE "pg_catalog"."default",
  "sfxz" varchar(1024) COLLATE "pg_catalog"."default",
  "sjbs" varchar(1024) COLLATE "pg_catalog"."default",
  "cwxx" varchar(1024) COLLATE "pg_catalog"."default",
  "yjbncssnmj_str" varchar(1024) COLLATE "pg_catalog"."default",
  "bnsrnrs_str" varchar(1024) COLLATE "pg_catalog"."default",
  "zhyjbncs_jsztz_str" varchar(1024) COLLATE "pg_catalog"."default",
  "bnszdzmj_str" varchar(1024) COLLATE "pg_catalog"."default",
  "syndjnjjzyazrc_str" varchar(1024) COLLATE "pg_catalog"."default",
  "rcwhhglrysl_str" varchar(1024) COLLATE "pg_catalog"."default",
  "zzwhhglrys_str" varchar(1024) COLLATE "pg_catalog"."default",
  "zhyjbncs_syndqycs_str" varchar(1024) COLLATE "pg_catalog"."default",
  "rdbm_str" varchar(1024) COLLATE "pg_catalog"."default",
  "zgdw_str" varchar(1024) COLLATE "pg_catalog"."default",
  "jsdw_str" varchar(1024) COLLATE "pg_catalog"."default",
  "ywtrqd_str" varchar(1024) COLLATE "pg_catalog"."default",
  "zdzz_str" varchar(1024) COLLATE "pg_catalog"."default",
  "bncslx_str" varchar(1024) COLLATE "pg_catalog"."default",
  "bnsc_str" varchar(1024) COLLATE "pg_catalog"."default",
  "snswlx_str" varchar(1024) COLLATE "pg_catalog"."default",
  "bzbsgfx_str" varchar(1024) COLLATE "pg_catalog"."default",
  "wzcb_str" varchar(1024) COLLATE "pg_catalog"."default",
  "yjss_str" varchar(1024) COLLATE "pg_catalog"."default",
  "ghqk_str" varchar(1024) COLLATE "pg_catalog"."default",
  "cqywdw_str" varchar(1024) COLLATE "pg_catalog"."default",
  "ywtr_str" varchar(1024) COLLATE "pg_catalog"."default",
  "zhyjbncs_jchgpsj_str" varchar(1024) COLLATE "pg_catalog"."default",
  "address_str" varchar(1024) COLLATE "pg_catalog"."default",
  "jsbz_str" varchar(1024) COLLATE "pg_catalog"."default",
  "dwmc_str" varchar(1024) COLLATE "pg_catalog"."default",
  "bnsc_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "snswlx_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "bzbsgfx_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "wzcb_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "yjss_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "rdbm_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "zgdw_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "jsdw_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "ghqk_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "cqywdw_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "ywtr_qtsm" varchar(1024) COLLATE "pg_catalog"."default",
  "ywtrqd_qtsm" varchar(1024) COLLATE "pg_catalog"."default"
)
;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_temp" OWNER TO "postgres";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."dwmc" IS '单位名称';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."shzt" IS '（1待审核、2审核通过、3审核不通过）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."sjly" IS '数据来源（1：导入，2：采集，3：填报）默认3';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."rgbjly" IS '人工驳回理由';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."cjrid" IS '创建人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."gxrid" IS '更新人id';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."cjsj" IS '创建时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."gxsj" IS '更新时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."code" IS '代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."dzsheng" IS '地址省';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."dzshi" IS '地址市';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."dzxian" IS '地址县';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."dzxiang" IS '地址乡';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."dzjh" IS '地址街号';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."flbm" IS '分类编码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."address" IS '单位地址';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."shlczt" IS '审核流程状态';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."tyshxydm" IS '统一社会信用代码';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."shlcztpc" IS '审核流程状态（待上报5、参与部门已上报4、县级已上报3、市级已上报2、省级已上报1、最终审核0）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."dgeom" IS '点位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."mgeom" IS '面位置';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."dwfzr" IS '单位负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."tjfzr" IS '统计负责人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."tbr" IS '填表人';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."lxdh" IS '联系电话';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."tbrq" IS '填表时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."hczt" IS '核查状态0否1是';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."sjzt" IS '数据状态（1正常数据2废除数据3疑问标记数据）';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."zdzz" IS '避灾种类';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."bncslx" IS '应急避难场所建设类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."bnsc" IS '避难时长';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."snswlx" IS '室内/室外类型';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."bnszdzmj" IS '应急避难场所占地总面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."yjbncssnmj" IS '应急避难场所室内面积';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."bnsrnrs" IS '避难所容纳人数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."bzbsgfx" IS '标志标识规范性';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."wzcb" IS '物资储备';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."yjss" IS '应急设施';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."rcwhhglrysl" IS '日常维护或管理人员数量';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."zzwhhglrys" IS '其中：专职维护或管理人员数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."zhyjbncs_syndqycs" IS '上一年度启用次数';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."syndjnjjzyazrc" IS '上一年度接纳紧急转移安置人次';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."rdbm" IS '认定部门';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."zgdw" IS '主管单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."jsdw" IS '建设单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."zhyjbncs_jchgpsj" IS '建成（或挂牌）时间';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."jsbz" IS '建设标准';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."ghqk" IS '规划情况';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."zhyjbncs_jsztz" IS '建设总投资';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."cqywdw" IS '产权/运维单位';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."ywtr" IS '运维投入';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_yjbncs_temp"."ywtrqd" IS '运维投入渠道';

COMMENT ON TABLE "public"."zhjzzy_zfzhjzzy_yjbncs_temp" IS '综合减灾资源-政府综合减灾资源-应急避难场所调查表';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc"."zxzdghdsj" IS '';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc"."ya1_zdhzxxddsj" IS '';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc"."ya2_zdhzxxddsj" IS '';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc"."ya3_zdhzxxddsj" IS '';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc"."zxzdghdsj" IS '';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc"."ya1_zdhzxxddsj" IS '';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc"."ya2_zdhzxxddsj" IS '';

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc"."ya3_zdhzxxddsj" IS '';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zfzhglnl_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ALTER COLUMN "syndjjcdpjxysj" TYPE numeric USING "syndjjcdpjxysj"::numeric;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ALTER COLUMN "syndjjcdsgpjczsj" TYPE numeric USING "syndjjcdsgpjczsj"::numeric;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ALTER COLUMN "syndjjcdpjxysj" TYPE numeric USING "syndjjcdpjxysj"::numeric;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ALTER COLUMN "syndjjcdsgpjczsj" TYPE numeric USING "syndjjcdsgpjczsj"::numeric;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ALTER COLUMN "syndjjcdpjxysj" TYPE numeric USING "syndjjcdpjxysj"::numeric;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ALTER COLUMN "syndjjcdsgpjczsj" TYPE numeric USING "syndjjcdsgpjczsj"::numeric;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ALTER COLUMN "syndjjcdpjxysj" TYPE numeric USING "syndjjcdpjxysj"::numeric;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ALTER COLUMN "syndjjcdsgpjczsj" TYPE numeric USING "syndjjcdsgpjczsj"::numeric;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_temp" ALTER COLUMN "syndjjcdpjxysj" TYPE numeric USING "syndjjcdpjxysj"::numeric;

ALTER TABLE "public"."zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb_temp" ALTER COLUMN "syndjjcdsgpjczsj" TYPE numeric USING "syndjjcdsgpjczsj"::numeric;

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ggwhcs_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zrzhczt_ggfwss_ggwhcs_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" DROP COLUMN "gmyxgygdzcjz";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" DROP COLUMN "gmyxgyzczj";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" DROP COLUMN "gmyxgyqbcyrynpjrs";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb" DROP COLUMN "qtcyzczj";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" DROP COLUMN "gmyxgygdzcjz";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" DROP COLUMN "gmyxgyzczj";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" DROP COLUMN "gmyxgyqbcyrynpjrs";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc" DROP COLUMN "qtcyzczj";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" DROP COLUMN "gmyxgygdzcjz";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" DROP COLUMN "gmyxgyzczj";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" DROP COLUMN "gmyxgyqbcyrynpjrs";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_fc_pc" DROP COLUMN "qtcyzczj";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ALTER COLUMN "dmlx" TYPE varchar(100) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_jczbtjb_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" DROP COLUMN "gmyxgygdzcjz";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" DROP COLUMN "gmyxgyzczj";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" DROP COLUMN "gmyxgyqbcyrynpjrs";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_pc" DROP COLUMN "qtcyzczj";

-- ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_temp" DROP COLUMN "gmyxgygdzcjz_str";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_temp" DROP COLUMN "gmyxgyqbcyrynpjrs_str";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_temp" DROP COLUMN "gmyxgyzczj_str";

ALTER TABLE "public"."zrzhczt_ggfwss_jczbtjb_temp" DROP COLUMN "qtcyzczj_str";



-- ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_lyjq_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zrzhczt_ggfwss_lyjq_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_spjysc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zrzhczt_ggfwss_spjysc_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zrzhczt_ggfwss_tgzsdshfwjg_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_tycg" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_tycg" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_tycg_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_tycg_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zrzhczt_ggfwss_tycg_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd_fc"."shztpc" IS '审核状态（1待处理、2通过 、3废除）默认1
';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xjfd_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zrzhczt_ggfwss_xjfd_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_xx" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zrzhczt_ggfwss_xx" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_xx" ALTER COLUMN "id" DROP DEFAULT;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx"."sjly" IS '数据来源（1：导入，2：pc新建，3：app新建）默认3';

ALTER TABLE "public"."zrzhczt_ggfwss_xx" ALTER COLUMN "gxsj" DROP DEFAULT;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx"."address" IS '学校（机构）详细地址';

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx"."hczt" IS '核查状态【hczt:    0:未核查  1：已核查（确认核查） 2：待审核（提交） 3：已审核 4：已驳回】';

ALTER TABLE "public"."zrzhczt_ggfwss_xx" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_xx" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_xx" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_xx" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_xx" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_xx_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" INHERIT "public"."data_jbxx_pc";

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" DROP CONSTRAINT "zrzhczt_ggfwss_xx_pc_pkey";

-- ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_xx_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_xx_pc" ADD CONSTRAINT "zrzhczt_ggfwss_xx_copy1_pkey1" PRIMARY KEY ("id");

-- ALTER TABLE "public"."zrzhczt_ggfwss_xx_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg" DROP COLUMN "jjcczsbyyl";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc" DROP COLUMN "jjcczsbyyl";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_fc_pc" DROP COLUMN "jjcczsbyyl";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_ylwsjg_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_pc" DROP COLUMN "jjcczsbyyl";

-- ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_ylwsjg_temp" DROP COLUMN "jjcczsbyyl_str";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" INHERIT "public"."data_jbxx";

-- ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" INHERIT "public"."data_jbxx_fc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ALTER COLUMN "gxsj" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs_fc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs_fc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs_fc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" INHERIT "public"."data_jbxx_fc_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs_fc_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs_fc_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs_fc_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ADD COLUMN "fcsj" timestamp(6) DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_fc_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" INHERIT "public"."data_jbxx_pc";

-- ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ALTER COLUMN "id" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "id"::varchar(100);

-- ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ALTER COLUMN "sjly" SET DEFAULT 2;

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ALTER COLUMN "cjsj" SET DEFAULT now();

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ALTER COLUMN "jgbm" TYPE varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ALTER COLUMN "shlcztpc" TYPE int8 USING "shlcztpc"::int8;

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ADD COLUMN "bj_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs_pc"."bj_wyhc" IS '外业核查-标记[0：默认；1存疑；2：缺失]';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ADD COLUMN "bjsm_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs_pc"."bjsm_wyhc" IS '外业核查-标记说明';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ADD COLUMN "shyj_wyhc" varchar(255) COLLATE "pg_catalog"."default";

COMMENT ON COLUMN "public"."zrzhczt_ggfwss_zjhdcs_pc"."shyj_wyhc" IS '外业核查-审核意见';

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ADD COLUMN "gid" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ADD COLUMN "hcrid_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ADD COLUMN "hcrmc_wyhc" varchar(255) COLLATE "pg_catalog"."default";

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ADD COLUMN "hcsj_wyhc" timestamp(6);

ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_pc" ADD COLUMN "sfcn_wyhc" varchar(2) COLLATE "pg_catalog"."default" DEFAULT 0;

-- ALTER TABLE "public"."zrzhczt_ggfwss_zjhdcs_shxx" ALTER COLUMN "sjid" TYPE varchar(100) COLLATE "pg_catalog"."default" USING "sjid"::varchar(100);

CREATE VIEW "public"."view_privs_role_func" AS  SELECT prf.roleid,
    prf.privsid,
    pf.id,
    pf.name,
    pf.description,
    pf.pid,
    pf.sytemid,
    pf.lev,
    pf.icon,
    pf.router,
    pf.index
   FROM ((privs_role pr
     LEFT JOIN privs_role_funcprivs prf ON (((pr.id)::text = (prf.roleid)::text)))
     LEFT JOIN privs_funcprivs pf ON (((prf.privsid)::text = (pf.id)::text)));

ALTER TABLE "public"."view_privs_role_func" OWNER TO "postgres";

ALTER TABLE "public"."zrzhczt_ggfwss_lyjq" INHERIT "public"."data_jbxx";
ALTER TABLE "public"."lszh_lszh_lsybzrzhsj" INHERIT "public"."data_jbxx";
ALTER TABLE "public"."lszh_lszh_lszdzhsj" INHERIT "public"."data_jbxx";
ALTER TABLE "public"."lszh_lszh_ndzrzh" INHERIT "public"."data_jbxx";
ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_hgyq" INHERIT "public"."data_jbxx";
ALTER TABLE "public"."zdyh_zrzhcsaqscsgyhss_wxhxpqy" INHERIT "public"."data_jbxx";
ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_dxks" INHERIT "public"."data_jbxx";
ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_ltks" INHERIT "public"."data_jbxx";
ALTER TABLE "public"."zdyh_zrzhcsfmkssgwxy_wkk" INHERIT "public"."data_jbxx";
ALTER TABLE "public"."zdyh_zrzhcsmksgwxy_mk" INHERIT "public"."data_jbxx";
ALTER TABLE "public"."zhjzzy_jczhjzzy_sqxzczhjzzynl" INHERIT "public"."data_jbxx";
ALTER TABLE "public"."zhjzzy_jczhjzzy_xzjdzhjzzynl" INHERIT "public"."data_jbxx";`;
// let sqlArr=updateSqlArr.split(";");
// let fisrtUpdateArr=[];
// let inheritUpdateArr=[];
// for(const sqlItem of sqlArr){
	
// 	if(sqlItem.indexOf("INHERIT")!='-1'){
// 	   inheritUpdateArr.push(sqlItem);
// 	}else{
// 		fisrtUpdateArr.push(sqlItem);
// 	}
	
	
// }
// //console.log(inheritUpdateArr.length,fisrtUpdateArr.length	);
// this.textarea= fisrtUpdateArr.join(";");





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

