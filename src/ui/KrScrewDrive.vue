
<template>

<v-container fluid>
    <v-row row>
        <v-col xs3> <v-subheader>Screw drive</v-subheader> </v-col>
        <v-col xs3 >
            <v-text-field label="Name" v-model="drive.name" ></v-text-field> </v-col>
        <v-col xs3 v-tooltip:top='{html:"Distance traveled with one rotation (mm)"}'> 
            <v-text-field label="Lead" v-model="drive.lead" ></v-text-field> </v-col>
    </v-row>
    <v-row row>
        <v-col xs3> <v-subheader>Axis position</v-subheader> </v-col>
        <v-col xs3 v-tooltip:top='{html:"Axis position when homed"}'> 
            <v-text-field label="Home" v-model="drive.minPos" ></v-text-field> </v-col>
        <v-col xs3> <v-text-field label="Maximum" v-model="drive.maxPos" ></v-text-field> </v-col>
    </v-row>
    <v-row row>
        <v-col xs3> <v-subheader>Stepper motor driver</v-subheader> </v-col>
        <v-col xs3> <v-text-field label="Steps" v-model="drive.steps" ></v-text-field> </v-col>
        <v-col xs3> <v-text-field label="Microsteps" v-model="drive.microsteps" ></v-text-field> </v-col>
        <v-col xs3 v-tooltip:top='{html:"Pulses per unit position"}'> 
            <v-text-field label="Pulses" v-model="drive.mstepPulses" ></v-text-field> </v-col>
    </v-row>
    <v-row row>
        <v-col xs3> <v-subheader>Gear ratio</v-subheader> </v-col>
        <v-col xs3> <v-text-field label="Input" v-model="drive.gearIn" ></v-text-field> </v-col>
        <v-col xs3> <v-text-field label="Output" v-model="drive.gearOut" ></v-text-field> </v-col>
    </v-row>
</v-container>

</template>
<script>


export default {
    props: {
        drive: {
            required: true,
        },
    },
    data() { return { } },
}

</script><style>

</style>

