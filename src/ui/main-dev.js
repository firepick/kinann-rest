import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import RestBundle from "rest-bundle/vue";
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
