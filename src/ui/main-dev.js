console.log("hello");
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import RestBundle from "rest-bundle/vue";
console.log("RestBundle", Object.keys(RestBundle));
import Dev from './Dev.vue';
require('./stylus/main.styl')

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.use(RestBundle);

const store = new Vuex.Store({
    // app store
});


new Vue({
    el: '#dev',
    store: store,
    render: h => h(Dev),
})
