import KrBeltDrive from './src/ui/KrBeltDrive.vue';
import KrGearDrive from './src/ui/KrGearDrive.vue';
import KrScrewDrive from './src/ui/KrScrewDrive.vue';
import KrPosition from "./src/ui/KrPosition.vue";
import KrDrives from "./src/ui/KrDrives.vue";

var components = {
    KrPosition,
    KrDrives,
    KrBeltDrive,
    KrGearDrive,
    KrScrewDrive,
}
function plugin(Vue, options) {
    Object.keys(components).forEach( key => Vue.component(key, components[key]));
}

export default {
    install: plugin,
    components,
}
