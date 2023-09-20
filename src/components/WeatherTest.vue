<template>
  <div>
    <!-- <vuetify-google-autocomplete
      id="map"
      append-icon="search"
      v-bind:disabled="true"
      placeholder="Start typing"
      v-on:placechanged="getAddressData"
    >
    </vuetify-google-autocomplete> -->
  </div>
</template>

<script>
// import VuetifyGoogleAutocomplete from "vuetify-google-autocomplete";

export default {
  name: "weather-function",
  component: {
    // VuetifyGoogleAutocomplete,
  },
  data() {
    return {
      latitude: "",
    };
  },
  created() {},
  methods: {},
};
</script>
