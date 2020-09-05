<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="救援图集上传测试" name="first">
        <el-row :gutter="24">
          <el-col :span="8">
            <table>
              <tr>
                <td>参数录入：</td>
                <td>
                  <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="inputParam"></el-input>
                </td>
              </tr>
              <tr>
                <td>上传路径：</td>
                <td>
                  <el-input v-model="uploadAction" placeholder="请输入内容"></el-input>
                </td>
              </tr>
              <tr>
                <td>是否缩略图：</td>
                <td>
                  <el-radio-group v-model="param.isMini">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </td>
              </tr>
              <tr>
                <td>数据id：</td>
                <td>
                  <el-input size="mini" v-model="param.data_id" placeholder="请输入内容"></el-input>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="uploadAction"
                    :on-preview="handlePreview"
                    :before-remove="beforeRemove"
                    :auto-upload="false"
                    :limit="1"
                    :data="param"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                    :on-success="submitSuccess"
                  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button
                      style="margin-left: 10px;"
                      size="small"
                      type="success"
                      @click="submitUpload"
                    >上传到服务器</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </td>
              </tr>
            </table>
          </el-col>
          <el-col :span="8">
            <table>
              <tr>
                <td>参数：</td>
                <td>
                  <table>
                    <tr v-for="(item,index) in param" :key="index">
                      <td>{{index}}:</td>
                      <td>{{item}}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </el-col>
          <el-col :span="8">
            返回参数：
            {{responsedata}}
          </el-col>
        </el-row>
        <hr style="margin-top:50px;" />
        <el-row :gutter="24">
          <el-col :span="12">
            <table>
              <tr>
                <td>下载路径：</td>
                <el-input v-model="downloadurl" style="width:400px;" placeholder="请输入内容"></el-input>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <el-button @click="downloadTest" type="success">下载上传的文件（id为10的）</el-button>
                </td>
              </tr>
              <tr>
                <td>下载图片展示：</td>
                <td>
                  <img
                    style="width:100px;heigth:200px;"
                    :src="downloadurl"
                    :onerror="defaultImgURL"
                  />
                </td>
              </tr>
            </table>
          </el-col>
          <el-col :span="12">
            <table>
              <tr>
                <td>缩略图预览路径:</td>
                <td>
                  <el-input v-model="imageDownloadUrl" style="width:400px;" placeholder="请输入内容"></el-input>
                </td>
              </tr>
              <tr>
                <td>缩略图预览</td>
                <td>
                  <img
                    style="display:block;width:200px;height:200px;"
                    alt="请输入正确的路径"
                    :src="imageDownloadUrl"
                    :onerror="defaultImgURL"
                  />
                </td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <hr style />
      </el-tab-pane>
      <el-tab-pane label="大文件上传测试" name="second">
        上传路径：
        <el-input v-model="bigFileUploadURL" placeholder="请输入内容"></el-input>
        备注：服务返回值 {total: 63, name: "20190826部署.zip", index: 60, end: false, state: true} end为是否切片
        <FileUpload
          ref="fileupload"
          isMultiple="false"
          labelname="上传数据"
          onlyid="fileinput4"
          :fileUploadURL="bigFileUploadURL"
          :histFileArr="[]"
          @successvalue="successvalue"
          @fileDelOper="fileDelOper"
        ></FileUpload>
      </el-tab-pane>
      <el-tab-pane label="普通文件上传测试" name="third">
        <el-input v-model="uploadAction2" ></el-input>
              <el-upload
                    class="upload-demo"
                    :action="uploadAction2"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :auto-upload="true"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :on-success="submitSuccess2"
                    :data="{uploadtype:'1'}"
                  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                   </el-upload>

                  
      </el-tab-pane>
     <el-tab-pane label="制作缩略图" name="fourth">
        <el-input v-model="uploadAction2" ></el-input>
              <el-upload
                    class="upload-demo"
                    :action="uploadAction2"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :auto-upload="true"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :on-success="submitSuccess2"
                  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                   </el-upload>

                  
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FileUpload from "./components/bigfiles";
export default {
  name: "UploadTest",
  components: {
    FileUpload
  },
  data() {
    return {
      responsedata: "",
      inputParam: "",
      param: {
        isMini: false,
        data_id: 10,
        classify: "2-1",
        name: "图集名",
        location: "制图区域",
        enable: true,
        updated_version: 1,
        updated_user: 11001000060,
        created_user: 11001000060,
        year: "2019",
        updated_at: "2019-09-10 21:23:22",
        created_at: "2019-09-10 21:23:22",
        isPublic: true,
        publictype: "1",
        details: "详情",
        atlastype: "71"
      },
      defaultImgURL:
        'this.src="' + require("../../../static/img/nouse.png") + '"',
      activeName: "first",
      fileList: [],
      inputa: "{}",
      isMini: false,
      uploadAction: "http://localhost:8085/file/uploadAtlas",
      downloadurl:
        "http://localhost:8085/file/downloadAtlas?data_id=10&isdownload=true",
      imageDownloadUrl:
        "http://localhost:8085/file/downloadAtlas?data_id=10&isdownload=false",
      selectedOptions: [],
      selectedOptions2: [],
      //大文件上传
      bigFileUploadURL: window.processServiceURL + "file/uploadBigFiles",
      histFileArr: [],
      // uploadAction2:"http://localhost:8085/file/uploadThematic"
      uploadAction2:"http://localhost:9006/qgzhdc/import/api/v1/importCommonPcNew/993/zrzhczt_ggfwss_xx"
    };
  },
  mounted() {
    this.inputParam = JSON.stringify(this.param);
  },
  watch: {
    inputParam: function(newvalue, oldvalue) {
      this.param = JSON.parse(newvalue);
    },
    param: {
      handler: function(newValue, oldval) {
        this.inputParam = JSON.stringify(newValue);
      },
      deep: true //对象内部的属性监听，也叫深度监听
    },
    AllhistFileArr() {
      this.AllhistFileArr.forEach(ele => {
        this.histFileArr.push({
          PID: ele.PID,
          WDFL: ele.WDFL,
          SJFL: ele.SJFL,
          WDMC: ele.WDMC,
          WJLJ: ele.WJLJ,
          CJRID: this.$store.state.Login.userInfo.ID,
          CJSJ: this.formatTime(new Date()),
          CJRMC: this.$store.state.Login.userInfo.REALNAME
        });
      });
    }
  },
  methods: {
    handleChange() {},
    addBaseMap() {
    
      this.$router.push({ path: "/firstmap", query: { id: "001" } });
    },
    TDTMap() {
      this.$router.push({ path: "/TDTMap" });
    },
    UploadTest() {
      this.$router.push({ path: "/UploadTest" });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    //上传文件成功时的返回值
    submitSuccess(response) {
      console.log("成功返回值：" + response);
      this.responsedata = response.data;
    },
    submitSuccess2(response){
      console.log("test:",response);
      window.href.location=response.data;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除`);
    },
    submitUpload() {
      this.param.created_at = new Date();
      this.param.updated_at = new Date();
      this.$refs.upload.submit();
    },
    downloadTest() {
      window.open(this.downloadurl);
      // window.location.href =
    },

    //大文件上传
    successvalue(value) {
      let status = false;
      this.histFileArr.forEach(element => {
        if (element.WDMC == value.WDMC) status = true;
      });
      if (!status) {
        this.histFileArr.push({
          WDMC: value.WDMC,
          WJLJ: value.WJLJ,
          CJSJ: this.formatTime(new Date())
        });
        console.log("文件上传成功：" + this.histFileArr);
      }
    },
    fileDelOper() {
      this.histFileArr = val;
    }
  },
  mounted(){
        this.$axios.get("http://localhost:8085/resources/imagebrowser/aaa.json").then(response=>{
                debugger;
                console.log(response);
            });
        }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
