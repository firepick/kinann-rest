<template>

<v-card >
    <v-card-row class="secondary" >
        <v-card-title>
            <span class="" >Service Home Page</span>
            <v-spacer></v-spacer>
            <span  class="">/{{serviceName}}</span>
        </v-card-title>
    </v-card-row>
    <v-card-text v-show="mode==='connect'">
        <v-btn
            light flat
            v-bind:loading="loading" 
            @click.native="update()" 
            v-bind:disabled="loading"
            >Verify Connections</v-btn>
        <v-card hover v-tooltip:bottom='{html:"<rb-identity/>"}' >
            <rb-identity class="mb-3" :service="serviceName"/>
        </v-card>
    </v-card-text>
    <v-card-text v-show="mode==='configure'">
        <h6>Configuration</h6>
        <v-card hover v-tooltip:bottom='{html:"<kr-config/>"}'>
            <kr-config class="mb-3" :service="serviceName"/>
        </v-card>
    </v-card-text>
    <v-card-text v-show="mode==='operate'">
        <h6 >Position</h6>
        <v-card hover v-tooltip:bottom='{html:"<kr-position/>"}' >
            <kr-position :service="serviceName"/>
        </v-card>
    </v-card-text>
    <div style="position:relative">
        <v-bottom-nav style="bottom:60px" class="transparent">
            <v-btn flat light class="teal--text" @click.native="mode='connect'" :value="mode === 'connect'">
              <span>Connect</span>
              <v-icon>cloud</v-icon>
            </v-btn>
            <v-btn flat light class="teal--text" @click.native="mode='configure'" :value="mode === 'configure'">
              <span>Configure</span>
              <v-icon>build</v-icon>
            </v-btn>
            <v-btn flat light class="teal--text" @click.native="mode = 'operate'" :value="mode === 'operate'">
              <span>Operate</span>
              <v-icon>face</v-icon>
            </v-btn>
        </v-bottom-nav>
    </div> 
    <v-card-row height="60px" style="position:relative">
    </v-card-row> 
</v-card>

</template><script>

import KrPosition from './KrPosition.vue';
import KrConfig  from './KrConfig.vue';
import RestBundle from 'rest-bundle/vue.js';

export default {
    name: "service",
    data: function() {
        return {
            loading: false,
            mode: 'connect',
        }
    }, 
    computed: {
        location() {
            return location; 
        },
        serviceName() {
            return this.$store.state.serviceName || "test";
        },
        restBundles() {
            return this.$store.getters.restBundles;
        },
    },
    methods: {
        update() {
            var RbIdentity = RestBundle.RbIdentity;
            RbIdentity.update();
        },
    },
    mounted() {
    },
    components: {
        KrPosition,
        KrConfig,
    },
}

</script><style>

.secondary--text {
    color: white;
}

</style>
