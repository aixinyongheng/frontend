<template>
  <div >
    <table>
      <tr>
        <td width="5%"><span style="width:80px; text-align:center; display:block; ">测试地址:</span></td>
        <td width="55%"><el-input v-model="hproserServerUrl" placeholder="请输入内容"></el-input></td>
        <td width="50%"><el-button @click="getHproseServerList">获取服务列表</el-button></td>
      </tr>
      <tr><td><span style="width:80px; text-align:center; display:block; ">方法名：</span></td><td> 
        <el-cascader style="width:100%;"
           ref="wodeceshi"
          :options="methodList"
          v-model="methodName"
          :props="props"
          clearable
          allow-create
          filterable
          >
      </el-cascader>
        </td><td></td></tr>
      <tr><td> <span style="width:80px; text-align:center; display:block; ">参数：</span></td><td> <div>
          <template v-for="count in paramCount">
         <div :key="count*100">
           {{methodsDZ[methodName].cslb[count-1].csmc}}: <el-input style="width:70%" :placeholder="methodsDZ[methodName].cslb[count-1].scsm" v-model="param[count-1]" :key="count"></el-input>
         </div>
            <!-- <i
              :key="count"
              @click="param.splice(count-1,1);paramCount--"
              style="color:blue;font-size:25px;"
              class="el-icon-lx-move"
            ></i> -->
          </template>
          <!-- <i @click="paramCount++" style="color:red;font-size:25px;" class="el-icon-lx-add"></i> -->
        </div>
        </td><td>
           <el-button @click="runHproseTest">运行</el-button>
          </td>
          </tr>
    <tr><td> <span style="width:80px; text-align:center; display:block; ">结果：</span>
      </td><td colspan="2"><el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="resultData"
          rows="30"
          show-word-limit
        ></el-input>
      </td>
      </tr>
    </table>

  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import * as TYPES from "@/vuex/stores/hproseTest/mutation-types.js";
let id = 0;
export default {
  name: "HproseServerTest",
  data() {
    return {
      paramCount: 0,
      param: [],
      hproserServerUrl: "http://localhost:8084/HproseServer",
      methodList:[{label:'1',value:'1',children:[{label:'11',value:'11',disabled:true,children:[{label:'111',value:'111'}]}]},{label:'12',value:'12',children:[{label:'121',value:'121',children:[{label:'1211',value:'1211'}]}]}],
      methodName: '',
      resultData: null,
      hproseMethodData:[],
      props:{ 
          emitPath:false,multiple: true, checkStrictly: true 
          },
         
          //方法参数对照表
      methodsDZ:{},
      hproseClient:null
    };
  },
  methods: {
//vuex
...mapActions({
      _getHproseServiceList:TYPES.getServiceList,//获取hprose服务列表
      _runHproseMehtod: TYPES.runHproseMehtod//执行hprose服务
    }),
    getHproseServerList(){
      console.log(this.$refs.wodeceshi,this.$refs.wodeceshi.getCheckedNodes()) ;
      console.log(this.methodName);
      this.hproseClient= new hprose.HttpClient(this.hproserServerUrl);
      this.hproseClient.invoke("getServiceList").then(data=>{
        this.hproseMethodData=data
         this.$message({
              type: "success",
              message: `获取成功`
            });
      }).catch(e=>{
         this.$message({
              type: "error",
              message: `获取失败`
            });
      });
      // this._getHproseServiceList().then(data=>{
      //   this.hproseMethodData=data
      //    this.$message({
      //         type: "success",
      //         message: `获取成功`
      //       });
      // })
      // .catch(function(){
      //   this.$message({
      //         type: "error",
      //         message: `获取服务失败`
      //       });
      // });
    },
    handleSelect(item) {
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
    }, //执行测试方法
    runHproseTest() {//打印参数
    console.log(this.param);
     if (this.methodName!=null&&this.methodName!=""){
         this.hproseClient.invoke(this.methodName,this.param).then(res=>{
         var result ="";
         if(typeof(res)=="string") {
           result=res;
         }
         else if(typeof(res)=="object"){
           result=JSON.stringify(res)
         }
         this.resultData = result
         this.$message({
              type: "success",
              message: `获取成功`
            });
      })
      // this._runHproseMehtod({method:this.methodName,param:this.param}).then(res=>{
      //    var result ="";
      //    if(typeof(res)=="string") {
      //      result=res;
      //    }
      //    else if(typeof(res)=="object"){
      //      result=JSON.stringify(res)
      //    }
      //      this.resultData = result
      //       this.$message({
      //         type: "success",
      //         message: `获取成功`
      //       });
      //   });
        }else{
           this.$message({
              type: "warning",
              message: `请选择方法名`
            });
        }
      // const client = new hprose.HttpClient(this.hproserServerUrl); 
      // client
      //   .invoke(this.methodName, this.param)
      //   .then(res => {
      //    var result ="";
      //    if(typeof(res)=="string") {
      //      result=res;
      //    }
      //    else if(typeof(res)=="object"){
      //      result=JSON.stringify(res)
      //    }
      //      this.resultData = result
      //       this.$message({
      //         type: "success",
      //         message: `获取成功`
      //       });
      //   })
      //   .catch(e => {
      //     alert(e);
      //       this.resultData = reuslt;
      //       this.$message({
      //         type: "error",
      //         message: `出错了`
      //       });
      //   });
    }
  }
  ,mounted(){
     console.log((new Date()).valueOf());
  },
  watch:{
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
      console.log("对照表",this.methodsDZ);
      this.$nextTick(function(){
        this.methodList=resultArr;
      });
    },
     methodName:function(newvalue,oldvalue){
       if(newvalue==""||newvalue==null){
         this.paramCount=0;
       }else{
         this.paramCount= this.methodsDZ[newvalue].cslb.length   //参数个数 
         this.param.length=this.paramCount//给参数赋默认值
         for(var i in this.paramCount){
           this.param[i]=""
         }
       }
    }
  }
};
</script>

<style scoped >
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
.my-autocomplete li .name {
  text-overflow: ellipsis;

}
.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete li .highlighted .addr {
  color: #ddd;
}
</style>
