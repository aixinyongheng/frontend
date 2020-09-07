import Vue from 'vue';
import Router from 'vue-router';

//防止重复点击报错 NavigationDuplicated
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// Router.beforeEach((to, from, next) => {
//     if (to.meta.title) {//如果设置标题，拦截后设置标题
//       document.title = to.meta.title
//     }
//     next()
//   })


Vue.use(Router);
var router=new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/home/userinfo'
        },
        {
            path: '/mainMap',
            component: resolve => require(['../components/page/map/MainMap.vue'], resolve),
            meta: { title: '我的地图' }
        },
        {
            path: '/navhome',
            component: resolve => require(['../components/common/NavHome.vue'], resolve),
            meta: { title: '导航首页' }
        },
        {
            path: '/thematic',
            component: resolve => require(['../components/page/thematic/thematicHome.vue'], resolve),
            meta: { title: '专题' }
        },
        {
            path: '/fixedPosition',
            component: resolve => require(['../components/page/fixedPosition/fixedPosition.vue'], resolve),
            meta: { title: '测试'}
        },
        {
            path: '/richTextEditor',
            component: resolve => require(['../components/page/richTextEditor/ueTextEditor'], resolve),
            meta: { title: '富文本编辑器'}
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/home/department',
                    component: resolve => require(['../components/page/qxgl/department.vue'], resolve),
                    meta: { title: '部门管理' }
                },
                {
                    path: '/home/user',
                    component: resolve => require(['../components/page/qxgl/user.vue'], resolve),
                    meta: { title: '用户列表' }
                },
                {
                    path: '/home/userinfo',
                    component: resolve => require(['../components/page/qxgl/userInfo.vue'], resolve),
                    meta: { title: '个人中心' }
                },
                {
                    path: '/home/tzgg',
                    component: resolve => require(['../components/page/qxgl/tzgg.vue'], resolve),
                    meta: { title: '通知公告' }
                },
                {
                    path: '/home/qjgl',
                    component: resolve => require(['../components/page/qxgl/qjgl.vue'], resolve),
                    meta: { title: '请假管理' }
                },
                {
                    path: '/home/processDeploy',
                    component: resolve => require(['../components/page/process/ProcessDeployTable.vue'], resolve),
                    meta: { title: '部署信息表' }
                },
                {
                    path: '/home/process',
                    component: resolve => require(['../components/page/process/ProcessDefine.vue'], resolve),
                    meta: { title: '流程定义表' }
                },
                {
                    path: '/home/processInstance',
                    component: resolve => require(['../components/page/process/ProcessInstance.vue'], resolve),
                    meta: { title: '流程实例表' }
                },
                {
                    path: '/home/userTask',
                    component: resolve => require(['../components/page/process/UserTaskTable.vue'], resolve),
                    meta: { title: '任务列表' }
                },
                {
                    path: '/home/uploadTest',
                    component: resolve => require(['../components/page/UploadTest.vue'], resolve),
                    meta: { title: '上传测试' }
                },
                 {
                    path: '/home/hproseServerTest',
                    component: resolve => require(['../components/page/HproseServerTest.vue'], resolve),
                    meta: { title: 'HproseServer测试' }
                },
                {
                    path: '/home/dbExport',
                    component: resolve => require(['../components/page/dbExport/DBDetailsExport.vue'], resolve),
                    meta: { title: '导出数据库详细设计文档'}
                },
                {
                    path: '/home/lts',
                    component: resolve => require(['../components/page/activeMq/ActiveMq.vue'], resolve),
                    meta: { title: 'lts'}
                },
             
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/login/Login.vue'], resolve)
        },
    ]
})
router.beforeEach((to, from, next) => {
    if (to.meta.title) {//如果设置标题，拦截后设置标题
      document.title = to.meta.title
    }
    next()
  })
   
export default  router


