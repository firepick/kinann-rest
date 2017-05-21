<template>

<v-select v-bind:items='posItems'
    v-model="posDisplay"
    class="input-group--focused "
    light chips persistent-hint multiple
    item-value="text" >
    <template slot="selection" scope="data">
        <v-chip 
            @input="data.parent.selectItem(data.item)"
            @click.native.stop
            close
            class="chip--select-multi pl-4 "
            :key="data.item" >
            <v-row v-show='data.item === "Stepper"'>
                {{data.item}}: <div v-for="coord in position.motor" :key="coord" >&nbsp;&nbsp;{{coord}}</div>&nbsp;</v-row>
            <v-row v-show='data.item === "Axis"'>
                {{data.item}}: <div v-for="coord in position.axis" :key="coord" >&nbsp;&nbsp;{{coord}}</div>&nbsp;</v-row>
            <v-row v-show='data.item === "World"'>
                {{data.item}}: <div v-for="coord in position.world" :key="coord" >&nbsp;&nbsp;{{coord}}</div>&nbsp;</v-row>
        </v-chip>
    </template>
</v-select>

</template>
<script>

import RestBundle from "rest-bundle/vue";
import Vue from "vue";

export default {
    mixins: [ RestBundle.RbService ],
    props: {
        model: {
            default: "position",
        }
    },
    data: function() {
        this.restBundleModel({
            motor: [],
            axis: [],
            world: [],
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
    created( ){
        this.restBundleCommit("getUpdate");
    },
    computed: {
        position() {
            return this.rbModel;
        },
    },
    methods: {
        mutations() {
            return {
                getUpdate: this.getUpdate,
            }
        },
    }
}

</script><style>


</style>

