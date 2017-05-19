<template>

<v-expansion-panel class="" >
    <v-expansion-panel-content>
        <div slot="header" class="title">
            <div style="position:absolute; top:0.35em;left:0.5em">
                <v-icon v-show="error" small class="error--text" >error</v-icon>
                <v-icon v-show="!error" xsmall class="success--text" >check</v-icon>
            </div>
            <div class="rb-panel-header" >Drive Configuration: /{{service}}/drives</div>
        </div>
        <v-card >
            <div class="text-xs-center mb-3" >
                <v-pagination circle v-bind:length.number="drives.length" v-model="eDrive"/>
            </div>
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
        </v-card>

    </v-expansion-panel-content>
</v-expansion-panel>


</template>
<script>

import KrBeltDrive from "./KrBeltDrive.vue";
import KrScrewDrive from "./KrScrewDrive.vue";
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
            eDrive: 1,
            error:"",
        }
    },
    created( ){
        axios.get(this.origin + "/" +this.service+ "/drives", {
        })
        .then(res => {
            this.commit({ drives: res.data });
        })
        .catch(err => {
        });
    },
    computed: {
        drives() {
            return this.modelState && this.modelState.drives || "drives?";
        },
    },
    components: {
        KrBeltDrive,
        KrScrewDrive,
    }
}

</script><style>


</style>

