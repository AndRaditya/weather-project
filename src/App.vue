<template>
  <v-app>
    <weather-layout-vue> </weather-layout-vue>
  </v-app>
</template>

<script>
import WeatherLayoutVue from "./components/WeatherLayout.vue";

export default {
  name: "App",
  components: {
    WeatherLayoutVue,
  },
};
</script>

<style>
@import "../css/main.css";
</style>
