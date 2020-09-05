

import  {
  hpClient
} from '../../../httpClient.js'

const state = {
  userInfo: null
};

const mutations = {
    setUserInfo: (state, userInfo) => state.userInfo = userInfo,
};
const getters = {


};

const actions = {
  //登录
  loginTest:async ({
    dispatch
  }, {username, password}) => {
    return await hpClient.invoke('loginTest', [username, password]);
  }
}

export default {
  state,
  mutations,
  getters,
  actions,
}
