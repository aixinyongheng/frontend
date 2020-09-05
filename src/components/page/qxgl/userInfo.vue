<template>
    <div>
        <el-row :gutter="50">
            <el-col :span="10">
                <el-card shadow="hover" class="mgb20" style="height:400px;">
                    <div class="user-info">
                        <img src="/static/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{user.UserRoleList}}</div>
                        </div>
                    </div>
                    <div class="user-info-list" >入校时间：<span>{{user.CJSJ}}</span></div>
                     <div class="user-info-list" style="margin-top:20px;">性别：<span>{{user.SEX}}</span></div>
                      <div class="user-info-list" style="margin-top:20px;">手机号：<span>{{user.MOBILE}}</span></div>
                      <el-button type="primary" style="float:right;margin-top:20px" @click="editVisible=true;form.MOBLIE=user.MOBILE">编辑</el-button>
                </el-card>
               </el-col>
           </el-row>
            
            <!-- 编辑提示框 -->
               <el-dialog title="编辑个人信息" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="手机号">
                    <el-input v-model="form.MOBILE"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import * as TYPES from "@/vuex/stores/common/mutation-types.js";
    // import bus from '../common/bus';
    export default {
        name: 'userInfo',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                user:{},
                editVisible:false,
                form:{}
            }
        },
        methods: {
          ...mapActions({
                _getdataListByCond:TYPES.getdataListByCond,
                _createAndUpdateDatas:TYPES.createAndUpdateDatas,
                _getUserInfo:TYPES.getUserInfo
             }),
               // 保存编辑
    saveEdit() {
     this.form.ID=this.user.ID;
     this._createAndUpdateDatas({tableComment:"权限-用户",json:JSON.stringify([this.form])}).then(res=>{
           var result = JSON.parse(res);
                if (result.status == 0) {
                  if(this.form.ID){
                    this.$message.success(`编辑成功`);
                    this.user.MOBILE=this.form.MOBILE
                  }
                 
                  this.editVisible = false;
                } else {
                  this.$message({
                    type: "error",
                    message: `服务出错`
                  });
                }
      });
    },
           
        },
        mounted(){
          this.user=JSON.parse(localStorage.getItem('user'))
          this._getdataListByCond({curpage:this.cur_page,pagesize:10,tableComment:"权限-用户",conds:'[{fieldname:"ID",fieldvalue:'+this.user.ID+',relation:"EQ"}]'}).then(res=>{
            this.user=JSON.parse(res).data.list[0]
          })
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

   

</style>
