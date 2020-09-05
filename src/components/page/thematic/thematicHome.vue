<template>
  <div>
    <div class="thematicMap" id="aftermap"></div>
    <div class="thematicMap" id="thematicMapDiv">
      <el-button-group style="position:absolute;right:50px; z-index:11;top:10px;">
        <!-- <el-button size="small" icon="el-icon-share">分享</el-button> -->
        <el-button size="small" @click="printerThematicMap" icon="el-icon-printer">打印</el-button>
        <el-button size="small" icon="el-icon-clear" @click="clearEchartInstantAndPoint">清除</el-button>
        <el-button size="small" icon="el-icon-delete" @click="zoomExtent">全图</el-button>
         <el-button @click="downloadThematic">下载专题示例</el-button>
      </el-button-group>
    </div>
    <div class id="comparmap"></div>
    <!-- 左侧专题列表 -->
    <div class="leftPanel">
      <div class="leftHeader">专题数据</div>
      <!-- <el-button >添加专题</el-button> -->
      <div class="addThematicBtn" @click="theboxdialog=1">新建专题</div>
      <!-- <el-button @click="swipperTest">卷帘</el-button> -->
      <!-- <el-button @click="test">切换横竖屏</el-button> -->
      <div
        v-for="item in thematicList"
        :key="item.ID"
        @click="theboxdialog=2;currentThematic=item;thematic_id=item.ID;getThematicColumn();"
        style="cursor:pointer;"
        class="thematicItem"
      >
        <span>{{item.THEMATIC_NAME}}</span>
        <el-dropdown
          trigger="hover"
          style="position: absolute;right: 5px;"
          @command="thematicDetailhandleCommand"
        >
          <span class="el-dropdown-link">
            <i class="iconfont icon-xiangqing" style="font-size:20px;" v-on:click.stop="doNothing"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix" :command="{type:1,thematic_id:item.ID}">删除</el-dropdown-item>
            <!-- <el-dropdown-item class="clearfix" :command="{type:2,thematic_id:item.ID}">编辑</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="thebox_upload" v-if="theboxdialog==1">
      <div class="thebox_upload_header">
        <span>上传专题</span>
        <i
          class="el-icon-close"
          style="float: right;color: #004ea2;cursor:pointer;margin-top:4px;"
          @click="theboxdialog=0"
        ></i>
      </div>
      <div style="margin:5px;"></div>
      <el-divider style="height:2px;"></el-divider>
      <div style="line-height:50px;font-size:14px;clear: both; width:100%;height: 50px; ">
        <span style="float: left;  width: 74px;">专题名称：</span>
        <el-input style="float: left;width: 100px;" v-model="thematicForm.thematicName"></el-input>
      </div>
      <el-upload
        style="line-height:50px;height:50px;"
        class="upload-demo"
        ref="uploadThematic"
        :action="uploadthematicUrl"
        :disabled="thematicForm.thematicName==null||thematicForm.thematicName==''"
        :auto-upload="false"
        :limit="1"
        :on-exceed="handleExceed"
        :on-success="thematicSubmitSuccess"
        :data="thematicForm"
      >
        <el-button
          slot="trigger"
          size="small"
          :disabled="thematicForm.thematicName==null||thematicForm.thematicName==''"
          type="primary"
        >选取文件</el-button>
        <span
          v-if="thematicForm.thematicName==null||thematicForm.thematicName==''"
          style="color:red;font-size:10px;"
        >请输入专题</span>
      </el-upload>
      <div style="margin:50px;"></div>
      <div>
        <el-button style="margin-left:32px;" @click="theboxdialog=0">取消</el-button>
        <el-button @click="doUploadThematic">确定</el-button>
      </div>
    </div>
    <div class="thebox_upload" v-if="theboxdialog==2">
      <div class="thebox_upload_header">
        <span>选择统计字段</span>
        <i
          class="el-icon-close"
          style="float: right;color: #004ea2;cursor:pointer;margin-top:4px;"
          @click="theboxdialog=0"
        ></i>
      </div>
      <div style="margin:5px;"></div>
      <el-divider style="height:2px;"></el-divider>
        <span style="  line-height: 50px; font-size: 14px; width: 100%; height: 50px;">专题名称：</span>
        <span style="height:30px;line-height:30px;"> {{currentThematic.THEMATIC_NAME}}</span>
      <div style="line-height:50px;font-size:14px;clear: both; width:100%;height: 50px; ">
        <span >选择统计字段：</span>
      </div>
      <el-select v-model="columnValues" multiple placeholder="请选择">
        <el-option
          v-for="item in columnOptions"
          :key="item.ID"
          :label="item.COLUMN_NAME"
          :value="item.COLUMN_INDEX"
        ></el-option>
      </el-select>
     
      <div style="position:absolute;bottom:10px;">
        <el-button style="margin-left:32px;" @click="theboxdialog=0">取消</el-button>
        <el-button @click="nextData">确定</el-button>
      </div>
    </div>
    <div class="thebox_upload" v-if="theboxdialog==3">
      <div class="thebox_upload_header">
        <span>统计结果</span>
        <i
          class="el-icon-close"
          style="float: right;color: #004ea2;cursor:pointer;margin-top:4px;"
          @click="theboxdialog=0"
        ></i>
      </div>
      <table>
        <tr>
          <td v-for="(value, key) in thematicHeader" :key="key">{{value}}</td>
        </tr>
        <tr v-for="(item,index) in thematicdata" :key="index">
          <td v-for="(value1,key2) in item" :key="key2">{{value1}}</td>
        </tr>
      </table>
      <!-- {{this.thematicdata}} -->
      <hr />
      <!-- {{this.thematicHeader}} -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import html2canvas from 'html2canvas';
export default {
  data() {
    return {
      theboxdialog: 0,
      uploadthematicUrl: uploadthematicUrl,
      thematicForm: { thematicName: "" },
      thematic_id: "",
      currentThematic:{THEMATIC_NAME:""},
      thematicList: [],
      columnOptions: [],
      columnValues: null,
      thematicdata: [],
      thematicHeader: [],
      map: null,
      param: {},
      afterMap: null,
      echartInitLists: [],
      echartMapPoints: []
    };
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    doUploadThematic() {
      this.$refs.uploadThematic.submit();
    },
    downloadThematic() {
      window.location.href = window.dbServiceUrl + "thematicexcel.xlsx";
    },
    //专题上传成功
    thematicSubmitSuccess(response) {
      if (response.status == 0) {
        this.$message({
          message: "上传成功",
          type: "success"
        });
        this.theboxdialog = 2;
        //专题id
        this.thematic_id = response.data[0].thematic_id;
        console.log(this.thematic_id);
        this.getThematicList();
        var param = { thematic_id: this.thematic_id };
        //通过专题id,获取列（除了行政区划）
        this.$store.dispatch("getThematicColumn", param).then(resultdata => {
          var result = JSON.parse(resultdata);
          console.log(resultdata);
          this.columnOptions = result.data;
        });
      }
    },

    //获取上传的专题
    getThematicList() {
      var param = {
        pageNum: null,
        pageSize: null,
        type: null,
        userid: "fb5181f5-314b-4e39-ac0f-5fd098944639",
        isMine: null,
        deptId: null,
        keyword: null,
        conds: null
      };
      this.$store.dispatch("getThematicList", param).then(resultdata => {
        var result = JSON.parse(resultdata);
        this.thematicList = result.data.list;
      });
    },
    //通过专题id获取列
    getThematicColumn() {
      var param = { thematic_id: this.thematic_id };
      //通过专题id,获取列（除了行政区划）
      this.$store.dispatch("getThematicColumn", param).then(resultdata => {
        var result = JSON.parse(resultdata);
        this.columnOptions = result.data;
      });

      this.clearEchartInstantAndPoint();
    },
    //加载专题图
    nextData() {
      var param = {
        thematic_id: this.thematic_id,
        column_ids: this.columnValues.join(",")
      };
      this.$store.dispatch("getThematicData", param).then(resultdata => {
        //this.theboxdialog = 3;
        this.theboxdialog = 0;
        var result = JSON.parse(resultdata);
        this.thematicHeader = result.data.shift();
        this.thematicdata = result.data;
        this.addThematicEchartLayer();
      });
    },
    //加载专题图层（默认扇形图）
    addThematicEchartLayer() {
      //销毁echartLists
      this.clearEchartInstantAndPoint();
      var _this = this;
      this.thematicdata.forEach(element => {
        var geojson = JSON.parse(element.GEOJSON);
        var el1 = document.createElement("div");
        el1.id = "thematicchart" + element.XZQH;
        el1.style = "height:100px;width:100px;";
        _this.echartMapPoints.push(
          new mapboxgl.Marker(el1, { offset: [-50 / 2, -50 / 2] })
            .setLngLat([
              geojson.geometry.coordinates[0],
              geojson.geometry.coordinates[1]
            ])
            .addTo(this.map)
        );
        //处理统计字段
        var data = [];
        console.log("thematicHeader", _this.thematicHeader);
        Object.keys(_this.thematicHeader).forEach(key => {
          if (key.indexOf("BZ") != -1) {
            data.push({ name: _this.thematicHeader[key], value: element[key] });
          }
        });
        var option1 = {
          tooltip: {
            trigger: "item",
            formatter: "{a}<br/>{b} : {c} ({d}%)"
          },
          series: {
            name: element.XZQHMC,
            type: "pie",
            data: data,
            radius: "50%",
            center: ["50%", "50%"],
            label: {
              normal: {
                position: "inner",
                fontSize: 10
              }
            }
          }
        };
        this.echartInitLists.push(
          _this.initEchart("thematicchart" + element.XZQH, option1)
        );
      });
    },
    // //切换横纵向
    // test() {
    //   //mapboxgl-compare mapboxgl-compare-horizontal      compare-swiper-horizontal        compare-swiper-vertical  mapboxgl-compare
    //   document.querySelector(".compare-swiper-horizontal").className =
    //     "compare-swiper-vertical";
    //   document.querySelector(
    //     ".mapboxgl-compare.mapboxgl-compare-horizontal"
    //   ).className = "mapboxgl-compare";
    //   window.compareMap._bounds = this.afterMap
    //     .getContainer()
    //     .getBoundingClientRect();
    //   document.querySelector(".mapboxgl-swipe").style.width =
    //     window.compareMap._bounds.width + "px";
    //   var swiperPosition =
    //     (window.compareMap._horizontal
    //       ? window.compareMap._bounds.height
    //       : window.compareMap._bounds.width) / 2;
    //   window.compareMap._setPosition(swiperPosition);
    // },
     swipperTest() {
      this.afterMap = new mapboxgl.Map({
        container: "aftermap",
        //style: "mapbox://styles/mapbox/dark-v10"
      });
      var _this=this;
      this.afterMap.on("load",function(){
        var url="http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=tttyt&STYLE=default&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}";
              _this.addRasterLayer({url:url,id:"testid",visible:true});
      })
      
      var container = "#comparmap";
      this.param = {
        orientation: "horizontal", //veti
        mousemove: false
      };
      window.compareMap = new mapboxgl.Compare(
        this.map,
         this.afterMap,
        container,
        this.param
      );
      // setTimeout(() => {
      //  //this.map.removeLayer('state-data')
      
  
      // }, 500);

    },
    //加载影像服务
    addRasterLayer({
        url,
        id,
        minzoom = 0,
        maxzoom = 22,
        visible = true
    }) {
        //if (this.afterMap.getLayer(id)) return;
        this.afterMap.addLayer({
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
    initEchart(id, options) {
      var mychart = echarts.init(document.getElementById(id));
      mychart.setOption(options);
      return mychart;
    },
    //清除点及echart
    clearEchartInstantAndPoint() {
      this.echartInitLists.forEach(echartItem => {
        echartItem.dispose();
      });
      this.echartMapPoints.forEach(pointItem => {
        pointItem.remove();
      });
    },
    zoomExtent(){
     // console.log(JSON.stringify(this.map.getBounds())  )
      this.map.fitBounds([[49.09154119176094, 6.061765937283539], [137.4777801194063, 53.93690070273635]])
      
    },
    //删除专题
    deleteThematic(thematic_id) {
      var param = {
        thematic_id: thematic_id
      };
      this.$store.dispatch("deleteThematics", param).then(resultdata => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getThematicList();
      });
    },
    thematicDetailhandleCommand(command) {
      if (command.type == 1) {
        //删除
        //确定是否删除
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteThematic(command.thematic_id);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else if (command.type == 2) {
        //编辑
      }
    },
    //打印地图（截图）
    printerThematicMap() {
 var extent= document.querySelector("#thematicMapDiv");
       //this.imagedialogVisible = true;
      html2canvas(extent, {
        backgroundColor: null
      }).then(canvas => {
        let dataURL = canvas.toDataURL('image/png');
        this.dataURL = dataURL;
          var alink = document.createElement('a');
        alink.href = this.dataURL;
        alink.download = "我的地图"; // 图片名
        alink.click();

      });


                    //   var options = {
                    //           useCORS: true
                    //         };
                    //         var _this=this;
                    // var extent= document.querySelector("#thematicMapDiv");
                    // html2canvas(document.body, options).then(function(canvas) {
                    //   // console.log(canvas, "canvas");
                    //   var imgBlob = canvas.toDataURL("image/jpeg", 1.0); //将图片转为base64, 0-1 表示清晰度
                    //   imgBlob=imgBlob.replace('image/png','image/octet-stream');
                    //   //imgBlob = imgBlob.toString().substring(imgBlob.indexOf(",") + 1); //截取base64以便上传
                    //   _this.pngbase=imgBlob;
                    // });
    },
    doNothing() {}
  },
  mounted() {
    this.getThematicList();
    mapboxgl.accessToken =
      "pk.eyJ1IjoieWFuZ3pob3VoYW8iLCJhIjoiY2ppbG9sMXJnMXc5YjNxbnhrOWl1bXppMyJ9.-JL3W32NYV_lHqsTUIGw9Q";
    //加载天地图底图
    //天地图（各个区域的token可以在网上查到）
    var vecUrl = "http://t0.tianditu.com/vec_w/wmts?tk=" + window.tdtToken;
    var cvaUrl = "http://t0.tianditu.com/cva_w/wmts?tk=" + window.tdtToken; //注记
    //使用严格模式
    ("use strict");
    //实例化source对象
    var tdtVec = {
      //类型为栅格瓦片
      type: "raster",
      tiles: [
        //请求地址
        vecUrl +
          "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles"
      ],
      //分辨率
      tileSize: 256
    };
    var tdtCva = {
      type: "raster",
      tiles: [
        cvaUrl +
          "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles"
      ],
      tileSize: 256
    };
    //实例化Map地图对象
    this.map = new mapboxgl.Map({
      //地图容器div的id
      container: "thematicMapDiv",
      style: {
        //设置版本号，一定要设置
        version: 8,
        //添加来源
        sources: {
          tdtVec: tdtVec,
          tdtCva: tdtCva
        },
        layers: [
          {
            //图层id，要保证唯一性
            id: "tdtVec",
            //图层类型
            type: "raster",
            //数据源
            source: "tdtVec",
            //图层最小缩放级数
            minzoom: 0,
            //图层最大缩放级数
            maxzoom: 17
          },
          {
            id: "tdtCva",
            type: "raster",
            source: "tdtCva",
            minzoom: 0,
            maxzoom: 17
          }
        ]
      },
      //地图中心点
      center: [111.679943564, 32.559617265],
      //地图当前缩放级数
      zoom: 4
    });
    //分屏 测试
   //this.swipperTest();
    //Remove - this will remove the compare control from the DOM and stop synchronizing the two maps.
    // compareMap.remove();
  },
  watch: {
    theboxdialog(newval, oldval2) {
      this.columnValues = [];
    }
  }
  // created(){
  //     bus.$on('collapse', msg => {
  //         this.collapse = msg;
  //     })
  // }
};
</script>
<style scoped>
body {
  background: lightblue;
}
.leftPanel {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 350px;
  height: 100%;
  z-index: 10;
  background: white;
}
.leftPanel .leftHeader {
  position: relative;
  line-height: 45px;
  display: inline-block;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  height: 45px;
  font-size: 20px;
  background-color: #09f;
  border-bottom: 1px solid #e6e6e6;
  color: #fff;
  text-align: center;
}
.leftPanel .addThematicBtn {
  position: absolute;
  width: 75%;
  height: 40px;
  bottom: 10px;
  left: 12.5%;
  text-align: center;
  background: #3f82e2;
  line-height: 40px;
  color: white;
  cursor: pointer;
}
.thebox_upload {
  width: 200px;
  height: 255px;
  top: 45px;
  left: 350px;
  position: absolute;
  z-index: 11;
  background: rgb(255, 255, 255);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  padding: 8px;
}
.thebox_upload .thebox_upload_header {
  height: 0px;
  padding: 5px 0px;
  text-align: left;
  font-size: 16px;
  border-radius: 3px;
  color:#09f;
}
.thematicMap {
  width: 100%;
  height: 100%;
  position: absolute;
}
.thematicItem {
  height: 26px;
  line-height: 26px;
  border: 1px solid #e2e5ea;
  padding: 5px;
  text-align: center;
  margin-bottom: 4px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.showLeftPanel{
    height: 30px;
    width: 16px;
    position: absolute;
    left: 0;
    top: 50%;
    padding-top: 12px;
    padding-left: 2px;
    background: hsla(0,0%,100%,.6);
    border: 1px solid #ddd;
    box-shadow: 1px 1px 1px rgba(0,0,0,.3);
    z-index: 1000;
}
</style>
