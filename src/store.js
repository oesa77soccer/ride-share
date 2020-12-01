import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

// Simple example of using the Vuex package to manage global state.
// Refer to the complete Vuex documentation: https://vuex.vuejs.org/

// Most of the code in this sample uses the most verbose ways to
// access and update global state. Refer to the vuex documentation
// for some nifty ways to make this less painful. For example:
// https://vuex.vuejs.org/guide/state.html#the-mapstate-helper

export default new Vuex.Store({

    plugins: [createPersistedState()],

  // Single source for application state.
  // Cannot update state directly; use a `mutation` (below).
  // Access in components as `this.$store.state.currentUser`
  state: {
    currentUser: null
  },

  // A "getter" returns a computed property from the store, similar
  // to a `computed` property in a component.
  // Access in components as `this.$store.getters.isLoggedIn`
  // (Not that it behaves like a property -- no parens.)
  getters: {
    isDriver(state) {
      return state.currentUser.isDriver;
    },
    
    isLoggedIn(state) {
      return state.currentUser !== null;
    },

    userId(state) {
        return state.currentUser.id;
    },

    isAdmin(state) {
        return state.currentUser.isAdmin;
    }
  },

  // Make changes to global state.
  // Access in components using the `commit` method:
  // `this.$store.commit('logIn', user)`
  mutations: {
    becomeDriver(state) {
      state.currentUser.isDriver = true;
    },

    logIn(state, user) {
      state.currentUser = user;
    },
    logOut(state) {
      state.currentUser = null;
    }
  }
});
