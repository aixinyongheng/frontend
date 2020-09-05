<template>
  <div>
    <table>
      <tr><td>测试地址:</td><td><el-input v-model="hproserServerUrl" placeholder="请输入内容"></el-input></td><td><el-button @click="runHproseTest">运行</el-button></td></tr>
      <tr><td>方法名：</td><td> <el-autocomplete
          popper-class="my-autocomplete"
          v-model="methodName"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
        ></td><td><i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick"></i></td></tr>
      <tr></tr>
    </table>
    <el-row :gutter="24">
     
      <el-col :span="10">
       
       
          
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
            <span class="addr">{{ item.menthodBZ }}</span>
          </template>
        </el-autocomplete>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        参数：
        <div>
          <template v-for="count in paramCount">
            <el-input style="width:70%" v-model="param[count-1]" :key="count*100"></el-input>
            <i
              :key="count"
              @click="param.splice(count-1,1);paramCount--"
              style="color:blue;font-size:25px;"
              class="el-icon-lx-move"
            ></i>
          </template>
          <i @click="paramCount++" style="color:red;font-size:25px;" class="el-icon-lx-add"></i>
        </div>
      </el-col>
    </el-row>
    <el-button @click="runHproseTest">运行</el-button>
    <el-row :gutter="24">
      <el-col :span="24">
        结果：
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="resultData"
          rows="30"
          show-word-limit
        ></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
let id = 0;
export default {
  name: "HproseServerTest",
  data() {
    return {
      paramCount: 0,
      param: [],
      hproserServerUrl: "http://localhost:8084/HproseServer",
      methodName: "",
      resultData: null,
      restaurants: [
        { value: "getXZQHTree", menthodBZ: "获取行政区划树" },
        { value: "getXZQHList", menthodBZ: "获取行政区划列表" }
      ]
    };
  },
  watch: {
    // inputParam: function (newvalue, oldvalue) {
    //   this.param = JSON.parse(newvalue)
    // },
    // param: function (newValue, oldvalue) {
    //   this.inputParam = JSON.stringify(newValue)
    // }
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
    }, //执行测试方法
    runHproseTest() {
      const client = new hprose.HttpClient(this.hproserServerUrl); //通讯录
      client
        .invoke(this.methodName, this.param)
        .then(res => {
          var result = JSON.parse(res);
          if (result.status == 0) {
            this.resultData = res;
            this.$message({
              type: "success",
              message: `获取成功`
            });
          } else {
            this.$message({
              type: "error",
              message: `服务出错`
            });
          }
        })
        .catch(e => {
          //扑捉错误
          alert(e);
        });
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
  overflow: hidden;
}
.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete li .highlighted .addr {
  color: #ddd;
}
</style>
