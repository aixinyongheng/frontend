<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>用户任务信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-radio-group v-model="isNeedDeel" size="medium" @change="getData">
          <el-radio-button :label="true">待办</el-radio-button>
          <el-radio-button :label="false">已办</el-radio-button>
        </el-radio-group>
        <span style="margin-left:10px;">
          模拟登陆用户：
          <el-select v-model="userId" placeholder="请选择" @change="getData">
            <el-option v-for="item in userList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
          </el-select>
        </span>
      </div>
      <el-table :data="tableData" border class="table">
        <el-table-column prop="id" label="taskId" sortable width="150"></el-table-column>
        <el-table-column prop="name" label="当前节点名称" width="120"></el-table-column>
        <!-- <el-table-column prop="taskdefinitionkey" label="taskdefinitionkey" width="150"></el-table-column> -->
        <el-table-column prop="assignee" label="assignee（用户id）" width="300"></el-table-column>
        <el-table-column v-if="isNeedDeel" prop="createtime" label="创建时间" width="200"></el-table-column>
        <el-table-column v-else prop="startTime" label="开始时间" width="200"></el-table-column>
        <el-table-column v-if="!isNeedDeel" prop="endTime" label="结束时间" width="200"></el-table-column>
        <el-table-column v-if="!isNeedDeel" prop="durationInMillis" label="持续时间" width="200"></el-table-column>
        <el-table-column prop="processDefinitionId" label="流程定义id" width="200"></el-table-column>
        <el-table-column prop="processInstanceId" label="流程实例id" width="200"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-lx-qrcode"
              class="green"
              v-if="isNeedDeel"
              @click="showFinishMyTask(scope.$index, scope.row)"
            >办理</el-button>
            <el-button
              type="text"
              icon="el-icon-lx-qrcode"
              class="green"
              @click="showProcessImg(scope.$index, scope.row)"
            >查看流程图</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              v-show="false"
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

    <!-- 完成自己任务提示框 -->
    <el-dialog title="提示" :visible.sync="finishMyTaskVisible" width="300px" center>
      <div class="del-dialog-cnt">确定完成自己的任务？</div>并将任务提交给：
      <el-select v-model="nextBLRID" placeholder="请选择" :clearable="true">
        <el-option v-for="item in userList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="finishMyTaskVisible = false">取 消</el-button>
        <el-button type="primary" @click="finishMyTask">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 流程图展示框 -->
    <el-dialog :visible.sync="processPicVisible" :show-close="false" width="80%">
      <div style="position:relative;overflow:auto">
        <img ref="imga" :src="processPngURL" />
        <div
          v-for="item in processImgStyle"
          :key="item.id"
          style="position:absolute;"
          :style="item"
        ></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { processClient } from "../../../httpClient";
export default {
  name: "userTasktable",
  data() {
    return {
      tableData: [],
      cur_page: 1,
      delVisible: false,
      finishMyTaskVisible: false,
      form: {
        id: "",
        name: "",
        assignee: "",
        createtime: "",
        description: "",
        taskdefinitionkey: "",
        durationInMillis: "",
        processInstanceId: "",
        processDefinitionId: ""
      },
      idx: -1,
      datatotal: 0,
      userId: "",
      nextBLRID: "",
      task: {},
      userList: [],
      isNeedDeel: true,
      processKey: "",
      processPicVisible: false,
      processPngURL: "",
      processImgStyle: []
    };
  },
  created() {
    //下面的方法可以封装一下吗？
    //获取所有用户信息
    processClient.invoke("getUserList", [null, null, null]).then(res => {
      var result = JSON.parse(res);
      if (result.status == 0) {
        this.userList = result.data.list;
        this.userId = result.data.list[0].ID; //默认赋值
        this.getData();
      } else {
        this.$message({
          type: "error",
          message: "服务器忙!"
        });
      }
    });
  },
  computed: {
    // data() {
    //   return this.tableData;
    // }
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      var funname = "";
      if (this.isNeedDeel == true) {
        funname = "getPersonalTask";
      } else {
        funname = "getPersonalHistory";
      }
      processClient
        .invoke(funname, [this.cur_page, 10, this.userId])
        .then(res => {
          var result = JSON.parse(res);
          if (result.status == 0) {
            this.$message({
              type: "success",
              message: `获取用户任务成功`
            });
            this.datatotal = result.data.total;
            this.tableData = result.data.list;
          } else {
            this.$message({
              type: "error",
              message: `服务器忙`
            });
          }
        });
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    showFinishMyTask(index, row) {
      const item = this.tableData[index];
      this.task = item;
      this.finishMyTaskVisible = true;
    },
    showProcessImg(index, row) {
      const item = this.tableData[index];
      this.task = item;
      console.log(this.task);
      processClient
        .invoke("showProcessPngState", [this.task.processInstanceId])
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
              if (result.data.list[index].assignee == this.userId) {//当前登陆用户节点
                this.processImgStyle.push({
                  width: result.data.list[index].width - 4 + "px",
                  height: result.data.list[index].height - 4 + "px",
                  top: result.data.list[index].y + "px",
                  left: result.data.list[index].x + "px",
                  "border-radius": "8px",
                  border: "2px solid red"
                });
              }else{
                 this.processImgStyle.push({
                  width: result.data.list[index].width - 2 + "px",
                  height: result.data.list[index].height - 2 + "px",
                  top: result.data.list[index].y + "px",
                  left: result.data.list[index].x + "px",
                  "border-radius": "8px",
                  border: "1px solid red"
                });
              }
            }
            this.processPicVisible = true;
          }
        });
      // processClient.invoke("showProcessPngStateByTaskID", [
      //               this.task.id
      //             ])
      //             .then(res => {
      //               var result = JSON.parse(res);
      //               if (result.status == 0&&result.data) {
      //                 this.processPngURL=window.processServiceURL+"file/showProcessPng?deployId="+result.data.deploymentId+"&diagramResourceName="+result.data.diagramResourceName;
      //                 this.$message.success("获取成功");
      //                 this.processImgStyle.width=(result.data.width-4)+"px";
      //                 this.processImgStyle.height=(result.data.height-4)+"px";
      //                 this.processImgStyle.left=result.data.x+"px";
      //                 this.processImgStyle.top=result.data.y+"px";
      //                 this.$message({
      //                   type: "success",
      //                   message: "获取成功!"
      //                 });
      //                this.processPicVisible = true;
      //               } else {
      //                 this.$message({
      //                   type: "error",
      //                   message: "服务器忙!"
      //                 });
      //               }
      //             });
    },
    //完成个人任务
    finishMyTask() {
      processClient
        .invoke("finishTaskByTaskId", [
          this.task.id,
          this.nextBLRID != "" ? this.nextBLRID : null
        ])
        .then(res => {
          var result = JSON.parse(res);
          if (result.status == 0) {
            this.$message({
              type: "success",
              message: "任务完成!"
            });
            this.finishMyTaskVisible = false;
            this.getData();
          } else {
            this.$message({
              type: "error",
              message: "服务器忙!"
            });
          }
        });
    },
    handleDelete(index, row) {
      const item = this.tableData[index];
      this.task = item;
      this.idx = index;
      this.delVisible = true;
    },
    // 删除任务（后台服务不好使）
    deleteRow() {
      processClient
        .invoke("deleteTaskByTaksID", [this.task.id, true])
        .then(res => {
          var result = JSON.parse(res);
          if (result.status == 0 && result.data) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.finishMyTaskVisible = false;
            this.getData();
          } else {
            this.$message({
              type: "error",
              message: "服务器忙!"
            });
          }
        });
      // this.tableData.splice(this.idx, 1);
      // this.$message.success("删除成功");
      this.delVisible = false;
    }
  },
  watch: {
    // userId: function(val) {
    //   //使用下拉框的change事件造成了死循环
    //   this.getData();
    // },
    // isNeedDeel: function() {
    //   this.getData();
    // }
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
