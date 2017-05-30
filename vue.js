import KrBeltDrive from './src/ui/KrBeltDrive.vue';
import KrScrewDrive from './src/ui/KrScrewDrive.vue';
import KrPosition from "./src/ui/KrPosition.vue";
import KrConfig from "./src/ui/KrConfig.vue";

var components = {
    KrPosition,
    KrConfig,
    KrBeltDrive,
    KrScrewDrive,
}
function plugin(Vue, options) {
    Object.keys(components).forEach( key => Vue.component(key, components[key]));
}

export default {
    install: plugin,
    components,
}
