<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>班级信息
        </el-breadcrumb-item>
       
      </el-breadcrumb>
       <el-button type="primary" @click="
       editVisible=true;delete form.ID">新建</el-button>
    </div>
    <div class="container">
      <el-table
        :data="tableData"
        border
        class="table"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column prop="ID" label="ID" sortable width="150"></el-table-column> -->
        <el-table-column prop="NAME" label="班级名" width="400"></el-table-column>
        <el-table-column prop="DESCRIPTION" label="班级描述" width="400"></el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              class="green"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
           
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
    <!-- 编辑提示框 -->
     <el-dialog title="操作" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                
                <el-form-item label="班级名">
                    <el-input v-model="form.NAME"></el-input>
                </el-form-item>
                <el-form-item label="班级描述">
                    <el-input v-model="form.DESCRIPTION"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
    
  </div>
</template>

<script>
import { processClient } from "../../../httpClient";
import { mapGetters, mapActions, mapMutations } from "vuex";
import * as TYPES from "@/vuex/stores/common/mutation-types.js";
export default {
  name: "processtable",
  data() {
    return {
      tableData: [],
      form:{},
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
      _getdataListByCond:TYPES.getdataListByCond,
      _createAndUpdateData:TYPES.createAndUpdateData,
      _forDelete:TYPES.forDelete
    }),
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
 
    // 获取 easy-mock 的模拟数据
    getData() {
      this._getdataListByCond({curpage:this.cur_page,pagesize:10,tableComment:"权限-部门"}).then(res=>{
          var result = JSON.parse(res);
                if (result.status == 0) {
                
                  this.datatotal = result.data.total;
                  this.tableData = result.data.list;
                } else {
                  this.$message({
                    type: "error",
                    message: `服务出错`
                  });
                }
      })
    },
   // 编辑班级
    handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                   ID:item.ID,
                    NAME: item.NAME,
                    DESCRIPTION: item.DESCRIPTION,
                }
                this.editVisible = true;
    },
     // 保存编辑
    saveEdit() {
     
      this._createAndUpdateData({tableComment:"权限-部门",json:JSON.stringify(this.form)}).then(res=>{
           var result = JSON.parse(res);
                if (result.status == 0) {
                  if(this.form.ID){
                        this.$set(this.tableData, this.idx, this.form);
                        this.editVisible = false;
                        this.$message.success(`编辑成功`);
                  }else{
                    this.getData();
                    this.editVisible = false;
                    this.$message.success(`新建成功`);
                  }
                 
                } else {
                  this.$message({
                    type: "error",
                    message: `服务出错`
                  });
                }
      });
      
    },
    handleDelete(index, row) {
      this.idx = index;
       const item = this.tableData[index];
                this.form = {
                   ID:item.ID,
                    NAME: item.NAME,
                    DESCRIPTION: item.DESCRIPTION,
                }
      console.log(index)
      this.delVisible = true;
    },
    // 删除
     deleteRow() {
     this._forDelete( {"ID":this.form.ID,"tableComment":'权限-部门'}).then(res => {
        var result = JSON.parse(res);
          if (result.status == 0) {
           
            this.$message.success("删除成功");
            this.getData();
            this.delVisible = false;
          }else{
            this.delVisible = false;
            this.$message.error("删除失败");
          }
      });
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
   
   
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
