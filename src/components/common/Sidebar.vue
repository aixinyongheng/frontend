<template>
  <div class="sidebar">
    <!-- <el-menu
      class="sidebar-el-menu"
      :default-active="$route.path"
      :collapse="collapse"
      text-color="#4083e7"
      active-text-color="#ffffff"
      router
    > -->
     <el-menu
      class="sidebar-el-menu"
      :default-active="$route.path"
      text-color="#4083e7"
      active-text-color="#ffffff"
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
import { mapGetters, mapActions, mapMutations } from "vuex";
import * as TYPES from "@/vuex/stores/common/mutation-types.js";
export default {
  data() {
    return {
      collapse: false,
      items: [
        // {
        //   icon: "el-icon-lx-home",
        //   index: "dashboard",
        //   title: "系统首页"
        // },
        //   {
        //   icon: "iconfont icon-daochuwendang",
        //   index: "/home/department",
        //   title: "班级管理"
        // },
        //  {
        //   icon: "iconfont icon-daochuwendang",
        //   index: "/home/user",
        //   title: "用户管理"
        // },
        //   {
        //   icon: "iconfont icon-daochuwendang",
        //   index: "/home/userinfo",
        //   title: "个人中心"
        // },
        //   {
        //   icon: "iconfont icon-daochuwendang",
        //   index: "/home/tzgg",
        //   title: "通知公告"
        // },
        {
          icon: "el-icon-lx-cascades",
          index: "none",
          title: "工作流Activiti测试",
          subs: [
             {
          icon: "el-icon-lx-cascades",
          index: "none1",
          title: "部署管理",subs:[
            { index: "/home/processDeploy", title: "部署信息表" },
            { index: "/home/process", title: "流程定义表" }]},
            { index: "/home/processInstance", title: "流程实例表" },
            { index: "/home/userTask", title: "用户任务模拟" }
          ]
        },
         {
          icon: "iconfont icon-daochuwendang",
          index: "/home/dbExport",
          title: "导出数据库详"
        },
         {
          icon: "el-icon-upload",
          index: "/home/uploadTest",
          title: "上传测试界面"
        },
           {
          icon: "iconfont icon-fuwuceshi",
          index: "/home/hproseServerTest",
          title: "hproseServer服务测试"
        },
        {
          icon: "iconfont icon-quantu",
          index: "/mainMap",
          title: "我的地图"
        },
         {
          icon: "iconfont icon-quantu",
          index: "/thematic",
          title: "专题地图"
        }
        ,
         {
          icon: "el-icon-lx-cascades",
          index: "activemq",
          title: "ActiveMq测试"
        },
       
      
      ]
    };
  },
  methods:{
     ...mapActions({
      _getdataListByCond:TYPES.getdataListByCond,
      _createAndUpdateData:TYPES.createAndUpdateData,
      _forDelete:TYPES.forDelete
    }),
  },
  mounted(){
    //判断用户角色，给不同的路由
     this.user=JSON.parse(localStorage.getItem('user'))
        this._getdataListByCond({curpage:this.cur_page,pagesize:10,tableComment:"权限-用户",conds:'[{fieldname:"ID",fieldvalue:'+this.user.ID+',relation:"EQ"}]'}).then(res=>{
        this.user=JSON.parse(res).data.list[0]
        localStorage.setItem("user", JSON.stringify(this.user));
        console.log("yangzh：",this.user)
    // if(this.user.UserRoleList=='学生'){
    //     this.items= [
    //       {
    //       icon: "iconfont icon-tenantuser",
    //       index: "/home/userinfo",
    //       title: "个人中心"
    //     },
    //       {
    //       icon: "iconfont icon-luntan",
    //       index: "/home/tzgg",
    //       title: "通知公告"
    //     },{
    //       icon: "iconfont icon-daochuwendang",
    //       index: "/home/qjgl",
    //       title: "请假管理"
    //     }, {
    //        icon: "el-icon-lx-cascades",
    //        index: "/home/lts",
    //        title: "聊天室"
    //     }]
    // }
    // else if(this.user.UserRoleList=='教师'){
    //     this.items= [
    //               {
    //               icon: "iconfont icon-tenantuser",
    //               index: "/home/userinfo",
    //               title: "个人中心"
    //             },
    //             {
    //               icon: "iconfont icon-xiaoyuanguanli",
    //               index: "/home/user",
    //               title: "学生管理"
    //             },
                 
    //               {
    //               icon: "iconfont icon-luntan",
    //               index: "/home/tzgg",
    //               title: "通知公告"
    //             },{
    //                 icon: "iconfont icon-daochuwendang",
    //                 index: "/home/qjgl",
    //                 title: "请假管理"},
    //             {
    //                 icon: "el-icon-lx-cascades",
    //                 index: "/home/lts",
    //                 title: "聊天室"
    //               }
    //     ]

    //   }
    //   else{
    //   //   this.items= [
    //   //      {
    //   //     icon: "iconfont icon-tenantuser",
    //   //     index: "/home/userinfo",
    //   //     title: "个人中心"
    //   //   },
    //   //     {
    //   //     icon: "iconfont icon-xiaoyuanguanli",
    //   //     index: "/home/department",
    //   //     title: "班级管理"
    //   //   },
    //   //     {
    //   //     icon: "iconfont icon-yonghuzuUser_group",
    //   //     index: "/home/user",
    //   //     title: "教师及学生管理"
    //   //   },{
    //   //               icon: "iconfont icon-daochuwendang",
    //   //               index: "/home/qjgl",
    //   //               title: "请假管理"}, {
    //   //      icon: "el-icon-s-comment",
    //   //      index: "/home/lts",
    //   //      title: "聊天室"
    //   //   }
    //   // ]
    // }
     })

  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "/home");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>

<style scoped>
.sidebar .el-menu{
   border-right: none;
}

.sidebar {
  display: block;
  left: 0;
  top: 70px;
  bottom: 0;
  
}
.el-menu-item.is-active {
    color: #ffffff;
    background: #4083e7!important;
}
.el-menu-item{
  height: 40px!important;
  line-height: 40px!important;
 
}


</style>
