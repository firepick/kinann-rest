<template>

<v-card >
    <v-card-row class="secondary" >
        <v-card-title>
            <span class="" >Service Home Page</span>
            <v-spacer></v-spacer>
            <span  class="">/{{serviceName}}</span>
        </v-card-title>
    </v-card-row>
    <v-card-text >
        <h6 >Service Status</h6>
        <v-card hover v-tooltip:bottom='{html:"<rb-identity/>"}' >
            <rb-identity class="mb-3" :service="serviceName"/>
        </v-card>

        <h6 >Current Position</h6>
        <v-card hover v-tooltip:bottom='{html:"<kr-position/>"}' >
            <kr-position :service="serviceName"/>
        </v-card>

        <h6>Drive Configuration</h6>
        <v-card hover v-tooltip:bottom='{html:"<kr-drives/>"}'>
            <kr-drives class="mb-3" :service="serviceName"/>
        </v-card>

        <h6>Lorem Ipsum</h6>
        Lore ipsum dolor sit atmet
    </v-card-text>
</v-card>

</template><script>

import KrPosition from './KrPosition.vue';
import KrDrives from './KrDrives.vue';

export default {
    name: "service",
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
    },
    mounted() {
    },
    components: {
        KrPosition,
        KrDrives,
    },
}

</script><style>

.secondary--text {
    color: white;
}

</style>
