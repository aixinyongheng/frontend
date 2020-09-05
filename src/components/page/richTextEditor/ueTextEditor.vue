<template>
  <div>
 
      <quill-editor v-model="content" ref="myQuillEditor" style="height: 500px;" :options="editorOption">
      </quill-editor>
      <el-button style="z-index:99999;position:absolute;left:0px;top:0px;"  @click="showDialog=true">测试</el-button>
       <div style="" v-html="content"
            >
            </div>
            </div>
  
</template>

<script>
  import {
    quillEditor
  } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  export default {
    name: 'FuncFormsEdit',
    components: {
      quillEditor
    },
    data() {
      return {
        showDialog:false,
        content: null,
        editorOption: {}
      }
    },watch: {
      content(val) {
          console.log(val);
        
      }
    }
  }

</script>

<style scoped>
</style>

