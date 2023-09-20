import App from "./App.vue";

// Composables
import { createApp } from "vue";
// import Vue from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import InstantSearch from "vue-instantsearch/vue3/es";
import VueWriter from "vue-writer";

const app = createApp(App);

registerPlugins(app);

app.use(InstantSearch);
app.use(VueWriter);
app.mount("#app");
