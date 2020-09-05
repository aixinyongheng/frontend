<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 部署信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table :data="data" border class="table">
        <el-table-column prop="id" label="部署id" width="120"></el-table-column>
        <el-table-column prop="name" label="部署名称" width="120"></el-table-column>
        <el-table-column prop="deploymentTime" label="部署日期" sortable width="200"></el-table-column>
        <el-table-column prop="deployedArtifacts" label="deployedArtifacts" width="200"></el-table-column>
        <el-table-column prop="resources" label="resources" width="200"></el-table-column>
        <el-table-column prop="tenantId" label="tenantId" width="200"></el-table-column>
        <el-table-column prop="category" label="category" width="200"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
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
      <el-upload class="upload-demo" drag :action="uploadAction" :on-success="getData">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传并部署</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传zip文件</div>
      </el-upload>
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
  </div>
</template>

<script>
import { processClient } from "../../../httpClient";
export default {
  name: "processtable",
  data() {
    return {
      tableData: [],
      cur_page: 1,
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      isForceDelete:false,
      form: {
        id: "",
        name: "",
        deploymentTime: "",
        deployedArtifacts: ""
      },
      idx: -1,
      datatotal: 0, //数据总数
      uploadAction: window.processServiceURL+"file/deployProcess",
      processDeploy: {}
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
    // 获取 easy-mock 的模拟数据
    getData() {
      processClient.invoke("findProcessDeploys", [this.cur_page, 10]).then(res => {
        var result = JSON.parse(res);
        if (result.status == 0) {
          this.$message({
            type: "success",
            message: `获取部署信息成功`
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
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.processDeploy = this.tableData[index];
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
    // 确定删除
    deleteRow() {
      processClient
        .invoke("deleteProcessDeployByID", [this.processDeploy.id, this.isForceDelete])
        .then(res => {
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
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
</style>
