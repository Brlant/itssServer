import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import dict from './modules/dict'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    dict,
    user,
    tagsView,
    permission,
    settings
  },
  getters,
  state: {
    regionOptions: [],
    postTypeOptions: [],
    techniqueOptions: [],
    gradeIdOptions: [],
    chanceDetail: {
      formData: null,
      chanceConfigList: []
    }
  },
  mutations: {
    setRegionOptions(state, value) {
      state.regionOptions = value
    },
    setPostTypeOptions(state, value) {
      state.postTypeOptions = value
    },
    setTechniqueOptions(state, value) {
      state.techniqueOptions = value
    },
    setGradeIdOptions(state, value) {
      state.gradeIdOptions = value
    },
    setChanceDetail(state, value) {
      state.chanceDetail.formData = value.formData
      state.chanceDetail.chanceConfigList = value.chanceConfigList
    }
  }
})

export default store
