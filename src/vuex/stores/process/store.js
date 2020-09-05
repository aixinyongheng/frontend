/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 09:15:13
 * @LastEditTime: 2019-09-28 13:27:48
 * @LastEditors: Please set LastEditors
 */
import * as TYPES from './mutation-types.js'
import  {
  processClient
} from '../../../httpClient.js'

const state = {
  showpanel: '0',
  paneltab: '0',
  showPlot: {}

};

const mutations = {
  [TYPES.SET_SHOWPANEL]: (state, showpanel) => state.showpanel = showpanel,
  [TYPES.SET_PANELTAB]: (state, paneltab) => state.paneltab = paneltab,
  SET_SHOWPLOT: (state, showPlot) => state.showPlot = showPlot

};
const getters = {

  [TYPES.GET_SHOWPANEL]: ({
    showpanel
  }) => showpanel,
  [TYPES.GET_PANELTAB]: ({
    paneltab
  }) => paneltab,
  GET_SHOWPLOT: ({
    showPlot
  }) => showPlot
};

const actions = {
  //获取流程定义
  [TYPES.findProcessDefinitions]
  : async ({
    dispatch
  },{curpage,pagesize}) => {
    return await processClient.invoke('findProcessDefinitions', [curpage,pagesize]);
  },
  //获取用户列表
  getUserList:async ({
    dispatch
  }, {curpage,pageSize,keywords}) => {
    return await processClient.invoke('getUserList', [curpage,pageSize,keywords]);
  },

  getHTTPContent: async ({
    dispatch
  }, murl) => {
    return await processClient.invoke('getHTTPContent', [murl]);
  },
  /**
   * @description: 通用的新建方法
   * @param {String} tableType
   * @param {json} json 
   * @return: 
   */
  createAndUpdateData: async ({
    commit
  }, {
    tableType,
    json
  }) => {
    return await processClient.invoke('createAndUpdateData', [tableType, json])
  },
  /**
   * @description:通用获取列表 
   * @param {type} pageNo  
   * @param {type}  pageSize
   * @param {type} tableComment 
   * @param {type} conds
   * @return: 
   */
  getdataListByCond: async ({
    commit
  }, {
    pageNo,
    pageSize,
    tableComment,
    conds
  }) => {
    return await processClient.invoke('getdataListByCond', [pageNo, pageSize, tableComment, conds])
  },
  /**
   * @description:通用获取详情
   * @param {type} tableComment  
   * @param {type}  ID
   * @param {type} url 
   * @return: 
   */
  getTableInfo:async({commit},{tableComment,ID,url}) =>{
    return await processClient.invoke('getTableInfo',[tableComment,ID,url])
  },
  /**
   * @description:获取事件列表
   * @param {String}  pageNum
   * @param {String} pageSize  
   * @param {String} isAdmin 
   * @param {String} userid 
   * @param {json} conds 
   * @return: 
   */
  getSJList:async({commit},{pageNum,pageSize,isAdmin,userid,conds}) =>{
    return await processClient.invoke('getServiceInfoList',[pageNum,pageSize,isAdmin,userid,conds])
  },
  /**
   * @description: 生成UUID
   * @param {type} 
   * @return: 
   */
  newuuid() {
    var guid = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    var guid1 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    var guid2 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    var guid3 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    var guid4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    var guid5 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    var guid6 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    var guid7 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return (guid + guid1 + "-" + guid2 + "-" + guid3 + "-" + guid4 + "-" + guid5 + guid6 + guid7);
  }
}

export default {
  state,
  mutations,
  getters,
  actions,
}
