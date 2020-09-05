import Vue from 'vue'
import Vuex from 'vuex'

import login from './stores/Login/store.js'
import HproseTest from './stores/hproseTest/store.js'
import process from './stores/process/store.js'
import dbClient from './stores/DBetails/store.js'
import thematic from './stores/thematic/store.js'
import common from './stores/common/store.js'
Vue.use(Vuex)


export default new Vuex.Store({
    modules: {
        HproseTest,
        process,
        dbClient,
        thematic,
        login,
        common
    }
})