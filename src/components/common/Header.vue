<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <!-- <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div> -->
      <div class="collapse-btn">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">测试系统</div>
    <div class="header-right">
      <div class="header-user-con">
          <el-tooltip effect="dark" content="截图"  placement="bottom">
            <i class="iconfont icon-xiaoyuanguanli screenshot"  @click="screenshot"></i>
          </el-tooltip>

        <!-- 全屏显示 -->
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank fullscreen"  @click="handleFullScreen"></i>
          </el-tooltip>
     
        <!-- 消息中心 -->
        <!-- <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
        </div>-->
        <!-- 用户头像 -->
          <img class="user-avator" src="/static/img/img.jpg" />
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <a href="http://blog.gdfengshuo.com/about/" target="_blank">
                            <el-dropdown-item>关于作者</el-dropdown-item>
                        </a>
                        <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
                            <el-dropdown-item>项目仓库</el-dropdown-item>
            </a>-->
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 弹框 -->

    <el-dialog
  title="提示"
  :visible.sync="centerDialogVisible"
  width="30%"
  center>
  <img  style="width:512px;height:384px;" :src="'data:image/png;base64,' +pngbase" />
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">导出</el-button>
  </span>
</el-dialog>


  </div>
</template>
<script>
import bus from "../common/bus";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: "linxin",
      message: 2,
      centerDialogVisible:false,
      pngbase:null,
    };
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        this.$router.push("/login");
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.getElementById("myMap"); //这个是某个div全屏
      if (element == null) {
        element = document.documentElement; //这个是整个网页全屏
      }
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    // 截屏   bug  地图界面截图，截图跟系统图还不一样，不好使
    screenshot() {
      var options = {
        useCORS: true
      };
      var _this=this;
      html2canvas(document.body, options).then(function(canvas) {
        // console.log(canvas, "canvas");
        var imgBlob = canvas.toDataURL("image/jpeg", 1.0); //将图片转为base64, 0-1 表示清晰度
         imgBlob = imgBlob.toString().substring(imgBlob.indexOf(",") + 1); //截取base64以便上传
        _this.pngbase=imgBlob;
        _this.centerDialogVisible=true;
        // console.log(imgBlob, "imgBlob");
        // document.body.appendChild(canvas);
        // var form = {
        //   id: that.newuuid(),
        //   pid: that.$route.query.id,
        //   sssx: "slt",
        //   wjlj: imgBlob,
        //   wjlx: "jpeg"
        // };
        // let param = {
        //   tableType: "网站附件表",
        //   json: JSON.stringify(form)
        // };
        // // console.log(param, "param");
        // that.$store.dispatch("createAndUpdateData", param).then(res => {
        //   let data = JSON.parse(res);
        //   if (data.status == 0) {
        //     // console.log(22333);
        //     if (localStorage.getItem("pictureIndex")) {
        //       var pictureIndex =
        //         Number(localStorage.getItem("pictureIndex")) + 1;
        //     } else {
        //       var pictureIndex = 1;
        //     }
        //     localStorage.setItem("pictureIndex", pictureIndex);
        //   } else {
        //     that.$message("保存图片失败");
        //   }
        // });
      });
     
    }
  },
  mounted() {
    this.collapseChage();
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  font-size: 22px;
  background:#4083e7;
  color: rgb(255, 255, 255);
}
.collapse-btn {
  margin-left:20px;
  float: left;
  cursor: pointer;
  line-height: 60px;
}
.header .logo {
  float: left;
   margin-left:10px;
  width: 300px;
  line-height: 60px;
}
.header-right {
  float: right;
  padding-right: 20px;
}
.header-user-con {
  display: flex;
  height: 60px;
  align-items: center;
}
.screenshot {
  margin-right:10px;
}
.fullscreen{
 margin-right:10px;
 transform: rotate(45deg);
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
