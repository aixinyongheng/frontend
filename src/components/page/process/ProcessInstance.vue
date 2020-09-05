<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>流程实例表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table :data="data" border class="table">
        <el-table-column prop="id" label="流程实例id" sortable width="150"></el-table-column>
        <el-table-column prop="processDefinitionId" label="流程定义id" width="150"></el-table-column>
        <el-table-column prop="processDefinitionKey" label="key" width="120"></el-table-column>
        <el-table-column prop="deploymentId" label="部署id" width="120"></el-table-column>
        <el-table-column prop="processDefinitionVersion" label="部署版本" width="120"></el-table-column>
        <el-table-column prop="processInstanceId" label="processInstanceId" width="120"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="152"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="152"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-more"
             
              @click="showProcessPng(scope.$index, scope.row)"
            >查看流程图</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
            <!--  v-if="scope.row.endTime != null" -->
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 流程图片显示框 -->
    <el-dialog :visible.sync="processPicVisible" :show-close="false" width="80%">
      <div style="position:relative;overflow:auto">
        <img ref="imga" :src="processPngURL" />
        <div
          v-for="item in processImgStyle"
          :key="item.id"
          style="position:absolute;border:2px solid red;"
          :style="item"
        ></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { processClient } from "../../../httpClient";
export default {
  name: "processInstance",
  data() {
    return {
      processImgStyle: [],
      dialogwidth: "0%",
      url: "./static/vuetable.json",
      tableData: [],
      cur_page: 1,
      delVisible: false,
      idx: -1,
      datatotal: 0,
      processInstance: {},
      processPicVisible: false,
      userList: [
        {
          ID: "选项1",
          NAME: "黄金糕"
        }
      ],
      processPngURL: ""
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
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取数据
    getData() {
      processClient
        .invoke("findProcessInstances", [this.cur_page, 10])
        .then(res => {
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
        });
    },
    //展示流程图
    showProcessPng(index, row) {
      this.idx = index;
      this.processInstance = this.tableData[index];
      console.log(this.processInstance);
      //通过流程实例id获取部署信息及当前节点
      processClient
        .invoke("showProcessPngState", [
          //this.processInstance.processDefinitionId,
          this.processInstance.processInstanceId
        ])
        .then(res => {
          var result = JSON.parse(res);
          if (result.status == 0 && result.data) {
            this.processPngURL =
              window.processServiceURL +
              "file/showProcessPng?deployId=" +
              result.data.deploymentId +
              "&diagramResourceName=" +
              result.data.diagramResourceName;
            this.processImgStyle = [];
            for (var index in result.data.list) {
              this.processImgStyle.push({
                width: result.data.list[index].width - 4 + "px",
                height: result.data.list[index].height - 4 + "px",
                top: result.data.list[index].y + "px",
                left: result.data.list[index].x + "px",
                "border-radius": "8px"
              });
            }
            console.log(this.processImgStyle);
            // this.$message.success("获取成功");
            // this.processImgStyle.width=(result.data.width-4)+"px";
            // this.processImgStyle.height=(result.data.height-4)+"px";
            // this.processImgStyle.left=result.data.x+"px";
            // this.processImgStyle.top=result.data.y+"px";
          } else {
            this.$message.error("获取失败");
          }
        });
      this.processPicVisible = true;
    },
    //删除
    handleDelete(index, row) {
      this.idx = index;
      this.processInstance = this.tableData[index];
      this.delVisible = true;
    },
    // 确定删除
    deleteRow() {
      processClient
        .invoke("deleteProcessInstance", [
          this.processInstance.processInstanceId
        ])
        .then(res => {
          var result = JSON.parse(res);
          if (result.status == 0 && result.data) {
            //this.tableData.splice(this.idx, 1);
            this.$message.success("删除成功");
            this.getData();
          } else {
            this.$message.error("删除失败");
          }
        });
      this.delVisible = false;
    }
  },
  watch: {}
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
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
/* 滚动条样式 */
::-webkit-scrollbar-track-piece {
  /* 滚动条的空白区域 */
  background-color: #f8f8f8;
  border-radius: 5%;
}
::-webkit-scrollbar {
  width: 9px;
  height: 9px;
  border-radius: 5%;
}
::-webkit-scrollbar-thumb {
  /* 滚动区域 */
  background-color: #dddddd;
  background-clip: padding-box;
  min-height: 28px;
}
::-webkit-scrollbar-thumb:hover {
  /* 滚动区域，鼠标移入样式 */
  background-color: #bbb;
  border-radius: 5%;
}
</style>
