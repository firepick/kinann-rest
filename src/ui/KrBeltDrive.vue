
<template>

<div>
    <rb-about v-if="about" :name="componentName">
        <p> Display and edit configuration for a belt-driven motor axis.
        </p>
        <rb-about-item name="about" value="false" slot="prop">Show this descriptive text</rb-about-item>
        <rb-about-item name="drive" slot="prop">BeltDrive object</rb-about-item>
    </rb-about>
    <v-layout row wrap>
        <v-flex xs3> <v-subheader>Drive</v-subheader> </v-flex>
        <v-flex xs3 >
            <v-text-field label="Name" v-model="drive.name" ></v-text-field> </v-flex>
        <v-flex xs3 >
            <v-checkbox v-bind:label="'Homeable'" 
                v-tooltip:top='{html:"Does axis have home limit switch?"}'
                v-model="drive.isHomeable" dark></v-checkbox></v-flex>
    </v-layout>
    <v-layout row wrap>
        <v-flex xs3> <v-subheader>Belt drive</v-subheader> </v-flex>
        <v-flex xs3 v-tooltip:top='{html:"Number of drive pulley teeth"}'> 
            <v-text-field label="Pulley Teeth" v-model="drive.teeth" ></v-text-field> </v-flex>
        <v-flex xs3 v-tooltip:top='{html:"Belt tooth separation in mm"}'> 
            <v-text-field label="Pitch" v-model="drive.teeth" ></v-text-field> </v-flex>
    </v-layout>
    <v-layout row wrap>
        <v-flex xs3> <v-subheader>Axis limits</v-subheader> </v-flex>
        <v-flex xs3 v-tooltip:top='{html:"Axis position when homed"}'> 
            <v-text-field label="Home" v-model="drive.minPos" ></v-text-field> </v-flex>
        <v-flex xs3> <v-text-field label="Maximum" v-model="drive.maxPos" ></v-text-field> </v-flex>
    </v-layout>
    <v-layout row wrap>
        <v-flex xs3> <v-subheader>Stepper motor driver</v-subheader> </v-flex>
        <v-flex xs3> <v-text-field label="Steps" v-model="drive.steps" ></v-text-field> </v-flex>
        <v-flex xs3> <v-text-field label="Microsteps" v-model="drive.microsteps" ></v-text-field> </v-flex>
        <v-flex xs3 v-tooltip:top='{html:"Pulses per unit position"}'> 
            <v-text-field label="Pulses" v-model="drive.mstepPulses" ></v-text-field> </v-flex>
    </v-layout>
    <v-layout row wrap>
        <v-flex xs3> <v-subheader>Gear ratio</v-subheader> </v-flex>
        <v-flex xs3> <v-text-field label="Input" v-model="drive.gearIn" ></v-text-field> </v-flex>
        <v-flex xs3> <v-text-field label="Output" v-model="drive.gearOut" ></v-text-field> </v-flex>
    </v-layout>
</div>

</template>
<script>

import rbvue from 'rest-bundle/vue.js';

function defaultDrive() {
    console.log("defaultDrive");
    return {
        name: "SampleBeltDrive",
        teeth: 20,
        gearIn: 1,
        gearOut: 1,
        steps: 200,
        microsteps: 16,
        mstepPulses: 1,
        maxPos: 100,
        minPos: 0,
        isHomeable: true,
    };
}

export default {
    mixins: [ rbvue.mixins.RbAboutMixin],
    props: {
        about: {
            default: false,
        },
        drive: {
            default: defaultDrive,
        },
    },
    data() { return {} },
}

</script><style>

</style>

