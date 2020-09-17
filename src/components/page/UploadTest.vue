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
      <el-tab-pane label="大文件切片上传测试" name="second">
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

        <el-tab-pane label="文件上传测试" name="fourth">
          上传地址配置：
          <el-input v-model="uploadAction2" > <i slot="suffix" title="保存路径" style="color:red" @click="saveuploadpz" class="el-input__icon el-icon-collection-tag"></i></el-input>
              <div class="upload_single">
                <el-tag type="success"> 单文件</el-tag> <el-tag> 自动上传</el-tag>
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
                </div>
                <div class="upload_multi">
                  <el-tag type="success">多文件</el-tag> <el-tag >手动上传</el-tag>
                        <el-upload
                          class="upload-demo"
                          ref="uploadmulti"
                          :multiple=true
                          :action="uploadAction2"
                          :http-request="uploadMultiFile"
                          :auto-upload="false"
                          >
                          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadMulti">上传到服务器</el-button>
                          <div slot="tip" class="el-upload__tip">上传文件不超过500kb</div>
                        </el-upload>
                      <!-- <el-upload
                            class="upload-demo"
                            :action="uploadAction2"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :auto-upload="false"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :on-success="submitSuccess2"
                          >
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                          </el-upload> -->
                
                </div>
       </el-tab-pane>






      <el-tab-pane label="全国灾害模板上传测试" name="third">
        <table>
          <tr>
              <el-select v-model="flbm" placeholder="请选择">
                  <el-option
                    v-for="item in flbmarr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            <!-- <el-cascader
              v-model="flbm"
              :options="flbmarr"
            ></el-cascader> -->
            <td> 分类表名:<el-input v-model="flbm" placeholder="请输入分类表名"></el-input></td>
            <td>  ip:<el-input v-model="uploadAction2Ip" ></el-input></td>
             <td>    用户id:<el-input v-model="userid" ></el-input></td>
            <td>   level:<el-input v-model="level" ></el-input></td>
             <td> accesstoken: <el-input v-model="accesstoken" ></el-input></td>
           </tr>
           </table>
              <hr style="margin-top:20px;margin-bottom:20px; ">
            地址：
            <el-input v-model="uploadAction2" ></el-input>
              <el-upload
                    class="upload-demo"
                    :action="uploadAction2"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :auto-upload="true"
                    :limit="50"
                    :on-exceed="handleExceed"
                    :on-success="submitSuccess2"
                    :data="{uploadtype:'1'}"
                  >
                   <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                   </el-upload>
                   确认导入地址:http://{{this.uploadAction2Ip}}:9006/qgzhdc/import/api/v1/importData/confirmImportPc
                   <el-button @click="confirmImprot" >确认导入</el-button>
                   <br>
                   导出错误服务地址：
                   http://{{this.uploadAction2Ip}}:9006/qgzhdc/import/api/v1/exportErrorDataPc/{{this.userid}}?tablename={{this.flbm}}
                  <el-button @click="exportError" >导出错误数据</el-button>
                  <div style="background:yellow" > {{uploadResponse}}</div>
                  <div>
                    <el-button @click="clickNew">cehsi </el-button>
                    
                    <a href="http://172.16.106.5:9006/qgzhdc/import/api/v1/downloadFile?filepath=zdyh_zrzhcsaqscsgyhss_hgyq_pc\3737\100万数据(分省)-110111-1600245811727.rar&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAzMDg0OTcsInVzZXJpZCI6MzI4NywidXNlcm5hbWUiOiLmiL_lsbHljLrlupTmgKXnrqHnkIblsYAiLCJkZXBhcnRtZW50aWQiOiIxMTAxMTEiLCJ5aGx4IjoiMCIsImtleSI6IkYxRDkzQkY1MjBCQTZFRUVDQzdDNkREQzQ2RjJBRUI2IiwiaWF0IjoxNjAwMjIyMDk3fQ.3t0UrJQMXze5zMVow9KWev17_zzTqkHRB1OzUrDRlBw"
    >测试导出</a></div>
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
        atlastype: "71",
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
      flbm:"zrzhczt_ggfwss_xx",
      uploadAction2Ip:"172.16.106.5",
      userid:3287,
      accesstoken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAyMzkwNjIsInVzZXJpZCI6MzI4NywidXNlcm5hbWUiOiLmiL_lsbHljLrlupTmgKXnrqHnkIblsYAiLCJkZXBhcnRtZW50aWQiOiIxMTAxMTEiLCJ5aGx4IjoiMCIsImtleSI6IkYxRDkzQkY1MjBCQTZFRUVDQzdDNkREQzQ2RjJBRUI2IiwiaWF0IjoxNjAwMTUyNjYyfQ.PxeiL-ooMePcRmTNFxPD8odSN5UpRlweyVI-9cjo9y4",
      level:4,
      uploadAction2:"http://172.16.106.5:9006/qgzhdc/import/api/v1/importDataPc/3287/2?tablename=zrzhczt_ggfwss_xx&lev=4&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAyMzkwNjIsInVzZXJpZCI6MzI4NywidXNlcm5hbWUiOiLmiL_lsbHljLrlupTmgKXnrqHnkIblsYAiLCJkZXBhcnRtZW50aWQiOiIxMTAxMTEiLCJ5aGx4IjoiMCIsImtleSI6IkYxRDkzQkY1MjBCQTZFRUVDQzdDNkREQzQ2RjJBRUI2IiwiaWF0IjoxNjAwMTUyNjYyfQ.PxeiL-ooMePcRmTNFxPD8odSN5UpRlweyVI-9cjo9y4",
      uploadResponse:"",
      flbmarr:[],
      formDate:null,
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
    clickNew(){
       // 此下载方式只适合小文件下载！！！  下载占用内存，并且无进度   适用于下载后台处理时间长、文件小的文件。
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
          this.$axios({
          method: "get", //请求方式
          responseType: "blob", //告诉服务器我们需要的响应格式
          url: "http://172.16.100.156:9305/qgzhdc/dataManage/api/v1/batchTool?op=1&code=0&yhlx=0&queryCode=0&tag=2", //地址
          // url:`http://172.16.106.5:9006/qgzhdc/import/api/v1/downloadFile?filepath=zdyh_zrzhcsaqscsgyhss_hgyq_pc/3737/西藏自治区25万shp-110111-1600246267922.zip&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAzMDg0OTcsInVzZXJpZCI6MzI4NywidXNlcm5hbWUiOiLmiL_lsbHljLrlupTmgKXnrqHnkIblsYAiLCJkZXBhcnRtZW50aWQiOiIxMTAxMTEiLCJ5aGx4IjoiMCIsImtleSI6IkYxRDkzQkY1MjBCQTZFRUVDQzdDNkREQzQ2RjJBRUI2IiwiaWF0IjoxNjAwMjIyMDk3fQ.3t0UrJQMXze5zMVow9KWev17_zzTqkHRB1OzUrDRlBw`
        }).then(res => {
          loading.close();
          let url = window.URL.createObjectURL(new Blob([res.data])); //转换为可用URl地址
          let link = document.createElement("a"); //创建a标签
          link.style.display = "none"; //使之不可见
          link.href = url; //赋URL地址
          link.setAttribute("download", "aaa.zip"); //设置下载属性、以及文件名
          document.body.appendChild(link); //将a标签插至页面中
          link.click(); //强制触发a标签事件
        }).catch(err=>{
            loading.close();
        });
    },
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

      //console.log("test:",response);
      //window.href.location=response.data;
      this.uploadResponse=response
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除`);
    },
    submitUpload() {
      this.param.created_at = new Date();
      this.param.updated_at = new Date();
      this.$refs.upload.submit();
    },
    submitUploadMulti(){
     
       this.formDate = new FormData()
       this.$refs.uploadmulti.submit(); //执行此步骤 相当于执行 http-request 的自定义实现方法
       let config = {
          headers: {
             'Content-Type': 'multipart/form-data'
          }
         }    
       this.$axios.post(this.uploadAction2, this.formDate,config).then( res => {
            console.log(res)  
       }).catch( res => {
            console.log(res)
       })
    },
    uploadMultiFile(file){
         this.formDate.append('files'+Math.floor((Math.random()*100)+1), file.file);
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
    },
    confirmImprot(){
      this.$axios.post(`http://${this.uploadAction2Ip}:9006/qgzhdc/import/api/v1/importData/confirmImportPc?token=${this.accesstoken}`,{"cjrid":this.userid,"tablename":this.flbm,"csshjbpc":"4","cjrmc":"房山区应急管理局"}).then(res=>{
        this.uploadResponse=JSON.stringify(res)
      }).catch(err=>{
        this.$message.error("服务出错");
      });
    },
    exportError(){
     window.location.href=`http://${this.uploadAction2Ip}:9006/qgzhdc/import/api/v1/exportErrorDataPc/${this.userid}?tablename=${this.flbm}`;
    },
    saveuploadpz(){
      let oldPz={};
      if (window.localStorage.getItem('uploadPz')) {
         oldPz = JSON.parse(window.localStorage.getItem('uploadPz'));
      } 
      oldPz.uploadAction2=this.uploadAction2;
      window.localStorage.setItem("uploadPz",JSON.stringify(oldPz));
      this.$message.success("保存成功");
    }
  },
  mounted(){
        // this.$axios.get("http://localhost:8085/resources/imagebrowser/aaa.json").then(response=>{
        //         debugger;
        //         console.log(response);
        //     });

        this.flbmarr=[{"label":"学校","value":"zrzhczt_ggfwss_xx","id":"706aff2c-f008-11ea-b920-000c2927948f"},{"label":"医疗卫生机构","value":"zrzhczt_ggfwss_ylwsjg","id":"706b035a-f008-11ea-b920-000c2927948f"},{"label":"提供住宿的社会服务机构","value":"zrzhczt_ggfwss_tgzsdshfwjg","id":"706b067a-f008-11ea-b920-000c2927948f"},{"label":"公共文化场所","value":"zrzhczt_ggfwss_ggwhcs","id":"706b0878-f008-11ea-b920-000c2927948f"},{"label":"旅游景区","value":"zrzhczt_ggfwss_lyjq","id":"706b0a4e-f008-11ea-b920-000c2927948f"},{"label":"星级饭店","value":"zrzhczt_ggfwss_xjfd","id":"706b0bb6-f008-11ea-b920-000c2927948f"},{"label":"体育场馆","value":"zrzhczt_ggfwss_tycg","id":"706b0d14-f008-11ea-b920-000c2927948f"},{"label":"宗教活动场所","value":"zrzhczt_ggfwss_zjhdcs","id":"706b0e68-f008-11ea-b920-000c2927948f"},{"label":"大型超市、百货店和亿元以上商品交易市场","value":"zrzhczt_ggfwss_spjysc","id":"706b0fc6-f008-11ea-b920-000c2927948f"},{"label":"基础指标统计表","value":"zrzhczt_ggfwss_jczbtjb","id":"706b1124-f008-11ea-b920-000c2927948f"},{"label":"政府灾害管理能力","value":"zhjzzy_zfzhjzzy_zfzhglnl","id":"706b1282-f008-11ea-b920-000c2927948f"},{"label":"综合性、政府专职和企业专职消防救援队伍与装备","value":"zhjzzy_zfzhjzzy_zhxzfzzhqyzzxfjydwyzb","id":"706b1412-f008-11ea-b920-000c2927948f"},{"label":"森林消防队伍与装备","value":"zhjzzy_zfzhjzzy_slxfdwyzb","id":"706b15ac-f008-11ea-b920-000c2927948f"},{"label":"航空护林站队伍与装备","value":"zhjzzy_zfzhjzzy_hkhlzdwyzb","id":"706b1714-f008-11ea-b920-000c2927948f"},{"label":"地震专业救援队伍与装备","value":"zhjzzy_zfzhjzzy_dzzyjydwyzb","id":"706b1872-f008-11ea-b920-000c2927948f"},{"label":"矿山/隧道行业救援队伍与装备","value":"zhjzzy_zfzhjzzy_kssdhyjydwyzb","id":"706b19d0-f008-11ea-b920-000c2927948f"},{"label":"危化/油气行业救援队伍与装备","value":"zhjzzy_zfzhjzzy_whyqhyjydwyzb","id":"706b1b2e-f008-11ea-b920-000c2927948f"},{"label":"海事救援队伍与装备","value":"zhjzzy_zfzhjzzy_hsjydwyzb","id":"706b1c82-f008-11ea-b920-000c2927948f"},{"label":"救灾物资储备库（点）","value":"zhjzzy_zfzhjzzy_jzwzcbkd","id":"706b1de0-f008-11ea-b920-000c2927948f"},{"label":"应急避难场所","value":"zhjzzy_zfzhjzzy_yjbncs","id":"706b1f48-f008-11ea-b920-000c2927948f"},{"label":"渔船避风港","value":"zhjzzy_zfzhjzzy_ycbfg","id":"706b211e-f008-11ea-b920-000c2927948f"},{"label":"救援装备资源企业","value":"zhjzzy_qyyshlljzzy_jyzbzy","id":"706b231c-f008-11ea-b920-000c2927948f"},{"label":"保险和再保险企业综合减灾资源（能力）","value":"zhjzzy_qyyshlljzzy_bxhzbxqyzhjzzynl","id":"706b2506-f008-11ea-b920-000c2927948f"},{"label":"社会应急力量综合减灾资源","value":"zhjzzy_qyyshlljzzy_shyjllzhjzzy","id":"706b26f0-f008-11ea-b920-000c2927948f"},{"label":"乡镇（街道）综合减灾资源（能力）","value":"zhjzzy_jczhjzzy_xzjdzhjzzynl","id":"706b2858-f008-11ea-b920-000c2927948f"},{"label":"社区（行政村）综合减灾资源（能力）","value":"zhjzzy_jczhjzzy_sqxzczhjzzynl","id":"706b29b6-f008-11ea-b920-000c2927948f"},{"label":"家庭减灾资源（能力）数据采集规范","value":"zhjzzy_jtjzzy_jtjzzynlsjcjgf","id":"706b2b14-f008-11ea-b920-000c2927948f"},{"label":"化工园区","value":"zdyh_zrzhcsaqscsgyhss_hgyq","id":"706b2d62-f008-11ea-b920-000c2927948f"},{"label":"危险化学品企业","value":"zdyh_zrzhcsaqscsgyhss_wxhxpqy","id":"706b2f4c-f008-11ea-b920-000c2927948f"},{"label":"地下矿山","value":"zdyh_zrzhcsfmkssgwxy_dxks","id":"706b312c-f008-11ea-b920-000c2927948f"},{"label":"排土场（废石场）","value":"zdyh_zrzhcsfmkssgwxy_ltks","id":"706b3316-f008-11ea-b920-000c2927948f"},{"label":"尾矿库","value":"zdyh_zrzhcsfmkssgwxy_wkk","id":"706b3500-f008-11ea-b920-000c2927948f"},{"label":"煤矿","value":"zdyh_zrzhcsmksgwxy_mk","id":"706b36e0-f008-11ea-b920-000c2927948f"},{"label":"年度自然灾害","value":"lszh_lszh_ndzrzh","id":"706b387a-f008-11ea-b920-000c2927948f"},{"label":"历史重大灾害事件","value":"lszh_lszh_lszdzhsj","id":"706b39e2-f008-11ea-b920-000c2927948f"},{"label":"历史一般自然灾害事件","value":"lszh_lszh_lsybzrzhsj","id":"706b3b86-f008-11ea-b920-000c2927948f"}];
   
      if (window.localStorage.getItem('uploadPz')) {
          let uploadPz= JSON.parse(window.localStorage.getItem('uploadPz'));
          this.uploadAction2=uploadPz.uploadAction2;
      } 
        
      
    },
  watch:{
    flbm(newval, oldval2) {
      console.log(newval,oldval2);
         console.log(this.flbm);
      this.uploadAction2=`http://${this.uploadAction2Ip}:9006/qgzhdc/import/api/v1/importDataPc/${this.userid}/2?tablename=${newval}&lev=${this.level}&token=${this.accesstoken}`
    },
    uploadAction2Ip(newval, oldval2){
      this.uploadAction2=`http://${newval}:9006/qgzhdc/import/api/v1/importDataPc/${this.userid}/2?tablename=${this.flbm}&lev=${this.level}&token=${this.accesstoken}`
    },
    userid(newval,oldval2){
      this.uploadAction2=`http://${this.uploadAction2Ip}:9006/qgzhdc/import/api/v1/importDataPc/${newval}/2?tablename=${this.flbm}&lev=${this.level}&token=${this.accesstoken}`
    },
    level(newval,oldval){
      this.uploadAction2=`http://${this.uploadAction2Ip}:9006/qgzhdc/import/api/v1/importDataPc/${this.userid}/2?tablename=${this.flbm}&lev=${newval}&token=${this.accesstoken}`
    },
    accesstoken(newval,oldval){
      this.uploadAction2=`http://${this.uploadAction2Ip}:9006/qgzhdc/import/api/v1/importDataPc/${this.userid}/2?tablename=${this.flbm}&lev=${newval}&token=${newval}`

    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.upload_single{
  margin-top:20px;
  width:50%;
  float:left;
}
.upload_multi{
   margin-top:20px;
   width:50%;
   float:left;
}
.upload-demo{
  margin:10px 10px;
}
</style>
