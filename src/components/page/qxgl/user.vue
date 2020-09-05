<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>用户信息
        </el-breadcrumb-item>
       
      </el-breadcrumb>
       <el-button type="primary" @click="
       editVisible=true;delete form.ID;isCreateUser=true;form={}">新建</el-button>
       <div style="float:right;" v-if='user.UserRoleList==="管理员"'>
        班级：
          <el-select v-model="searchClass"    clearable placeholder="请选择">
                    <el-option
                      v-for="item in departmentOptions"
                      :key="item.ID"
                      :label="item.NAME"
                      :value="item.ID">
                      </el-option>
                    </el-select>
                    </div>
    <div style="float:right;">
        用户名：
           <el-input style="width:240px;" v-model="searchName"></el-input>
                    </div>
    </div>
    
          <div class="container">
      <el-table
        :data="tableData"
        border
        class="table"
      >
        <!-- <el-table-column prop="ID" label="ID" sortable width="150"></el-table-column> -->
        <el-table-column prop="NAME" label="用户名" width="200"></el-table-column>
         <el-table-column prop="SEX" label="性别" width="120"></el-table-column>
         <el-table-column prop="MOBILE" label="手机号" width="200"></el-table-column>
        <el-table-column prop="UserRoleList" label="角色" width="200"></el-table-column>
        <el-table-column prop="BMMC" label="班级" width="200"></el-table-column>
        <el-table-column v-if="user.UserRoleList=='管理员'" label="操作"  align="center">
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
    <!-- 新建用户 -->

    <!-- 编辑提示框 -->
     <el-dialog title="操作" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="用户名：">
                    <el-input v-model="form.NAME"></el-input>
                </el-form-item>
                 <el-form-item label="性别">
                    <el-input v-model="form.SEX"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.MOBILE"></el-input>
                </el-form-item>
                 <el-form-item v-if="isCreateUser" label="密码：">
                    <el-input v-model="form.PASSWORD"></el-input>
                </el-form-item>
                <el-form-item label="角色：">
                   <el-select v-model="roleValue" placeholder="请选择">
                    <el-option
                      v-for="item in roleOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            <el-form-item label="班级：">
                   <el-select v-model="departmentValue" placeholder="请选择">
                    <el-option
                      v-for="item in departmentOptions"
                      :key="item.ID"
                      :label="item.NAME"
                      :value="item.ID">
                    </el-option>
                  </el-select>
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
import { mapGetters, mapActions, mapMutations } from "vuex";
import * as TYPES from "@/vuex/stores/common/mutation-types.js";
export default {
  name: "processtable",
  data() {
    return {
      searchName:'',
      searchClass:'',
      user:{},
      tableData: [],
      form:{},
      cur_page: 1,
      editVisible: false,
      delVisible: false,
      idx: -1,
      datatotal: 0,
      roleOptions:[{label:"管理员",value:"1"},{label:"教师",value:"2"},{label:"学生",value:"3"}],
      roleValue:"3", //角色
      isCreateUser:false,
      departmentOptions:[],
      departmentValue:'',
    };
  },
  mounted() {
    this.user=JSON.parse(localStorage.getItem('user'))
    this.getData();
    // 获取班级列表
    this._getdataListByCond({curpage:null,pagesize:null,tableComment:"权限-部门"}).then(res=>{
          var result = JSON.parse(res);
                if (result.status == 0) {
                  this.departmentOptions = result.data.list;
                } else {
                  this.$message({
                    type: "error",
                    message: `服务出错`
                  });
                }
      });
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
      let query={};
      if(this.user.UserRoleList==="管理员"){
        if(this.searchClass&&this.searchClass!=""){
        query={"curpage":this.cur_page,"pagesize":10,tableComment:"权限-用户",conds:'[{fieldname:"ID",fieldvalue:"'+this.user.ID+'",relation:"EQN"},{fieldname:"DEPARTMENTID",fieldvalue:"'+this.searchClass+'",relation:"EQ"},{fieldname:"NAME",fieldvalue:"'+this.searchName+'",relation:"FQ"}]'}; 

        }else{
        query={"curpage":this.cur_page,"pagesize":10,tableComment:"权限-用户",conds:'[{fieldname:"ID",fieldvalue:"'+this.user.ID+'",relation:"EQN"},{fieldname:"NAME",fieldvalue:"'+this.searchName+'",relation:"FQ"}]'}; 

        }
      }else{
       
        if(this.searchName){
           query={"curpage":this.cur_page,"pagesize":10,tableComment:"权限-用户",conds:'[{fieldname:"DEPARTMENTID",fieldvalue:"'+this.user.DEPARTMENTID+'",relation:"EQ"},{fieldname:"ID",fieldvalue:"'+this.user.ID+'",relation:"EQN"},{fieldname:"NAME",fieldvalue:"'+this.searchName+'",relation:"FQ"}]'}; 
        }else {
           query={"curpage":this.cur_page,"pagesize":10,tableComment:"权限-用户",conds:'[{fieldname:"DEPARTMENTID",fieldvalue:"'+this.user.DEPARTMENTID+'",relation:"EQ"},{fieldname:"ID",fieldvalue:"'+this.user.ID+'",relation:"EQN"}]'}; 


        }
      }
      this._getdataListByCond(query).then(res=>{
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
   // 编辑用户
    handleEdit(index, row) {
      this.isCreateUser=false;
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                   ID:item.ID,
                    NAME: item.NAME,
                    DESCRIPTION: item.DESCRIPTION,
                    SEX:item.SEX,
                    MOBILE:item.MOBILE
                }
                this.editVisible = true;
    },
     // 保存编辑
    saveEdit() {
     this.form.UserRoleList=[this.roleValue];
     this.form.DEPARTMENTID=this.departmentValue;
     this._createAndUpdateData({tableComment:"权限-用户",json:JSON.stringify(this.form)}).then(res=>{
           var result = JSON.parse(res);
                if (result.status == 0) {
                  if(this.form.ID){
                    this.$message.success(`编辑成功`);
                  }else{
                    this.$message.success(`新建成功`);
                  }
                  this.getData();
                  this.editVisible = false;
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
     this._forDelete( {"ID":this.form.ID,"tableComment":'权限-用户'}).then(res => {
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
    
   
   
   
  },
  watch:{
    searchClass:function(val) {
            this.getData();
        },
    searchName :function(val){
          this.getData();
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
