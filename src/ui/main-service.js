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

console.log("RestBundle", Object.keys(RestBundle));

new Vue({
    el: '#service',
    store: store,
    render: h => h(Service),
    beforeMount() {
        if ( null == this.$el.attributes["service-name"]) {
            throw new Error("service name is required");
        }
        this.$store.state.serviceName = this.$el.getAttribute("service-name");
        console.log("main-service beforeMount", this.$store.state.serviceName);
    },
})
