<template>
  <div class="weather-interactive">
    <div class="weather-interactive__1">
      <p class="text__interactive-title">Weather Whisper</p>
    </div>
    <div class="weather-interactive__2">
      <div class="weather-interactive__2--background">
        <span
          class="material-symbols-outlined weather-interactive__2--icon"
          v-if="current_position"
        >
          location_on
        </span>
        <p class="text__interactive-location" v-if="current_position">
          &nbsp; {{ current_position }}
        </p>
        <p class="text__interactive-location" v-else>Loading location...</p>
      </div>
    </div>
    <div class="weather-interactive__3">
      <p class="text__interactive-credit">
        Photo By on
        <a
          href="https://unsplash.com/photos/0rvKw0fDiHk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          class="text__interactive-credit--link"
          target="_blank"
          >Unsplash</a
        >
      </p>
    </div>
    <div class="weather-interactive__4">
      <div class="weather-interactive__4-search--1">
        <p class="text__interactive-subtitle">
          Listen to the Secrets of the Sky.
        </p>
      </div>
      <div class="weather-interactive__4-search--2">
        <div class="weather-interactive__4-search--2__bar">
          <!-- <input
            class="weather-interactive__input"
            type="text"
            placeholder="Search Location"
          /> -->

          <!-- clearable
            solo-inverted
            filled
            append-icon="search"
            label="Search Location"
            v-model="search_location"
            update:search-input="xSearch" -->
          <v-autocomplete
            :loading="isLoading"
            v-model="search_location"
            :search-input.sync="search_func"
            solo-inverted
            filled
            append-icon="search"
            label="Search Location"
          ></v-autocomplete>
        </div>
        <div class="weather-interactive__4-search--2__location">
          <span
            class="material-symbols-outlined weather-interactive__4-search--2__location__icon"
            @click="locatorButtonPressed()"
          >
            my_location
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "weather-interactive",
  data() {
    return {
      search: "",
      latitude: "",
      longitude: "",
      map_location: "",

      current_position: "",
      search_location: "",
      search_func: null,
      isLoading: false,
    };
  },
  created() {
    this.locatorButtonPressed();
  },
  watch: {
    // prettier-ignore
    search_func(val) {
      this.xSearch(val)
    },
  },
  methods: {
    locatorButtonPressed() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.getCurrentLocation();
        },
        (error) => {
          console.log(error.message);
        }
      );
    },

    getTimezone() {
      let url = `https://timeapi.io/api/Time/current/coordinate?latitude=${this.latitude}&longitude=${this.longitude}`;

      console.log(url);

      axios
        .get(url)
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getCurrentLocation() {
      let url = `https://api.geoapify.com/v1/geocode/reverse?lat=${this.latitude}&lon=${this.longitude}&apiKey=f37e0afe38484d6eab164c775cc9b368`;

      axios
        .get(url)
        .then((response) => {
          let location =
            response.data.features[0].properties.city +
            ", " +
            response.data.features[0].properties.state;

          this.current_position = location;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    xSearch(value) {
      if (value) {
        // Items have already been requested
        if (this.isLoading) return;

        this.isLoading = true;

        let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=f37e0afe38484d6eab164c775cc9b368`;

        axios
          .get(url)
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => (this.isLoading = false));
      }
    },
  },
};
</script>
