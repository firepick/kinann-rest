<template>

<div>
    <rb-about v-if="about" :name="componentName">
        <p> Display motor drives.
        </p>
        <rb-about-item name="about" value="false" slot="prop">Show this descriptive text</rb-about-item>
        <rb-about-item name="model" value="identity" slot="prop">RestBundle state name</rb-about-item>
        <rb-about-item name="service" value="test" slot="prop">RestBundle name</rb-about-item>
        <rb-about-item name="showTree" value="true" slot="prop">Show tree view</rb-about-item>
    </rb-about>

    <v-card >
        <v-card-text >
            <v-data-table
                  v-bind:headers="headers"
                  :items="drives"
                  hide-actions
                  class="elevation-1"
                >
                <template slot="items" scope="rows">
                  <td>{{ rows.item.name}}</td>
                  <td>{{ rows.item.type}}</td>
                  <td>{{ axisPos(rows.index) == null ? 'n/a' : axisPos(rows.index) }}</td>
                  <td>{{ rows.item.isHomeable }}</td>
                  <td>{{ rows.item.minPos }}</td>
                  <td>{{ rows.item.maxPos }}</td>
                  <td>{{ rows.item.steps }}</td>
                  <td>{{ rows.item.microsteps }}</td>
                  <td>{{ rows.item.mstepPulses}}</td>
                  <td>{{ gearRatio(rows.index) }}</td>
                </template>
            </v-data-table>
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
            headers: [{
                text: "Drive",
                sortable: true,
                value: "name",
                align: 'left',
            },{
                text: "type",
                sortable: true,
                value: "type",
                align: 'left',
            },{
                text: "position",
                sortable: true,
                value: "pos",
                align: 'left',
            },{
                text: "homeable",
                sortable: true,
                value: "isHomeable",
                align: 'left',
            },{
                text: "minPos",
                sortable: true,
                value: "minPos",
                align: 'left',
            },{
                text: "maxPos",
                sortable: true,
                value: "maxPos",
                align: 'left',
            },{
                text: "steps",
                sortable: true,
                value: "steps",
                align: 'left',
            },{
                text: "microsteps",
                sortable: true,
                value: "microsteps",
                align: 'left',
            },{
                text: "pulses",
                sortable: true,
                value: "mstepPulses",
                align: 'left',
            },{
                text: "gearing",
                sortable: true,
                value: "gearRatio",
                align: 'left',
            }],
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
        gearRatio(iDrive) {
            var drive = this.config.drives[iDrive];
            return drive.gearOut/drive.gearIn;
        }
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
