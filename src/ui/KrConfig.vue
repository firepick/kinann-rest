<template>

<div>
    <rb-about v-if="about" :name="componentName">
        <p> Display current position. User can select coordinate system.
        </p>
        <rb-about-item name="about" value="false" slot="prop">Show this descriptive text</rb-about-item>
        <rb-about-item name="model" value="identity" slot="prop">RestBundle state name</rb-about-item>
        <rb-about-item name="service" value="test" slot="prop">RestBundle name</rb-about-item>
        <rb-about-item name="showTree" value="true" slot="prop">Show tree view</rb-about-item>
    </rb-about>

    <v-card >
        <v-card-text class="grey lighten-3">
            <v-card-title>
                Drives
                <v-spacer/>
                <v-pagination circle v-bind:length.number="drives.length" v-model="eDrive"/>
            </v-card-title>
        </v-card-text>
        <v-card-text>
            <template v-for="(drive,i) in drives">
                <div v-show="eDrive===i+1" :key="i">
                    <v-container fluid >
                        <kr-belt-drive v-show='drive.type === "BeltDrive"' :drive="drive"></kr-belt-drive>
                        <kr-screw-drive v-show='drive.type === "ScrewDrive"' :drive="drive"></kr-screw-drive>
                        <v-layout row>
                            <v-flex xs3> <v-subheader>Position</v-subheader> </v-flex>
                            <v-flex xs3 class="pt-3">
                                <span v-if="axisPos(i) == null">(n/a)</span>
                                <span v-if="axisPos(i) != null">{{axisPos(i)}}</span>
                            </v-flex>
                            <v-flex xs3 class="pt-1">
                               <v-menu origin="bottom center" transition="v-scale-transition" top >
                                  <v-btn dark default :disabled="rbBusy" slot="activator">Move Axis</v-btn>
                                  <v-list dense>
                                    <v-list-tile v-for="pct in [0,25,50,75,100].reverse()" 
                                        @click="positionAxis(i,pct/100)" :key="pct" 
                                        :disabled='rbBusy || axisPos(i) == null'> 
                                        <v-list-tile-title >{{pct}}%</v-list-tile-title> 
                                    </v-list-tile>
                                    <v-list-tile @click="positionAxis(i,'home')" :disabled="rbBusy" > 
                                        <v-list-tile-title >Home</v-list-tile-title> 
                                    </v-list-tile>
                                  </v-list>
                                </v-menu>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <rb-tree-view v-show="showTree || drive.type !== 'BeltDrive' && drive.type !=='ScrewDrive'" 
                        class="pl-4 pb-2"
                        initialDepth="0"
                        :data="drive" :root-key='"drives["+i+"]"' ></rb-tree-view>
                </div>
            </template>
        </v-card-text>
        <v-alert error v-bind:value="error"> {{error}} </v-alert>
    </v-card>
</div>

</template>
<script>

import KrBeltDrive from "./KrBeltDrive.vue";
import KrScrewDrive from "./KrScrewDrive.vue";
import rbvue from "rest-bundle/vue";

var positionOpts = [
    { text: 'Home' },
    { text: '25%' },
    { text: '50%' },
    { text: '75%' },
    { text: '100%' },
];

export default {
    mixins: [ 
        rbvue.mixins.RbAboutMixin, 
        rbvue.mixins.RbServiceMixin,
    ],
    props: {
        model: {
            default: "config",
        },
        showTree: {
            default: true,
        },
    },
    data: function() {
        this.restBundleModel({
            drives:[],
        });
        return {
            eDrive: 1,
            error:"",
            newPos:"",
            positionOpts,
        }
    },
    methods: {
        positionAxis(axis, goal) {
            console.log("positionAxis", axis, goal);
            if (goal === "home") {
                var url = this.restOrigin() + "/" + this.service + "/home";
                var axes = this.config.drives.map((d,i) => i===axis ? Number(d.minPos) : null);
            } else {
                var url = this.restOrigin() + "/" + this.service + "/move-to";
                var axes = this.config.drives.map((d,i) => i===axis ? goal * (d.maxPos - d.minPos) + d.minPos : null);
            }
            this.$http.post(url, axes, {
                headers: {}
            })
        },
        axisPos(iAxis) {
            var position = this.restBundleService().position;
            var axis = position && position.axis;
            return axis && axis[iAxis];
        },
    },
    computed: {
        drives() {
            return this.config.drives;
        },
        config() {
            return this.rbModel;
        },
    },
    components: {
        KrBeltDrive,
        KrScrewDrive,
    },
    created() {
        this.rbDispatch("apiLoad");
    },
    mounted() {
        console.log("mounted");
    },
}

</script>
<style> </style>
