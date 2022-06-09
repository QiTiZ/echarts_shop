import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'black'
  },
  mutations: {
    changeTheme(state) {
      if (state.theme === 'black') {
        state.theme = 'white'
      } else {
        state.theme = 'black'
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
