<template>

<v-card> 
    <v-card-row class="grey lighten-4"> 
        <v-card-text>
            Axis {{axis}}
            World {{world}}
        </v-card-text> 
    </v-card-row> 
</v-card>

</template>
<script>

import RestBundle from "rest-bundle/vue";

export default {
    //mixins: [ require("./mixins/rb-service.js") ],
    mixins: [ RestBundle.RbService ],
    props: {
        model: {
            required: false,
            type: String,
            default: "position",
        }
    },
    data: function() {
        this.restBundleServices();
        this.$store.commit("restBundleServices/updateRestBundle", {
            service: this.service,
            model: this.model,
            axis: [12,34,56],
            world: [1,2,3],
        });
        return {
            showDetail: false, 
        }
    },
    computed: {
        axis() {
            return this.modelState && this.modelState.axis || "axis?";
        },
        world() {
            return this.modelState && this.modelState.world || "world?";
        },
    },
    methods: {
        blam: function(v) {
            console.log("BLAM",v);
        },
    }
}

</script><style>

.expansion-panel, .expansion-panel>li {
    border-top-left-radius: 0.4em !important;
    border-top-right-radius: 0.4em !important;
}
.expansion-panel:last-child, .expansion-panel>li {
    border-bottom-left-radius: 0.4em !important;
    border-bottom-right-radius: 0.4em !important;
}



</style>

