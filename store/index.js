import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => {
  return new Vuex.Store({
    state: {
      currentUser: {},
      loading: false,
      topMessage: {
        status: false,
        message: '',
        type: '',
      },
    },

    mutations: {
      setUser (state, payload) {
        state.currentUser = payload
      },
      setLoading (state, payload) {
        state.loading = payload
      },
      setNotice (state, payload) {
        state.topMessage = payload
      },
    },

    action: {},
  })
}

export default store
