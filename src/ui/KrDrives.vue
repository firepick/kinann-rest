<template>

<div>
    <rb-about v-if="about" :name="componentName">
        <p> View/change individual motor drive configuration and position. 
            Position is in drive coordinates (vs. application coordinates).
        </p>
        <rb-about-item name="about" value="false" slot="prop">Show this descriptive text</rb-about-item>
        <rb-about-item name="model" value="drives" slot="prop">RestBundle state name</rb-about-item>
        <rb-about-item name="service" value="test" slot="prop">RestBundle name</rb-about-item>
    </rb-about>

    <v-card >
        <v-card-text >
            <v-layout class="body-2">
                <v-flex xs1>Drive</v-flex>
                <v-flex xs1 class="text-xs-center">Move </v-flex>
                <v-flex xs2 class="text-xs-center">Position </v-flex>
                <v-flex xs2>Range </v-flex>
                <v-flex xs2>Type</v-flex>
                <v-flex xs2 v-tooltip:top='{html:"steps \u00d7 microsteps @ mstepPulses"}'>Steps </v-flex>
                <v-flex xs1 class="text-xs-center">Gear </v-flex>
                <v-flex xs1 class="text-xs-center">Edit </v-flex>
            </v-layout>
            <v-layout v-for='(drive,i) in drives' :key='i'
                align-baseline>
                <v-flex xs1>[{{i}}] {{drive.name}}</v-flex>
                <v-flex xs1> 
                     <v-menu origin="bottom center" transition="v-scale-transition" top >
                        <v-btn small icon :disabled="rbBusy" slot="activator"
                            class="primary--text"
                            ><v-icon>gamepad</v-icon></v-btn>
                        <v-list dense>
                            <v-list-tile v-for="pct in [0,25,50,75,100].reverse()" 
                                @click.native="positionAxis(i,pct/100)" :key="pct" 
                                :disabled='rbBusy || axisPos(i) == null'> 
                                <v-list-tile-title >{{pct}}%</v-list-tile-title> 
                            </v-list-tile>
                            <v-list-tile @click.native="positionAxis(i,'home')" :disabled="rbBusy" > 
                                <v-list-tile-title >Home</v-list-tile-title> 
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </v-flex>
                <v-flex xs2 class="text-xs-center"> {{ axisPos(i) == null ? 'n/a' : axisPos(i) }} </v-flex>
                <v-flex xs2>{{drive.minPos}}&#8596;{{drive.maxPos}}</v-flex>
                <v-flex xs2>{{drive.type}}</v-flex>
                <v-flex xs2>{{drive.steps}}&#x00d7;{{drive.microsteps}}@{{drive.mstepPulses}}</v-flex>
                <v-flex xs1 class="text-xs-center">{{drive.gearOut}}:{{drive.gearIn}}</v-flex>
                <v-flex xs1>
                        <v-btn small icon :disabled="rbBusy" slot="activator"
                            class="primary--text"
                            ><v-icon>edit</v-icon></v-btn>
                </v-flex>
            </v-layout>
        </v-card-text >

        <v-alert error v-bind:value="error"> {{error}} </v-alert>
    </v-card>
</div>

</template>
<script>

import KrBeltDrive from "./KrBeltDrive.vue";
import KrScrewDrive from "./KrScrewDrive.vue";
import rbvue from "rest-bundle/index-vue";

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
        rbvue.mixins.RbApiMixin,
    ],
    props: {
        model: {
            default: "drives",
        },
    },
    data: function() {
        this.restBundleModel();
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
                var axes = this.drives.map((d,i) => i===axis ? Number(d.minPos) : null);
            } else {
                var url = this.restOrigin() + "/" + this.service + "/move-to";
                var axes = this.drives.map((d,i) => i===axis ? goal * (d.maxPos - d.minPos) + d.minPos : null);
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
            return this.rbModel.apiModel && this.rbModel.apiModel.drives || [];
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
