<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>通知公告
        </el-breadcrumb-item>
       
      </el-breadcrumb>
       <el-button  type="primary" @click="
       editVisible=true;delete form.ID;isCreateUser=true;form={}" v-show="user.UserRoleList=='管理员'||user.UserRoleList=='教师'">新建</el-button>
    </div>
    <div class="container">
      <el-table
        :data="tableData"
        border
        class="table"
      >
        <!-- <el-table-column prop="ID" label="ID" sortable width="150"></el-table-column> -->
        <el-table-column prop="BT" label="标题" width="120"></el-table-column>
        <el-table-column prop="GGLX" label="公告类型" width="120"       
          ><template slot-scope="scope">
        <span style="margin-left: 10px" v-if="scope.row.GGLX=='1'">上课通知</span>
         <span style="margin-left: 10px" v-if="scope.row.GGLX=='2'">作业通知</span>
          <span style="margin-left: 10px" v-if="scope.row.GGLX=='3'">成绩发布</span>
      </template>
          </el-table-column>
        <el-table-column prop="CJRMC" label="发布人" width="120"></el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
             <el-button
              type="text"
              icon="el-icon-video-play"
              class="green"
              @click="showTzgg(scope.$index, scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              icon="el-icon-video-play"
              class="green"
              @click="handleEdit(scope.$index, scope.row)"
              v-show="user.UserRoleList=='管理员'||user.UserRoleList=='教师'"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              v-show="user.UserRoleList=='管理员'||user.UserRoleList=='教师'"
            >删除</el-button>
            <el-button
              type="text"
              icon="el-icon-download"
              class="green"
              @click="downloadFile(scope.row)"
             v-if="scope.row.WJLJ&&scope.row.WJLJ!=''"
            >下载附件</el-button>
           
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
                <el-form-item label="标题：">
                    <el-input v-model="form.BT"></el-input>
                </el-form-item>
              <el-form-item label="公告类型：">
                   <el-select v-model="form.GGLX" placeholder="请选择">
                    <el-option
                      v-for="item in [{value:'1',label:'上课通知'},{value:'2',label:'作业通知'},{value:'3',label:'成绩发布'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                    </el-form-item>
                 <el-form-item  label="通知内容：">
                    <el-input v-model="form.GGMS"></el-input>
                </el-form-item>
                <el-upload
                    :action="uplaodUrl"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :limit="1"
                    :on-success="submitSuccess"
                    :data="{uploadtype:'1'}"
                  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                   </el-upload>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 查看 -->
        <el-dialog title="通知公告" :visible.sync="showVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标题：">
                   {{form.BT}}
                </el-form-item>
              <el-form-item label="公告类型："> 
                   <span style="margin-left: 10px" v-if="form.GGLX=='1'">上课通知</span>
                  <span style="margin-left: 10px" v-if="form.GGLX=='2'">作业通知</span>
                  <span style="margin-left: 10px" v-if="form.GGLX=='3'">成绩发布</span>
                    </el-form-item>
                 <el-form-item  label="通知内容：">
                   {{form.GGMS}}
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showVisible=false">确 定</el-button>
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
      user:{},
      tableData: [],
      form:{},
      cur_page: 1,
      editVisible: false,
      showVisible:false,
      delVisible: false,
      idx: -1,
      datatotal: 0,
      roleOptions:[{label:"管理员",value:"1"},{label:"教师",value:"2"},{label:"学生",value:"3"}],
      roleValue:"3", //角色
      isCreateUser:false,
      departmentOptions:[],
      departmentValue:'',
      uplaodUrl:window.uplaodUrl,

    };
  },
  mounted() {
    // 获取班级列表
    // 获取用户
    this.user=JSON.parse(localStorage.getItem('user'))
        this._getdataListByCond({curpage:this.cur_page,pagesize:10,tableComment:"权限-用户",conds:'[{fieldname:"ID",fieldvalue:'+this.user.ID+',relation:"EQ"}]'}).then(res=>{
        this.user=JSON.parse(res).data.list[0]
        this.getTZGGData();
    })
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
      this.getTZGGData();
    },
 
    // 获取 easy-mock 的模拟数据
    getTZGGData() {
      // 先判断用户权限
      let query={};
      if(this.user.UserRoleList=="管理员"){
          query={curpage:this.cur_page,pagesize:10,tableComment:"通知公告"};
      }else if(this.user.UserRoleList=="教师"){
          query={curpage:this.cur_page,pagesize:10,tableComment:"通知公告",conds:'[{fieldname:"CJRID",fieldvalue:"'+this.user.ID+'",relation:"EQ"}]'};
      }else{
          query={curpage:this.cur_page,pagesize:10,tableComment:"通知公告",conds:'[{fieldname:"FBDWID",fieldvalue:"'+this.user.DEPARTMENTID+'",relation:"EQ"}]'};
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
   // 编辑班级
    handleEdit(index, row) {
       this.idx = index;
       const item = this.tableData[index];
       this.form = {
                    ID:item.ID,
                    BT: item.BT,
                    GGMS: item.GGMS,
                    GGLX:item.GGLX

                }
                this.editVisible = true;
    },
    showTzgg(index,row){
        this.idx = index;
        const item = this.tableData[index];
        this.form = {
                    ID:item.ID,
                    BT: item.BT,
                    GGMS: item.GGMS,
                    GGLX:item.GGLX

        }
        this.showVisible = true;
    },
     // 保存编辑
    saveEdit() {
      if(!this.form.ID){
          this.form.CJRID=this.user.ID;
          this.form.CJRMC=this.user.NAME;
          this.form.FBDWID=this.user.DEPARTMENTID
      }

     this._createAndUpdateData({tableComment:"通知公告",json:JSON.stringify(this.form)}).then(res=>{
           var result = JSON.parse(res);
                if (result.status == 0) {
                  if(this.form.ID){
                    this.$message.success(`编辑成功`);
                  }else{
                    this.$message.success(`新建成功`);
                  }
                  this.getTZGGData();
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
    handleRemove(){
      this.form.WJLJ='';
    },
    // 删除
     deleteRow() {
     this._forDelete( {"ID":this.form.ID,"tableComment":'通知公告'}).then(res => {
        var result = JSON.parse(res);
          if (result.status == 0) {
           
            this.$message.success("删除成功");
            this.getTZGGData();
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
    submitSuccess(res){
      this.form.WJLJ=res.data;
    }
   ,downloadFile(row){
    //  console.log(window.downloadUrl+row.WJLJ);
      window.location.href=window.downloadUrl+row.WJLJ;
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
