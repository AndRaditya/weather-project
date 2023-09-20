<template>
  <div class="weather-functional" v-if="current_weather">
    <div class="weather-functional__today">
      <div class="weather-functional__today--1">
        <p class="text__functional-title weather-functional__today--1__1">
          {{ current_weather.dt }}
          <!-- <span class="text__functional-date"></span> -->
        </p>
        <div class="weather-functional__today--1__switch">
          <p class="text__functional-switch">Units:</p>
          <v-switch
            v-model="switch_model"
            inset
            class="weather-functional__today--1__switch--2"
            :label="`${switch_unit}`"
          >
          </v-switch>
        </div>
      </div>
      <div class="weather-functional__today--2">
        <div class="weather-functional__today--2__main">
          <div class="weather-functional__today--2__main--1">
            <p class="text__functional-weather__main">
              {{ current_weather.main.temp }}&#xb0; {{ temp_unit }}
            </p>
          </div>
          <div class="weather-functional__today--2__main--2">
            <p
              class="text__functional-weather__second weather-functional__today--2__main--2__child-1"
            >
              {{ current_weather.weather[0].description }}
            </p>
            <div
              class="weather-functional__today--image weather-functional__today--2__main--2__child-2"
              v-bind:style="{
                backgroundImage: `url(${current_weather.icon_url})`,
              }"
            ></div>
          </div>
          <div class="weather-functional__today--2__main--3">
            <p class="text__functional-weather__feels">
              Feels like {{ current_weather.main.feels_like }}&#xb0;
              {{ temp_unit }}
            </p>
          </div>
        </div>
        <div class="weather-functional__today--2__line"></div>
        <div class="weather-functional__today--2__desc">
          <div class="weather-functional__today--2__desc--child-1">
            <p class="text__functional-weather__desc">
              Humidity: {{ current_weather.main.humidity }}%
            </p>
          </div>
          <div class="weather-functional__today--2__desc--child-2">
            <p class="text__functional-weather__desc">
              Visibility: {{ current_weather.visibility }}km
            </p>
          </div>
          <div class="weather-functional__today--2__desc--child-3">
            <p class="text__functional-weather__desc">
              Cloud Cover: {{ current_weather.clouds.all }}%
            </p>
          </div>
          <div class="weather-functional__today--2__desc--child-4">
            <p class="text__functional-weather__desc">
              Wind: {{ current_weather.wind.speed }} m/s
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="weather-functional__daily">
      <div class="weather-functional__daily--1">
        <p class="text__functional-daily">Daily</p>
      </div>
      <div class="weather-functional__daily--2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "weather-functional",
  data() {
    return {
      switch_model: false,
      latitude: "",
      longitude: "",

      units: "",
      temp_unit: "",
      switch_unit: "Metric",

      current_weather: null,
    };
  },
  created() {
    this.initData();
  },
  watch: {
    switch_model(val) {
      if (!val) {
        this.units = "metric";
        this.switch_unit = "Metric";
      } else {
        this.units = "imperial";
        this.switch_unit = "Imperial";
      }
      this.getCurrentWeather();
    },
  },
  methods: {
    initData() {
      this.units = "metric";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.getCurrentWeather();
        },
        (error) => {
          console.log(error.message);
        }
      );
    },

    getCurrentWeather() {
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&units=${this.units}&appid=e4e8e147dc1cd4d76ca49148ec926861`;

      if (this.units == "metric") {
        this.temp_unit = "C";
      } else if (this.units == "imperial") {
        this.temp_unit = "F";
      } else {
        this.temp_unit = "K";
      }

      axios
        .get(url)
        .then((response) => {
          this.current_weather = response.data;
          console.log(this.current_weather);
          if (this.current_weather) {
            this.getCurrentWeatherDatas();
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => (this.isLoading = false));
    },

    roundFunction(unit) {
      return Math.round(unit);
    },

    getCurrentWeatherDatas() {
      this.current_weather.main.temp = this.roundFunction(
        this.current_weather.main.temp
      );

      this.current_weather.main.feels_like = this.roundFunction(
        this.current_weather.main.feels_like
      );

      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const date = new Date(this.current_weather.dt * 1000);

      this.current_weather.dt =
        date.toLocaleDateString("en-us", options) +
        ", " +
        date.toLocaleTimeString();

      this.current_weather.weather[0].description =
        this.current_weather.weather[0].description.charAt(0).toUpperCase() +
        this.current_weather.weather[0].description.slice(1);

      this.current_weather.icon_url = `https://openweathermap.org/img/wn/${this.current_weather.weather[0].icon}@4x.png`;

      this.current_weather.visibility = this.current_weather.visibility / 1000;
    },
  },
};
</script>
