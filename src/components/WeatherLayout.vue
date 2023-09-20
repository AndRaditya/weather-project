<template>
  <div
    class="weather-page"
    :class="dark_mode ? 'weather-page__light' : 'weather-page__dark'"
  >
    <div
      class="loading__mode"
      v-if="isLoading"
      @wheel.prevent
      @touchmove.prevent
      @scroll.prevent
    >
      <div class="loading__mode--1">
        <v-progress-circular
          indeterminate
          color="#fff"
          :size="45"
          :width="5"
        ></v-progress-circular>
      </div>
    </div>
    <div class="weather-page__1 weather-interactive" id="weather-interactive">
      <div class="weather-interactive__1" v-if="!isLoading">
        <p class="text__interactive-title">Weather Whisper</p>
      </div>
      <div class="weather-interactive__2" v-if="!isLoading">
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
      <div class="weather-interactive__3" v-if="!isLoading">
        <p class="text__interactive-credit">
          Photo By
          <a
            :href="credit_url_1"
            class="text__interactive-credit--link"
            target="_blank"
            >{{ credit_name }}</a
          >

          on
          <a
            :href="credit_url_2"
            class="text__interactive-credit--link"
            target="_blank"
            >Unsplash</a
          >
        </p>
      </div>
      <div class="weather-interactive__4" v-if="!isLoading">
        <div class="weather-interactive__4-search--1">
          <!-- <p class="text__interactive-subtitle">
            Listen to the Secrets of the Sky.
          </p> -->
          <VueWriter
            :array="headline_weather"
            class="text__interactive-subtitle"
            :typeSpeed="100"
            :eraseSpeed="35"
          />
          <!-- :caret="cursor" -->
        </div>
        <div class="weather-interactive__4-search--2">
          <div class="weather-interactive__4-search--2__bar">
            <input
              class="weather-interactive__input"
              type="text"
              placeholder="Search Location..."
              v-model="search_location"
              ref="autocomplete"
              id="autocomplete_location"
              @click="search_location = ''"
            />
          </div>
          <div class="weather-interactive__4-search--2__location">
            <span
              class="material-symbols-outlined weather-interactive__4-search--2__location__icon"
              @click="initData()"
            >
              my_location
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="weather-page__2 weather-functional"
      :class="
        dark_mode ? 'weather-functional__light' : 'weather-functional__dark'
      "
      v-if="current_weather"
    >
      <div class="weather-functional__today" v-if="!isLoading">
        <div class="weather-functional__today--1">
          <p class="text__functional-title weather-functional__today--1__1">
            {{ tanggal_jam }}
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
              <p class="text__functional-weather__main-title">
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
                Visibility: {{ current_weather.visibility.toFixed(2) }}km
              </p>
            </div>
            <div class="weather-functional__today--2__desc--child-3">
              <p class="text__functional-weather__desc">
                Cloud Cover: {{ current_weather.clouds.all }}%
              </p>
            </div>
            <div class="weather-functional__today--2__desc--child-4">
              <p class="text__functional-weather__desc">
                Wind: {{ current_weather.wind.speed.toFixed(2) }}
                {{ speed_unit }}
              </p>
            </div>
          </div>
        </div>
        <div class="weather-functional__today--3">
          <span
            class="material-symbols-outlined weather-functional__icon-light"
            @click="dark_mode = !dark_mode"
            v-if="!dark_mode"
          >
            dark_mode
          </span>
          <span
            class="material-symbols-outlined weather-functional__icon-light"
            @click="dark_mode = !dark_mode"
            v-if="dark_mode"
          >
            light_mode
          </span>
        </div>
      </div>
      <div class="weather-functional__daily" v-if="!isLoading">
        <div class="weather-functional__daily--1">
          <p class="text__functional-daily">{{ daily_weather.length }} Days</p>
        </div>
        <div class="weather-functional__daily--2">
          <!-- slidesPerView="2.2" -->
          <swiper
            :breakpoints="swiperOptions.breakpoints"
            class="mySwiper"
            :freeMode="true"
            :pagination="{
              clickable: true,
            }"
            :modules="modules"
          >
            <swiper-slide
              class="swiper-slide"
              v-for="(daily, index) in daily_weather"
              :key="index"
            >
              <div class="swiper-slide--1">
                <p class="text__functional-weather__main">
                  {{ daily.main.temp }}&#xb0; {{ temp_unit }}
                </p>
              </div>
              <div class="swiper-slide--2">
                <p
                  class="text__functional-weather__second swiper-slide--2__child-1"
                >
                  {{ daily.weather[0].description }}
                </p>
                <div
                  class="weather-functional__today--image swiper-slide--2__child-2"
                  v-bind:style="{
                    backgroundImage: `url(${urlIcon(daily.weather[0].icon)})`,
                  }"
                ></div>
              </div>
              <div class="swiper-slide--3">
                <p class="text__functional-weather__desc">
                  {{ daily.dt }}
                </p>
              </div></swiper-slide
            >
          </swiper>
        </div>
      </div>
    </div>
    <section id="map" ref="map"></section>
  </div>
</template>

<script>
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

import "swiper/css/free-mode";
import "swiper/css/pagination";

export default {
  name: "weather-interactive",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [FreeMode, Pagination],
    };
  },
  data() {
    return {
      headline_weather: [
        "Listen to the Secrets of the Sky.",
        "Weather Insights for Smarter Living.",
        "Explore Weather, Embrace Life.",
      ],
      tanggal_jam: "",
      dark_mode: true,
      isLoading: false,

      daytime: null,
      credit_name: "",
      credit_url_1: "",
      credit_url_2: "",

      search: "",
      latitude: "",
      longitude: "",
      map_location: "",

      current_position: "",
      search_location: "",
      search_func: null,
      switch_model: false,

      units: "",
      temp_unit: "C",
      switch_unit: "Metric",
      speed_unit: "m/s",

      api_key: "appid=e4e8e147dc1cd4d76ca49148ec926861",
      current_weather: null,
      daily_weather: [],

      swiperOptions: {
        breakpoints: {
          1100: {
            slidesPerView: 2.2,
            spaceBetween: 20,
          },
          960: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          801: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          501: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          376: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          100: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
        },
      },
    };
  },
  created() {
    this.initData();
  },
  watch: {
    search_location(val) {
      if (val) {
        this.autocompleteFunc();
      }
    },

    switch_model(val) {
      if (!val) {
        this.units = "metric";
        this.switch_unit = "Metric";
        this.speed_unit = "m/s";
        this.temp_unit = "C";
      } else {
        this.units = "imperial";
        this.switch_unit = "Imperial";
        this.speed_unit = "mph";
        this.temp_unit = "F";
      }
      this.daily_weather = [];
      this.isLoading = true;
      this.getCurrentWeather();
      this.getDailyWeather();
    },
  },
  methods: {
    initData() {
      this.isLoading = true;
      this.units = "metric";
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.daily_weather = [];

          this.getCurrentWeather();
          this.getCurrentLocation();
          this.getDailyWeather();
        },
        (error) => {
          console.log(error.message);
        }
      );
    },

    getTimeBaseLocation() {
      let url = `https://api.api-ninjas.com/v1/worldtime?lat=${this.latitude}&lon=${this.longitude}`;

      axios
        .get(url, {
          headers: {
            "X-Api-Key": "+fM+9x1JhUkfLnM+l+krtQ==HZlPMN2cXHUitsBA",
          },
        })
        .then((response) => {
          // console.log(response);

          const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
          };

          const date = new Date(response.data.datetime);

          const time = date.toLocaleTimeString("en-GB");
          const hour = date.getHours();
          var element = document.getElementById("weather-interactive");

          if (hour >= 6 && hour < 18) {
            this.daytime = true;
            this.dark_mode = true;

            element.classList.add("weather-page__day");
            element.classList.remove("weather-page__night");
          } else if (hour >= 18 || hour < 6) {
            this.daytime = false;
            this.dark_mode = false;

            element.classList.add("weather-page__night");
            element.classList.remove("weather-page__day");
          }

          this.creditName();

          this.tanggal_jam =
            date.toLocaleDateString("en-us", options) + ", " + time;
          this.isLoading = false;
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
          let location = "";

          if (response.data.features[0].properties.state) {
            if (
              response.data.features[0].properties.state ==
              response.data.features[0].properties.city
            ) {
              location =
                response.data.features[0].properties.city +
                ", " +
                response.data.features[0].properties.country;
            } else {
              location =
                response.data.features[0].properties.city +
                ", " +
                response.data.features[0].properties.state;
            }
          } else if (
            response.data.features[0].properties.city &&
            response.data.features[0].properties.country
          ) {
            location =
              response.data.features[0].properties.city +
              ", " +
              response.data.features[0].properties.country;
          } else if (response.data.features[0].properties.country) {
            location =
              response.data.features[0].properties.name +
              ", " +
              response.data.features[0].properties.country;
          }

          this.current_position = location;
          this.search_location = this.current_position;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getCurrentWeather() {
      this.current_weather = null;
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&units=${this.units}&${this.api_key}`;

      axios
        .get(url)
        .then((response) => {
          this.current_weather = response.data;
          if (this.current_weather) {
            this.getTimeBaseLocation();
            this.getCurrentWeatherDatas();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getDailyWeather() {
      this.daily_weather = [];
      let url = `https://api.openweathermap.org/data/2.5/forecast/?lat=${this.latitude}&lon=${this.longitude}&units=${this.units}&${this.api_key}`;

      let dateNow = new Date().toLocaleDateString();

      axios
        .get(url)
        .then((response) => {
          let daily_temp = response.data;

          const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
          };

          for (let i = 0; i < daily_temp.list.length; i++) {
            const getDate = new Date(daily_temp.list[i].dt * 1000);
            daily_temp.list[i].weather[0].description = this.uppercaseFunction(
              daily_temp.list[i].weather[0].description
            );

            daily_temp.list[i].dt = getDate.toLocaleDateString(
              "en-us",
              options
            );

            daily_temp.list[i].main.temp = this.roundFunction(
              daily_temp.list[i].main.temp
            );

            if (
              daily_temp.list[i].dt_txt.includes("12:00:00") &&
              dateNow < getDate.toLocaleDateString()
            ) {
              this.daily_weather.push(daily_temp.list[i]);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
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

      this.current_weather.weather[0].description = this.uppercaseFunction(
        this.current_weather.weather[0].description
      );

      this.current_weather.icon_url = `https://openweathermap.org/img/wn/${this.current_weather.weather[0].icon}@4x.png`;

      this.current_weather.visibility = this.current_weather.visibility / 1000;
      this.creditName();
    },

    uppercaseFunction(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },

    urlIcon(value) {
      return `https://openweathermap.org/img/wn/${value}@4x.png`;
    },

    creditName() {
      if (!this.daytime) {
        this.credit_name = "Arindam Saha";
        this.credit_url_1 =
          "https://unsplash.com/@hyperickz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText";
        this.credit_url_2 =
          "https://unsplash.com/photos/rSLIzC-dlB4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText";
      } else {
        this.credit_name = "NEOM";
        this.credit_url_1 =
          "https://unsplash.com/@neom?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText";
        this.credit_url_2 =
          "https://unsplash.com/photos/0rvKw0fDiHk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText";
      }
    },

    autocompleteFunc() {
      var autocomplete = new google.maps.places.Autocomplete(
        // val,
        this.$refs["autocomplete"],
        // id_autocomplete,
        {
          bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(this.latitude, this.longitude)
          ),
        }
      );
      autocomplete.addListener("place_changed", () => {
        console.log(autocomplete);
        this.isLoading = true;
        var place = autocomplete.getPlace();
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.getCurrentWeather();
        this.getCurrentLocation();
        this.getDailyWeather();
      });
    },
  },
  mounted() {
    // const id_autocomplete = document.getElementById("autocomplete_location");
  },
};
</script>
