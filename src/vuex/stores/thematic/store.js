/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 09:15:13
 * @LastEditTime: 2019-09-28 13:27:48
 * @LastEditors: Please set LastEditors
 */
import * as TYPES from './mutation-types.js'
import  {
  hpClient
} from '../../../httpClient.js'


const mutations = {


};
const getters = {

};

const actions = {
  //获取专题列表
  getThematicList
  : async ({
    dispatch
  },{pageNum,pageSize,type,userid,isMine,deptId,keyword,conds}) => { 
    return await hpClient.invoke("getThematicList", [pageNum,pageSize,type,userid,isMine,deptId,keyword,conds]);
  },
  //通过专题id获取列
  getThematicColumn
  : async ({
    dispatch
  },{thematic_id}) => { 
    return await hpClient.invoke("getThematicColumn", [thematic_id]);
  },
  getThematicData
  : async ({
    dispatch
  },{thematic_id,column_ids}) => { 
    return await hpClient.invoke("getThematicData", [thematic_id,column_ids]);
  },
  deleteThematics:async ({
    dispatch
  },{thematic_id}) => { 
    return await hpClient.invoke("deleteThematics", [thematic_id]);
  },

  
}

export default {
  mutations,
  getters,
  actions,
}
