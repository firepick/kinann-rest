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
            required: false,
            type: String,
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
        //this.$http.get(this.origin() + "/" +this.service+ "/position", {
        //})
        //.then(res => {
            //this.restBundleCommit({ position: res.data });
        //})
        //.catch(err => {
        //});
    },
    computed: {
        rbModel() {
            return this.restBundleModel();
        },
        position() {
            return this.rbModel;
        },
    },
    methods: {
        restBundleModel(state) {
            var rbService = this.restBundleService();
            if (rbService[this.model] == null) {
                var that = this;
                function getUpdate(state) {
                    var url = [that.origin(), that.service, that.model].join("/");
                    that.$http.get(url).then((res) => {
                        var data = res.data;
                        data && Object.keys(data).forEach(key => Vue.set(state, key, data[key]));
                    }).catch( err => {
                        that.setError(err);
                    });
                };
                this.$store.registerModule(["restBundle", this.service, this.model], {
                    namespaced: true,
                    state: state || {},
                    mutations: {
                        getUpdate,
                    },
                });
                this.restBundleCommit("getUpdate");
            }
            return rbService[this.model];
        },
    }
}

</script><style>


</style>

