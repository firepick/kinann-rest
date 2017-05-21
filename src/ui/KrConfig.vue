<template>

<v-card >
    <v-card-row class="grey lighten-3">
        <v-card-title>
            Drives
            <v-spacer/>
            <v-pagination circle v-bind:length.number="drives.length" v-model="eDrive"/>
        </v-card-title>
    </v-card-row>
    <v-card-row>
        <template v-for="(drive,i) in drives">
            <div v-show="eDrive===i+1" :key="i">
                <kr-belt-drive v-show='drive.type === "BeltDrive"' :drive="drive"></kr-belt-drive>
                <kr-screw-drive v-show='drive.type === "ScrewDrive"' :drive="drive"></kr-screw-drive>
                <tree-view 
                    v-show="drive.type !== 'BeltDrive' && drive.type !=='ScrewDrive'" 
                    :data="drive" :root-key='"drives["+i+"]"' ></tree-view>
            </div>
        </template>
    </v-card-row>
    <v-alert error v-bind:value="error"> {{error}} </v-alert>
</v-card>

</template>
<script>

import KrBeltDrive from "./KrBeltDrive.vue";
import KrScrewDrive from "./KrScrewDrive.vue";
import RestBundle from "rest-bundle/vue";

export default {
    mixins: [ RestBundle.RbService ],
    props: {
        model: {
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
        this.restBundleCommit("getUpdate");
    },
    methods: {
        mutations() {
            return {
                getUpdate: this.getUpdate,
            }
        },
    }
}

</script>
<style> </style>
