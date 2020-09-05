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


};
const getters = {

 
};

const actions = {
  // 获取
  [TYPES.getdataListByCond]
  : async ({
    dispatch
  },{curpage,pagesize,tableComment,conds}) => {
    return await processClient.invoke('getdataListByCond', [curpage,pagesize,tableComment,conds]);
  },
  // 编辑
  [TYPES.createAndUpdateData]
  : async ({
    dispatch
  },{tableComment,json}) => {
    return await processClient.invoke('createAndUpdateData', [tableComment,json]);
  },
    // 编辑多条
    [TYPES.createAndUpdateDatas]
    : async ({
      dispatch
    },{tableComment,json}) => {
      return await processClient.invoke('createAndUpdateDatas', [tableComment,json]);
    },
   // 删除
   [TYPES.forDelete]
   : async ({
     dispatch
   },{ID,tableComment}) => {
     return await processClient.invoke('forDelete', [ID,tableComment]);
   },
   [TYPES.getUserInfo]
   : async ({
     dispatch
   }) => {
     return await processClient.invoke('getUserInfo');
   }
   
}

export default {
  state,
  mutations,
  getters,
  actions,
}
