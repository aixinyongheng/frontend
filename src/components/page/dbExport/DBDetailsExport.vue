<template>
<!-- <el-tabs></el-tabs> -->
  <div>

     <el-tabs v-model="activeName">
      <el-tab-pane label="导出数据库详细设计" name="first">
        <!-- 导出数据库详细设计文档工具 start -->
    <h1 style="text-align:center" font-family="Helvetica Neue">导出数据库详细设计文档工具</h1>
    <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="数据库类型">
    <el-select v-model="databaseType" placeholder="mysql/oracle/pgsql">
      <el-option label="mysql" value="0"></el-option>
      <el-option label="oracle" value="1"></el-option>
      <el-option label="pgsql" value="2"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="ip地址">
    <el-input v-model="form.ip" width="120px"></el-input>
  </el-form-item>
  <el-form-item label="端口号">
    <el-input v-model="form.port"></el-input>
  </el-form-item>
   <el-form-item label="数据库名">
    <el-input v-model="form.databaseName"></el-input>
  </el-form-item>
  <el-form-item label="用户名">
    <el-input v-model="form.username"></el-input>
  </el-form-item>
    <el-form-item label="密码">
    <el-input v-model="form.password"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">立即导出</el-button>
     <el-button type="primary" @click="onRegTest">正则验证</el-button>
  </el-form-item>
</el-form>

  <!--end  导出数据库详细设计文档工具 -->
      </el-tab-pane>
        <el-tab-pane label="导出hprose接口详情" name="second">
            <el-input v-model="hproserServerUrl" placeholder="请输入内容"></el-input>
            <el-button @click="getMethodsInfo">获取详细设计</el-button>
            <el-button @click="exportMethodsInfo" v-show="methodList.length>0">导出</el-button>
            <div style="overflow: auto;max-height:600px;">
         <div v-for="partitem,index in methodList">
           {{partitem.label}}:
          <table class="methodtable">
            <tr><td>接口名备注</td><td>接口名</td></tr>
            <tr v-for="methoditem in partitem.children"><td>{{methoditem.label}}</td><td>{{methoditem.value}}</td></tr>
          </table>
           </div>
      </div>

      </el-tab-pane>
     
      </el-tabs>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
//start hproseServer tab2
import * as TYPES from "@/vuex/stores/hproseTest/mutation-types.js";
//import * as TYPES from "../../../vendor/Export2Excel";

//end hproseServer tab2
export default {
  name: "DBDetailsExport",
  data() {
    return {
      databaseType:"0",
      form: {databaseType:this.databaseType,ip:"localhost",port:"3306",databaseName:"TDT_LDM",password:"123456",username:"root"},
      activeName:"first",
      //start hproseServer界面2
      hproserServerUrl:"http://localhost:8070/qxgl/HproseServer",
      hproseClient:null,
      hproseMethodData:[],
      methodList:[],
      methodsDZ:{}
      // end hproseServer界面2
    };
  },
  methods: {
    onSubmit(){
       const loading = this.$loading({
          lock: true,
          text: '下载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
       this.$store.dispatch("getDbDetailToWord", this.form).then(res => {
        var result = JSON.parse(res);
        if(result.status==0&&result.data!=null){
          window.location.href=window.dbServiceUrl+result.data; 
        }else{
          this.$message({
          message: '请输入正确的数据库连接',
          type: 'warning'
        });
        }
        loading.close(); 
       }).catch(e=>{
          loading.close(); 
       })
  },
  onRegTest(){
  var name= this.form.username;//需要验证的
    var regName = /^(?:[\u4e00-\u9fa5]+)(?:·[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/;
   
       
        if(!regName.test(name)){
            alert("×")
        }else{
            alert("√")
        }
  

  },
  //hoprsServer
  getMethodsInfo(){//获取方法名
  this.hproseClient= new hprose.HttpClient(this.hproserServerUrl);
      this.hproseClient.invoke("getServiceList").then(data=>{
        this.hproseMethodData=data
         this.$message({
              type: "success",
              message: `获取成功`
            });
            //整理数据，并展示再网页

      }).catch(e=>{
         this.$message({
              type: "error",
              message: `获取失败`
            });
      });
  },
  exportMethodsInfo(){
   require.ensure([], () => {　　　　　　　　
        const { export_json_to_excel } = require('../../../vendor/Export2Excel');　　//引入文    件　　　　　　
        const tHeader = ['接口备注', '接口姓名']; //将对应的属性名转换成中文　　　　　
        const filterVal = ['value', 'label'];//table表格中对应的属性名　　　　　 　　　
        //const list = [{label: '1001', value: '张三'}];　　// this.sels就是你想要导出的数据[{userName: '1001', realName: '张三'}]
        const list=this.methodList;
        var mydatalist=[];
        //整理需要下载的数据
        
      for(var item of this.methodList){
        mydatalist.push({label:"".label,value:""})
        mydatalist.push({label:item.label,value:""})
        if(item.children!=null){
          for(var methodItem of item.children){
             mydatalist.push(methodItem)
          }
        }
      }  
        const data = this.formatJson(filterVal, mydatalist);　　　　　　　　
        export_json_to_excel(tHeader, data, '接口详细说明');　　　　　　
    })
  },
   formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]));
   }
  },
  computed: {
    
  },
  mounted() {
    },
  watch:{
    // newgeojson:{
    //   handler: function (val, oldVal) {
    //     try{
    //        var json= JSON.parse(val);
    //        this.addGeoJson(json);
    //     }catch(e){
    //         console.log("请输入正确的geojson");
    //     }
          
    //   },
    //   deep: true,
    //   immediate: false
    // },
     databaseType:function(val){
       console.log(val);
       switch(val){
         case '0':
           this.form={databaseType:val,ip:'localhost',port:"3306",databaseName:"TDT_LDM",username:"root",password:"123456"};
           break;
         case '1':
           this.form={databaseType:val,ip:'localhost',port:"1521",databaseName:"ORCL",username:"yangzh",password:"123456"};
           break;
         case '2':
           this.form={databaseType:val,ip:'localhost',port:"5432",databaseName:"geoc",username:"postgres",password:"postgres"};
           break;
       }
     },
     //start  tab2 hproseServer
    hproseMethodData(newName, oldName) {
          var resultArr=new Array();
          for(var index in this.hproseMethodData){
              var methods= this.hproseMethodData[index].hslb
              var methodchildren=new Array;
              for(var index_method in methods){
                  methodchildren.push({label:methods[index_method].hsmccn,value:methods[index_method].hsmcen});
                  this.methodsDZ[methods[index_method].hsmcen]=methods[index_method]
              }
              resultArr.push({value:2,label:this.hproseMethodData[index].mkmc,children:methodchildren});
          
          }
          console.log("对照表:",this.methodsDZ);
          this.$nextTick(function(){
            this.methodList=resultArr;//methodList为含有模块的结构的List      [{"value":2,"label":"通用服务","children":[{"label":"获取公钥","value":"getPublicKey"},{"label":"通过表注释和ID查详情(编辑)","value":"getTableInfo"}]},{"value":2,"label":"基础服务","children":[{"label":"获取用户随机码","value":"getState"},{"label":"得到用户信息","value":"getUserInfo"}]}]
            console.log("metodList:",JSON.stringify(this.methodList));
          });
          
        },
        //end tab2 hproseServer
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
  widows: 100%;
  height: 100%;
}

.funcBtn {
  width: 150px;
  position: absolute;
  right: 10px;
  top: 20px;
  z-index: 20;
}
.funcBtn .itembtn {
  margin-top: 10px;
  margin-left: 10px;
}
.methodtable{
  border:solid 1px red!important;
}
.methodtable td{
  border:solid 1px blue!important;
}
</style>

