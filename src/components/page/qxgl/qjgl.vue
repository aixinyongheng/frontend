<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>请假管理
        </el-breadcrumb-item>
       
      </el-breadcrumb>
       <el-button type="primary" @click="
       editVisible=true;delete form.ID"
       v-if="user.UserRoleList=='学生'"
       >新建</el-button>
    </div>
    <div class="container">
      <el-table
        :data="tableData"
        border
        class="table"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column prop="ID" label="ID" sortable width="150"></el-table-column> -->
        <el-table-column prop="QJTITLE" label="标题" width="120"></el-table-column>
        <el-table-column prop="QJCONTENT" label="请假内容" width="400"></el-table-column>
        <el-table-column prop="SHZT" label="状态" width="120" >
           <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.SHZT === '0' "
                  type="primary"
                  disable-transitions>待提交</el-tag>
                  <el-tag
                  v-if="scope.row.SHZT === '1' "
                  type="primary"
                  disable-transitions>待审核</el-tag>
                  <el-tag
                  v-if="scope.row.SHZT === '2' "
                  type="success"
                  disable-transitions>已通过</el-tag>
                  <el-tag
                  v-if="scope.row.SHZT === '3' "
                  type="primary"
                  disable-transitions>未通过</el-tag>
              </template>
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
             <el-button
              type="text"
              icon="el-icon-video-play"
              class="green"
              @click="handleShow(scope.$index, scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              class="green"
             v-if="user.UserRoleList=='学生'&&scope.row.SHZT==0"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-finished"
              class="green"
             v-if="user.UserRoleList=='教师'&&scope.row.SHZT==0"
              @click="handlesubmit(scope.$index, scope.row)"
            >提交</el-button>
             <el-button
              type="text"
              icon="el-icon-s-promotion"
              class="green"
             v-if="user.UserRoleList=='教师'&&scope.row.SHZT==1"
              @click="handleSh(scope.$index, scope.row)"
            >审核</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
               v-if="(user.UserRoleList=='学生'&&scope.row.SHZT==0)||user.UserRoleList=='管理员'||user.UserRoleList=='教师'"
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
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标题:">
                    <el-input v-model="form.QJTITLE"></el-input>
                </el-form-item>
                <el-form-item label="请假内容:">
                    <el-input v-model="form.QJCONTENT"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
   
     <!-- 提交提示框 -->
     <el-dialog title="提交" :visible.sync="submitVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="审核人:">
                    <el-select v-model="form.SHRID" placeholder="请选择">
                      <el-option
                        v-for="item in shrOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="submitVisible = false">取 消</el-button>
                <el-button type="primary" @click="savetj">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 审核提示框 -->
         <el-dialog title="审核" :visible.sync="shVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="审核意见:">
                    <el-select v-model="form.SHZT" placeholder="请选择">
                      <el-option
                        v-for="item in [{value:'2',label:'通过'},{value:'3',label:'不通过'}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSh">确 定</el-button>
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
    <!-- 查看提示框 -->
     <el-dialog title="查看" :visible.sync="showVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标题:">
                    {{form.QJTITLE}}
                </el-form-item>
                <el-form-item label="请假内容:">
                     {{form.QJCONTENT}}
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showVisible = false">取 消</el-button>
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
      tjVisible:false,// 提交框
      submitVisible:false,
      shVisible:false,//审核框
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
      processPicVisible:false,
      user:{},
      shrOptions:[{value:"11",label:"教师1"}],
      showVisible:false
    };
  },
  mounted() {
    this.user=JSON.parse(localStorage.getItem('user'))
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
      //判断用户类型
      if(this.user.UserRoleList=="学生"){
          this._getdataListByCond({curpage:this.cur_page,pagesize:10,tableComment:"请假流程",conds:'[{"fieldname":"SQRID","fieldvalue":"'+this.user.ID+'","relation":"EQ"}]'}).then(res=>{
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
      }else if(this.user.UserRoleList=="教师"){
      this._getdataListByCond({curpage:this.cur_page,pagesize:10,tableComment:"请假流程",conds:'[{"fieldname":"SHRID","fieldvalue":"'+this.user.ID+'","relation":"EQ"}]'}).then(res=>{
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
      }else{
        this._getdataListByCond({curpage:this.cur_page,pagesize:10,tableComment:"请假流程"}).then(res=>{
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
      })}

    },
   // 编辑请假内容
    handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                   ID:item.ID,
                    QJTITLE: item.QJTITLE,
                    QJCONTENT: item.QJCONTENT,
                    SQRID:this.user.ID
                }
                this.editVisible = true;
    },
    // 提交请假内容
    handlesubmit(index,row){
      // 获取用户
          this.idx = index;
          const item = this.tableData[index];
          this.form = {
            ID:item.ID,
          }
          this.submitVisible = true;
          //,conds:'[{"fieldname":"SHRID","fieldvalue":"'+this.user.ID+'","relation":"EQ"}]'
          this._getdataListByCond({curpage:0,pagesize:0,tableComment:"权限-用户"}).then(res=>{
          var result = JSON.parse(res);result.data
                let arr=[]
                if (result.status == 0) {
                  for(let item of result.data.list){
                    if(item.UserRoleList=="教师"){
                        arr.push({"value":item.ID,"label":item.NAME})
                    }
                  }
                this.shrOptions=arr;
                } else {
                  this.$message({
                    type: "error",
                    message: `服务出错`
                  });
                }
      })
    },
    // 审核请假内容
    handleSh(index,row){
          this.idx = index;
            const item = this.tableData[index];
             this.form = {
                      ID:item.ID,
                      SHRID:item.SHRID,
          }
          this.shVisible = true;
    },
    // 新建编辑
    saveEdit() {
     this.form.SQRID=this.user.ID
     this.form.SHZT='0';
     this._createAndUpdateData({tableComment:"请假流程",json:JSON.stringify(this.form)}).then(res=>{
           var result = JSON.parse(res);
                if (result.status == 0) {
                  if(this.form.ID){
                        this.getData();
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
    // 提交
    savetj(){
     this.form.SHZT='1';
     this._createAndUpdateData({tableComment:"请假流程",json:JSON.stringify(this.form)}).then(res=>{
           var result = JSON.parse(res);
                if (result.status == 0) {
                  if(this.form.ID){
                        this.getData();
                        this.editVisible = false;
                        this.$message.success(`提交成功`);
                        submitVisible=false;
                  }
                } else {
                  this.$message({
                    type: "error",
                    message: `服务出错`
                  });
                }
      });
    },
     // 审核
    saveSh(){
     this._createAndUpdateData({tableComment:"请假流程",json:JSON.stringify(this.form)}).then(res=>{
           var result = JSON.parse(res);
                if (result.status == 0) {
                  if(this.form.ID){
                       this.getData();
                        this.editVisible = false;
                        this.$message.success(`审核成功`);
                        shVisible=false;
                  }
                } else {
                  this.$message({
                    type: "error",
                    message: `服务出错`
                  });
                }
      });
    },
    // 删除
    handleDelete(index, row) {
      this.idx = index;
       const item = this.tableData[index];
                this.form = {
                    ID:item.ID,
                    NAME: item.NAME,
                    DESCRIPTION: item.DESCRIPTION,
                   
                }
      this.delVisible = true;
    },
    // 查看
    handleShow(index,row){
       this.idx = index;
       const item = this.tableData[index];
                this.form = {
                    QJTITLE: item.QJTITLE,
                    QJCONTENT: item.QJCONTENT,
                    
                }
      this.showVisible = true;
    },
    // 删除
     deleteRow() {
     this._forDelete( {"ID":this.form.ID,"tableComment":'请假流程'}).then(res => {
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
