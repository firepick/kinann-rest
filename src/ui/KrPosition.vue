<template>

    <v-select xs2 v-bind:items='posItems'
        v-model="posDisplay"
        class="input-group--focused "
        light chips persistent-hint
        multiple
        item-value="text" >
        <template slot="selection" scope="data">
          <v-chip 
            @input="data.parent.selectItem(data.item)"
            @click.native.stop
            close
            class="chip--select-multi pl-4 "
            :key="data.item"
          >
            <v-row v-show='data.item === "Stepper"'> {{data.item}}: <div v-for="coord in stepperPos" :key="coord" class="">&nbsp;&nbsp;{{coord}}</div>&nbsp;</v-row>
            <v-row v-show='data.item === "Axis"'> {{data.item}}: <div v-for="coord in axisPos" :key="coord" class="">&nbsp;&nbsp;{{coord}}</div>&nbsp;</v-row>
            <v-row v-show='data.item === "World"'> {{data.item}}: <div v-for="coord in worldPos" :key="coord" class="">&nbsp;&nbsp;{{coord}}</div>&nbsp;</v-row>
          </v-chip>
        </template>
    </v-select>

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
            default: "kinann",
        }
    },
    data: function() {
        this.restBundleServices();
        this.$store.commit("restBundleServices/updateRestBundle", {
            service: this.service,
            model: this.model,
            stepperPos: [1000,2000,3000],   
            axisPos: [12,34,56],
            worldPos: [1,2,3],
        });
        return {
            showDetail: false, 
            posDisplay: ["Axis","Stepper","World"],
            posItems: [
                "Stepper",
                "Axis",
                "World",
            ],
        }
    },
    computed: {
        stepperPos() {
            return this.modelState && this.modelState.stepperPos || "stepperPos?";
        },
        axisPos() {
            return this.modelState && this.modelState.axisPos || "axisPos?";
        },
        worldPos() {
            return this.modelState && this.modelState.worldPos || "worldPos?";
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

