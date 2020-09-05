<template>
  <div >
   <chat class="chatlist"
                  :chatList="chatList"
    ></chat>
    <div style="position:absolute;bottom:0px;width:100%"> 当前在线人数：{{onlineUsers.length}}
          <input 
                    style="width:90%;height:30px;"
                    placeholder="按 Ctrl + Enter 发送"
                    v-model="chatContent"
                    @keyup="sendMessageOnKeyup"
          >
          <el-button style="float:right;"  type="primary" round @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script>
import Stomp from 'stompjs'
import Chat from './components/Chat.vue'
export default {
 name: 'websocket',
data(){
     return{
        user:{},
        loginuserid:"",
        ws:null,
        chatContent:"",//发送消息内容
        chatList:[{USERNAME:"管理员",CONTENT:"欢迎来到在线聊天室，请畅所欲言",CREATETIME:new Date()},
              
         ],
         onlineUsers:[]
     }
},
components: {
     Chat
},
methods:{
  mnLogin(){
    var  wsServer = "ws://"+"localhost:8070" + "/chatServer/"+this.loginuserid+"/"+this.user.NAME;
    if(this.ws==null){
      this.ws = new WebSocket(wsServer); //创建WebSocket对象
    }else{
      console.log("已经建立了连接");
    }
    var _this=this;
    this.ws.onopen = function (evt) {
	    console.log("已经建立连接",evt);
    };
    this.ws.onmessage = function (evt) {
      console.log("解析后台传回的消息,并予以展示",evt.data);
      debugger;
      var result=JSON.parse(evt.data);
       debugger;
      if(result.type=="1"){
        //上线通知
          _this.$message({
          message: result.message,
          type: 'success'
        });
        _this.onlineUsers=result.onlineusers
      }else if(result.type=="0"){
        debugger
          _this.$message(result.message);
      }
      else if(result.type=="2"){
        debugger;
          _this.chatList.push({USERNAME:result.username,CONTENT:result.message,CREATETIME:new Date()});
      }
    };
    this.ws.onerror = function (evt) {
	    console.log("产生异常",evt);
    };
    this.ws.onclose = function (evt) {
	    console.log("已经关闭连接",evt);
        
    };
  },
  sendMessageToAll(){

  },
  sendMessageOnKeyup(e){
     if (e.ctrlKey && e.keyCode === 13 && this.chatContent.length) {
        this.sendMessage()
      }
  },
  sendMessage(){
     this.ws.send(this.chatContent);
  }//发送消息
},
mounted(){
  //获取用户id,
  this.user=JSON.parse(localStorage.getItem('user'))
  this.loginuserid=this.user.ID;
  this.mnLogin();
    //websocket原生
        //    if(typeof(WebSocket) === "undefined")
        //    {
        //             alert("您的浏览器不支持socket")
        //         }else
        //         {
        //             alert("支持");
        //             // 实例化socket
        //             this.socket = new WebSocket("ws://172.16.106.64:61617/stomp")
        //             // 监听socket连接
        //             this.socket.onopen = this.open
        //             // 监听socket错误信息
        //             this.socket.onerror = this.error
        //             // 监听socket消息
        //             this.socket.onmessage = this.getMessage
        //        
            

}
}
</script>


<style scoped>
 .chatlist {
    height:800px;
    /* overflow: hidden; */
  }
</style>
