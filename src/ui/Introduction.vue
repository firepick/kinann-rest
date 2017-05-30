<template>

<v-card flat>
    <v-card-text>
        <h4>KinannRest</h4>
        KinannRest is a <a href="https://github.com/firepick/rest-bundle">RestBundle</a> that
        provides positioning and calibration services for <a href="https://github.com/firepick/kinann">Kinann</a>
        robots.
        .
        A RestBundle is a single Nodejs package that comprises both the web front-end
        as well as the back-end implementations of a REST service. RestBundles are
        robust vertical application slices that facilitate the development of lightweight
        application shells.
        </p>

        <h5>REST Services </h5>
        <p> KinannRest provides the following REST services:
            <v-container fluid>
                <v-layout>
                    <v-flex xs4><b>REST Service</b></v-flex>
                    <v-flex xs2><b>Method</b></v-flex>
                    <v-flex xs6><b>Description</b></v-flex>
                </v-layout>
                <v-layout>
                    <v-flex xs4><code>/SERVICE/identity</code></v-flex>
                    <v-flex xs2>GET</v-flex>
                    <v-flex xs6>Inherited from RestBundle</v-flex>
                </v-layout>
                <v-layout>
                    <v-flex xs4><code>/SERVICE/position</code></v-flex>
                    <v-flex xs2>GET</v-flex>
                    <v-flex xs6>Return current position</v-flex>
                </v-layout>
                <v-layout>
                    <v-flex xs4><code>/SERVICE/config</code></v-flex>
                    <v-flex xs2>GET</v-flex>
                    <v-flex xs6>Return configuration of drives, etc.</v-flex>
                </v-layout>
            </v-container>
        </p>

        <h5>Vue Components</h5>
        <p> See sidebar
        </p>
    </v-card-text>
</v-card>

</template><script>

export default {
    name: 'introduction',
}

</script><style>

</style>
