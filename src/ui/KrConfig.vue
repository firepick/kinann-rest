<template>

<v-expansion-panel class="" >
    <v-expansion-panel-content>
        <div slot="header" class="title">
            <div style="position:absolute; top:0.35em;left:0.5em">
                <v-icon v-show="error" small class="error--text" >error</v-icon>
                <v-icon v-show="!error" xsmall class="success--text" >check</v-icon>
            </div>
            <div class="rb-panel-header" >Configuration: /{{service}}/config</div>
        </div>
        <v-card >
            <div class="text-xs-center mb-3" >
                <v-pagination circle v-bind:length.number="config.drives.length" v-model="eDrive"/>
            </div>
            <v-card-row>
                <template v-for="(drive,i) in config.drives">
                    <div v-show="eDrive===i+1" :key="i">
                        <kr-belt-drive v-show='drive.type === "BeltDrive"' :drive="drive"></kr-belt-drive>
                        <kr-screw-drive v-show='drive.type === "ScrewDrive"' :drive="drive"></kr-screw-drive>
                        <tree-view 
                            v-show="drive.type !== 'BeltDrive' && drive.type !=='ScrewDrive'" 
                            :data="drive" :root-key='"config.drives["+i+"]"' ></tree-view>
                    </div>
                </template>
            </v-card-row>
        </v-card>

    </v-expansion-panel-content>
</v-expansion-panel>


</template>
<script>

import KrBeltDrive from "./KrBeltDrive.vue";
import KrScrewDrive from "./KrScrewDrive.vue";
import RestBundle from "rest-bundle/vue";
import Vue from "vue";

export default {
    mixins: [ RestBundle.RbService ],
    props: {
        model: {
            required: false,
            type: String,
            default: "config",
        }
    },
    data: function() {
        this.restBundleModel({
            drives:[],
        });
        return {
            eDrive: 1,
            error:"",
        }
    },
    computed: {
        rbModel() {
            return this.restBundleModel();
        },
        config() {
            return this.rbModel;
        },
    },
    components: {
        KrBeltDrive,
        KrScrewDrive,
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

