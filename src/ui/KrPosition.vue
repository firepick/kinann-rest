<template>

<div>
    <rb-about v-if="about" :name="componentName">
        <p> Display current position. User can select coordinate system.
        </p>
        <rb-about-item name="about" value="false" slot="prop">Show this descriptive text</rb-about-item>
        <rb-about-item name="model" value="identity" slot="prop">RestBundle state name</rb-about-item>
        <rb-about-item name="service" value="test" slot="prop">RestBundle name</rb-about-item>
    </rb-about>
    <v-select v-bind:items='posItems'
        v-model="posDisplay"
        class="input-group--focused "
        light chips persistent-hint multiple
        item-value="text" >
        <template slot="selection" scope="data">
            <v-chip 
                @input="data.parent.selectItem(data.item.text)"
                @click.native.stop
                close
                class="chip--select-multi pl-4 "
                :key="data.item.text" >
                <template v-show='data.item.text'>{{data.item.text}}: {{positionStr(data.item.basis)}}</template>
            </v-chip>
        </template>
    </v-select>
</div>

</template>
<script>

import RestBundle from "rest-bundle/vue";
import Vue from "vue";

export default {
    mixins: [ 
        RestBundle.mixins.RbAboutMixin, 
        RestBundle.mixins.RbServiceMixin,
    ],
    methods: {
        positionStr(basis) {
            var result = this.position[basis].reduce( (acc,pos) => (acc = acc + pos + "\u00a0\u00a0"), "");
            return result || "(no position)";
        },
    },
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
            posItems: [{
                text:"Stepper",
                basis:"motor",
            },{
                text:"Axis",
                basis:"axis",
            },{
                text:"World",
                basis:"world",
            }],
        }
    },
    created( ){
        this.restBundleDispatch("getUpdate");
    },
    computed: {
        position() {
            return this.rbModel;
        },
    },
}

</script><style>


</style>

