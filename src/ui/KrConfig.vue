<template>

<div>
    <rb-about v-if="about" :name="componentName">
        <p> Display current position. User can select coordinate system.
        </p>
        <rb-about-item name="about" value="false" slot="prop">Show this descriptive text</rb-about-item>
        <rb-about-item name="model" value="identity" slot="prop">RestBundle state name</rb-about-item>
        <rb-about-item name="service" value="test" slot="prop">RestBundle name</rb-about-item>
        <rb-about-item name="showTree" value="false" slot="prop">Show tree view</rb-about-item>
    </rb-about>
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
                    <rb-tree-view v-show="showTree || drive.type !== 'BeltDrive' && drive.type !=='ScrewDrive'" 
                        class="pl-4 pb-2"
                        :data="drive" :root-key='"drives["+i+"]"' ></rb-tree-view>
                </div>
            </template>
        </v-card-row>
        <v-alert error v-bind:value="error"> {{error}} </v-alert>
    </v-card>
</div>

</template>
<script>

import KrBeltDrive from "./KrBeltDrive.vue";
import KrScrewDrive from "./KrScrewDrive.vue";
import rbvue from "rest-bundle/vue";

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
            default: false,
        },
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
        this.restBundleDispatch("getUpdate");
    },
}

</script>
<style> </style>
