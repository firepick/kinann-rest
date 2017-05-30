
<template>

<div>
    <rb-about v-if="about" :name="componentName">
        <p> Display and edit configuration for a lead-screw motor axis.
        </p>
        <rb-about-item name="about" value="false" slot="prop">Show this descriptive text</rb-about-item>
        <rb-about-item name="drive" slot="prop">BeltDrive object</rb-about-item>
    </rb-about>
    <v-container fluid>
        <v-layout row>
            <v-flex xs3> <v-subheader>Screw drive</v-subheader> </v-flex>
            <v-flex xs3 >
                <v-text-field label="Name" v-model="drive.name" ></v-text-field> </v-flex>
            <v-flex xs3 v-tooltip:top='{html:"Distance traveled with one rotation (mm)"}'> 
                <v-text-field label="Lead" v-model="drive.lead" ></v-text-field> </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs3> <v-subheader>Axis position</v-subheader> </v-flex>
            <v-flex xs3 v-tooltip:top='{html:"Axis position when homed"}'> 
                <v-text-field label="Home" v-model="drive.minPos" ></v-text-field> </v-flex>
            <v-flex xs3> <v-text-field label="Maximum" v-model="drive.maxPos" ></v-text-field> </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs3> <v-subheader>Stepper motor driver</v-subheader> </v-flex>
            <v-flex xs3> <v-text-field label="Steps" v-model="drive.steps" ></v-text-field> </v-flex>
            <v-flex xs3> <v-text-field label="Microsteps" v-model="drive.microsteps" ></v-text-field> </v-flex>
            <v-flex xs3 v-tooltip:top='{html:"Pulses per unit position"}'> 
                <v-text-field label="Pulses" v-model="drive.mstepPulses" ></v-text-field> </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs3> <v-subheader>Gear ratio</v-subheader> </v-flex>
            <v-flex xs3> <v-text-field label="Input" v-model="drive.gearIn" ></v-text-field> </v-flex>
            <v-flex xs3> <v-text-field label="Output" v-model="drive.gearOut" ></v-text-field> </v-flex>
        </v-layout>
    </v-container>
</div>

</template>
<script>

import rbvue from "rest-bundle/vue.js";

function defaultDrive() {
    console.log("defaultDrive");
    return {
        name: "SampleScrewDrive",
        lead: 0.8,
        gearIn: 1,
        gearOut: 1,
        steps: 200,
        microsteps: 16,
        mstepPulses: 1,
        maxPos: 100,
        minPos: 0,
    };
}

export default {
    mixins: [ rbvue.mixins.RbAboutMixin ],
    props: {
        drive: {
            default: defaultDrive,
        },
    },
}

</script><style>

</style>

