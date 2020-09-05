<template>
    <div class='wripper'>
        <el-container>
            <el-header><v-head></v-head></el-header>
            <el-container>
                <el-aside>  
                      <div class='sliderMenu' >功能菜单</div>
                    <v-sidebar></v-sidebar>
                </el-aside>
                <el-main>  <router-view></router-view></el-main>
            </el-container>
        </el-container>
        <!-- <div class="content-box" :class="{'content-collapse':collapse}"> -->
        <!-- </div> -->
  </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import bus from './bus';
    export default {
        data(){
            return {
                tagsList: [],
                collapse: true
            }
        },
        components:{
            vHead, vSidebar
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>
<style scoped>
.el-container,.wripper{
    width:100%;
    height:100%;

}
.el-header{
   padding:0;
   height:100%
}
.el-aside{
    width:100%;
    position:relative;
    bottom:0;
}
.sidebar{
   height: calc(100% - 38px);
}
.sliderMenu{
    height: 28px;
    line-height: 28px;
    background: linear-gradient(to right, rgb(234, 239, 250), rgb(255, 255, 255));
    text-indent: 20px;
    color:#4083e7;
    font-weight: bold;
    font-size:14px;
    border-left: 3px solid rgb(64, 131, 231);
    padding-right: 11px;
    margin-top:10px;
}
.el-main{
    background:#e6ecf3;
    padding:10px;
}
.el-main div{
    padding:20px;
    height: calc(100% - 40px);
    background:white;
}


</style>
