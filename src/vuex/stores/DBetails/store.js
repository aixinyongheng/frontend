

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
  //导出word
  getDbDetailToWord:async ({
    dispatch
  }, {databaseType, ip, port, databaseName, username, password}) => {
    return await processClient.invoke('getDbDetailToWord', [databaseType, ip, port, databaseName, username, password]);
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
