<template>

<v-card >
    <v-card-row class="green darken-4" >
        <v-card-title>
            <span class="white--text">Service Home Page</span>
            <v-spacer></v-spacer>
            <span class="lime--text">/{{serviceName}}</span>
        </v-card-title>
    </v-card-row>
    <v-card-text class="grey lighten-3">
        <H5>KinannRest</h5>
        <p> Each named RestBundle instance has its very own home page.
            This is the service home page for RestBundle "{{serviceName}}".
            This page is located at:
            <ul>
                <li><b>Production:</b><a target="_blank" :href='"/"+serviceName+"/ui/index-service"'>
                    /{{serviceName}}/ui/index-service</a></li>
                <li><b>Development:</b>Service.vue tab (i.e., this page)</li>
            </ul>
        </p>

        <h5>Service status: <code>&lt;rb-identity&gt;</code></h5>
        <rb-identity class="mb-3" :service="serviceName"></rb-identity>

        <h5>Position: <code>&lt;kr-position&gt;</code> </h5>
        Display robot position
        <kr-position class="mb-3" :service="serviceName"></kr-position>

    </v-card-text>
</v-card>

</template><script>

import KrPosition from './KrPosition.vue';

export default {
    name: "service",
    computed: {
        serviceName() {
            return this.$store.state.serviceName || "test";
        },
        restBundles() {
            return this.$store.getters.restBundles;
        },
    },
    mounted() {
        console.log("service mounted");
    },
    components: {
        KrPosition
    },
}

</script><style>

.card__title a {
    color: #bbf;
    text-decoration: none;
}
.card__title a:hover {
    text-decoration: underline;
}

</style>
