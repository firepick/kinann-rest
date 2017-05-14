<template>

<v-card> 
    <v-card-row class="grey lighten-4"> 
        <v-card-text>
            Position {{position}}
        </v-card-text> 
    </v-card-row> 
</v-card>

</template>
<script>

var grid = require('vue-g-row-col');

export default {
    mixins: [ require("./mixins/rb-service.js") ],
    data: function() {
        return {
            showDetail: false, 
        }
    },
    computed: {
        position() {
            return this.$store.state.position || [1,2,3];
        },
    },
    components: Object.assign({}, grid),
    methods: {
        blam: function(v) {
            console.log("BLAM",v);
        },
    }
}

</script><style>

.expansion-panel, .expansion-panel>li {
    border-top-left-radius: 0.4em !important;
    border-top-right-radius: 0.4em !important;
}
.expansion-panel:last-child, .expansion-panel>li {
    border-bottom-left-radius: 0.4em !important;
    border-bottom-right-radius: 0.4em !important;
}



</style>

