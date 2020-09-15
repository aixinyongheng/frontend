<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>流程信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table
        :data="data"
        border
        class="table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="id" label="流程定义id" sortable width="150"></el-table-column>
        <el-table-column prop="name" label="名称" width="120"></el-table-column>
        <el-table-column prop="key" label="key" width="120"></el-table-column>
        <el-table-column prop="deployid" label="部署id" width="120"></el-table-column>
        <el-table-column prop="version" label="版本" width="120"></el-table-column>
         <el-table-column prop="resourceName" label="resourceName" width="150"></el-table-column>
        <el-table-column prop="diagramResourceName" label="diagramResourceName" width="150"></el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-video-play"
              class="green"
              @click="showStartProcess(scope.$index, scope.row)"
            >启动</el-button>
            <el-button
              type="text warning"
              icon="el-icon-more"
              @click="showProcessPng(scope.$index, scope.row)"
            >查看流程图</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="datatotal"
        ></el-pagination>
      </div>
    </div>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      强制删除（级联）
      <el-radio v-model="isForceDelete" :label="true">是</el-radio>
      <el-radio v-model="isForceDelete" :label="false">否</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 启动流程选择人员框 -->
    <el-dialog title="提示" :visible.sync="startProcessVisible" width="500px" center>
      <el-radio-group v-model="startType" size="medium">
        <el-radio :label="true">最新版本启动</el-radio>
        <el-radio :label="false">当前版本启动</el-radio>
      </el-radio-group>
      <div class="del-dialog-cnt" v-if="startType">此操作将启动 {{processDefine.key}} 最新版的流程, 是否继续？</div>
      <div class="del-dialog-cnt" v-else>此操作将启动 {{processDefine.id}} 版的流程, 是否继续？</div>
     流程创建人：
      <el-select v-model="userId" placeholder="请选择">
        <el-option v-for="item in userList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="startProcessVisible = false">取 消</el-button>
        <el-button type="primary" @click="startProcess">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 流程图展示框 -->
     <el-dialog :visible.sync="processPicVisible" :show-close="false" width="80%">
      <div style="position:relative;overflow:auto">
        <img ref="imga" :src="processPngURL" />
       </div>
    </el-dialog>
  </div>
</template>

<script>
import { processClient } from "../../../httpClient";
import { mapGetters, mapActions, mapMutations } from "vuex";
import * as TYPES from "@/vuex/stores/process/mutation-types.js";
export default {
  name: "processtable",
  data() {
    return {
      url: "./static/vuetable.json",
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      startProcessVisible: false,
      startType: true,
      idx: -1,
      datatotal: 0,
      userId: "",
      userList: [
        {
          ID: "选项1",
          NAME: "黄金糕"
        }
      ],
      processDefine: {},
      isForceDelete:false,
      processPicVisible:false
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    data() {
      return this.tableData;
    }
  },
  methods: {
    ...mapActions({
      _findProcessDefinitions:TYPES.findProcessDefinitions,
    }),
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    //查看流程图
    showProcessPng(index,row){
      //alert(this.tableData[index]);

      
      window.open(window.processServiceURL+"/file/showProcessPng?deployId="+this.tableData[index].deployid+"&diagramResourceName="+this.tableData[index].diagramResourceName);
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this._findProcessDefinitions({curpage:this.cur_page,pagesize:10}).then(res=>{
          var result = JSON.parse(res);
                if (result.status == 0) {
                  this.$message({
                    type: "success",
                    message: `获取流程信息成功`
                  });
                  this.datatotal = result.data.total;
                  this.tableData = result.data.list;
                } else {
                  this.$message({
                    type: "error",
                    message: `服务出错`
                  });
                }
      })
      // processClient.invoke("findProcessDefinitions", [this.cur_page, 10]).then(res => {
      //   var result = JSON.parse(res);
      //   if (result.status == 0) {
      //     this.$message({
      //       type: "success",
      //       message: `获取流程信息成功`
      //     });
      //     this.datatotal = result.data.total;
      //     this.tableData = result.data.list;
      //   } else {
      //     this.$message({
      //       type: "error",
      //       message: `服务出错`
      //     });
      //   }
      // });
    },
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    showStartProcess(index, row) {
      this.$store.dispatch("getUserList", [null,null,null]).then(res => {
        var result = JSON.parse(res);
        if (result.status == 0) {
          this.userList = result.data.list;
        } else {
          this.$message({
            type: "error",
            message: "服务器忙!"
          });
        }
      });
      // processClient.invoke("getUserList", [null, null, null]).then(res => {
      //   var result = JSON.parse(res);
      //   if (result.status == 0) {
      //     this.userList = result.data.list;
      //   } else {
      //     this.$message({
      //       type: "error",
      //       message: "服务器忙!"
      //     });
      //   }
      // });
      const item = this.tableData[index];
      this.processDefine = item;
      this.startProcessVisible = true;
    },
    startProcess() {
      var funname = "";
      if (this.startType) {
        funname = "startProcessByKey";
      } else {
        funname = "startProcessByProcessDefineID";
      }
      processClient.invoke(funname, [this.startType?this.processDefine.key:this.processDefine.id, this.userId]).then(res => {
        var result = JSON.parse(res);
        if (result.status == 0) {
          this.$message({
            type: "success",
            message: "流程启动成功!"
          });
          this.startProcessVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "服务器忙!"
          });
        }
      });
    },
    handleDelete(index, row) {
      this.idx = index;
      this.processDefine=this.tableData[index];
      this.delVisible = true;
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit() {
      this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
    },
    // 确定删除
    deleteRow() {
      processClient.invoke("deleteProcessDeployByID", [this.processDefine.deployid,this.isForceDelete]).then(res => {
        var result = JSON.parse(res);
        var result = JSON.parse(res);
          if (result.status == 0&&result.data==true) {
            this.tableData.splice(this.idx, 1);
            this.$message.success("删除成功");
            this.delVisible = false;
          }else{
            this.delVisible = false;
             this.$message.error("删除失败");
          }
        
      });
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  font-size: 14px;
}
.red {
  color: #ff0000;
}
</style>
