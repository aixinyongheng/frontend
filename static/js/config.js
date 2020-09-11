/** 内网地址 */


window.tdtToken="80a23aed6ba5c4ad7d1f0647a619f294";
//if (window.location.host.indexOf('localhost') != -1||window.location.host.indexOf('172.16.106.5') != -1) {
  if (window.location.host.indexOf('172.16.106.5') != -1) {
    window.processServiceURL = "http://172.16.106.5:8070/qxgl/";
    var websocketUrl = "172.16.106.5:8070/qxgl";
    var baseService = processServiceURL+'HproseServer'//java服务地址
    var processService = processServiceURL+'HproseServer' //process  工作流  java服务地址
    var dbService = processService;
    window.dbServiceUrl = "http://172.16.106.5:8070/qxgl/";
    window.uplaodUrl="http://172.16.106.5:8070/qxgl/file/uploadFiles";
    window.downloadUrl="http://172.16.106.5:8070/";
    var uploadthematicUrl = window.processServiceURL+"/file/uploadThematic"
  } else if (window.location.host.indexOf('localhost1') != -1) {
    window.processServiceURL = "http://localhost:8070/";
    var websocketUrl = "localhost:8070/";
    var baseService = processServiceURL+'HproseServer'//java服务地址
    var processService = processServiceURL+'HproseServer' //process  工作流  java服务地址
    var dbService = processService;
    window.dbServiceUrl = "http://localhost:8070/";
    window.uplaodUrl="http://localhost:8070/file/";
    window.downloadUrl="http://localhost:8070/";
    var uploadthematicUrl = window.processServiceURL+"/file/uploadThematic"
  }else
  {
    // 外网部署
    window.processServiceURL = "http://39.105.87.199:8090/qxgl/";
    var websocketUrl = "39.105.87.199:8090/qxgl";
    var baseService = window.processServiceURL+'HproseServer'//java服务地址
    var processService = window.processServiceURL+'HproseServer' //process  工作流  java服务地址
    var dbService = processService;
    window.dbServiceUrl = "http://39.105.87.199:8090/qxgl/";
    window.uplaodUrl="http://39.105.87.199:8090/qxgl//file/uploadFiles";
    window.downloadUrl="http://39.105.87.199:8090/qxgl/";
    var uploadthematicUrl = window.processServiceURL+"/file/uploadThematic"
}
  

