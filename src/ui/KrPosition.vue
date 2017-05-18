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
            <v-row v-show='data.item === "Stepper"'> {{data.item}}: <div v-for="coord in position.motor" :key="coord" class="">&nbsp;&nbsp;{{coord}}</div>&nbsp;</v-row>
            <v-row v-show='data.item === "Axis"'> {{data.item}}: <div v-for="coord in position.axis" :key="coord" class="">&nbsp;&nbsp;{{coord}}</div>&nbsp;</v-row>
            <v-row v-show='data.item === "World"'> {{data.item}}: <div v-for="coord in position.world" :key="coord" class="">&nbsp;&nbsp;{{coord}}</div>&nbsp;</v-row>
          </v-chip>
        </template>
    </v-select>

</template>
<script>

import RestBundle from "rest-bundle/vue";
import axios from 'axios';

export default {
    mixins: [ RestBundle.RbService ],
    props: {
        model: {
            required: false,
            type: String,
            default: "kinann",
        }
    },
    data: function() {
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
        axios.get(this.origin + "/" +this.service+ "/position", {
        })
        .then(res => {
            this.commit({ position: res.data });
        })
        .catch(err => {
        });
    },
    computed: {
        position() {
            return this.modelState && this.modelState.position || "position?";
        },
    },
    methods: {
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

