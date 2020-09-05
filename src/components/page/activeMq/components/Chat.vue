<template>
  <div class="message">
    <ul class="chatul">
      <li v-for="(item) in chatList" :key="item.id">
        <div class="main">
          <img class="avatar" width="30" height="30" :src="api+item.USERPIC" :onerror="defaultImgURL" >
          <span class="avatarname">{{item.USERNAME}}</span>
          <div class="text">{{ item.CONTENT }}</div>
          <div class="chatfunction">
             <!-- todo 如何父组件传来一个值，然后就隐藏这块 -->
                    <!-- <span>
                        <i class="iconfont" style="font-size:28px;color:#d81e06;cursor:pointer;"  @click="loved(index,item.ID)">&#xe603;</i>
                        <span style="line-height:40px;" class="greyshow" >{{item.LIKECOUNT}}</span>
                    </span> -->
                      <span style="float:right">
                        <span class="greyshow" style="line-height:30px;">{{item.CREATETIME|formatter}}</span>
                  </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'Chat',
  data () {
    return {
      api: this.$store.state.api,
      chatLists: [],
      defaultImgURL:'this.src="' + require("../../../../../static/img/nouse.png") + '"'
    }
  },
  props: {
    chatList: Array
  },
  methods: {
    loved (index, id) {
      this.$emit('lovedcount', index, id)
    }
  },

  filters: {
    // 将日期过滤为 hour:minutes
    time (date) {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      return date.getHours() + ':' + date.getMinutes()
    },
    formatter (thistime) {
      var fmt = 'yyyy-MM-dd hh:mm:ss'
      let $this = new Date(thistime)
      let o = {
        'M+': $this.getMonth() + 1,
        'd+': $this.getDate(),
        'h+': $this.getHours(),
        'm+': $this.getMinutes(),
        's+': $this.getSeconds(),
        'q+': Math.floor(($this.getMonth() + 3) / 3),
        S: $this.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          ($this.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )
        }
      }
      return fmt
    }
  }
}
</script>

<style  scoped>
.message { padding: 10px 15px;
  overflow-y: auto;
  max-height: 600px;
}

.message ul li{
  margin-bottom: 20px;
  border-bottom:dotted rgb(235, 225, 225) 1px;
  list-style: none;
}
 .time{
      margin: 7px 0;
      text-align: center;
      color:antiquewhite;
}
.time>span{
        display: inline-block;
        padding: 0 18px;
        font-size: 12px;
        color: #fff;
        border-radius: 2px;
        background-color: #dcdcdc;
}
.avatarname{
 font-size:10px;
 color: rgb(177, 174, 174);
 line-height: 30px;
}
.message ul li .time  .avatar {
      float: left;
      margin: 0 10px 0 0;
      border-radius: 3px;
    }
.text {
      display: inline-block;
      position: relative;
      padding: 0 10px;
      min-height: 30px;
      line-height: 2.5;
      font-size: 14px;
      text-align: left;
      word-break: break-all;
      background-color: #dadada;
      border-radius: 4px;
    }
.text:before {
        content: " ";
        position: absolute;
        top: 9px;
        right: 100%;
        border: 6px solid transparent;
        border-right-color: #fafafa;
   }


.chatfunction{
        display: inline-block;
      position: relative;
      width:100%
    }

.greyshow {
      color: rgb(160, 151, 151);
}


</style>
