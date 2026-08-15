const SEARCH_FORM = document.querySelector(".search-form");
const CITY_INPUT = document.querySelector(".city-input");
const SEARCH_BUTTON = document.querySelector(".search-button");

const LOADING = document.querySelector(".loading");
const WEATHER_RESULT = document.querySelector(".weather-result");
const ERROR_CARD = document.querySelector(".error-card");

const TEMPERATURE = document.querySelector(".temperature");
const CITY_NAME = document.querySelector(".city-name");
const WEATHER_ICON = document.querySelector(".weather-icon");

const FEELS_LIKE = document.querySelector(".feels-like");
const HUMIDITY = document.querySelector(".humidity");
const WIND = document.querySelector(".wind");
const DESCRIPTION = document.querySelector(".description");

const ERROR_MESSAGE = document.querySelector(".error-message");

//===========================================================Block 2:==========================================================================================================================

const API_URL = "https://api.openweathermap.org/data/2.5/weather";

SEARCH_FORM.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cityName = CITY_INPUT.value.trim(); // getting city name from input;

  if (!cityName) {
    // which means if cityName is empty, quite;
    return;
  }

  SEARCH_BUTTON.disabled = true; // block the button;

  WEATHER_RESULT.classList.add("hidden");
  ERROR_CARD.classList.add("hidden"); // now we are hiding previous results and previous errors;
  LOADING.classList.remove("hidden"); // which means remove "hidden" from class LOADING;

  try {
    const response = await fetch(
      `${API_URL}?q=${cityName}&units=metric&appid=${APP_ID}`, // App_ID from config.js is working only in my pc, because of local id.
    );

    console.log("Response Status", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Weather Data: ", data);

      TEMPERATURE.textContent = `${Math.round(data.main.temp)}°C`; // main should be from html;
      CITY_NAME.textContent = `${data.name}, ${data.sys.country}`;
      FEELS_LIKE.textContent = `${Math.round(data.main.feels_like)}°C`;
      HUMIDITY.textContent = `${data.main.humidity}%`;
      WIND.textContent = `${data.wind.speed} m/s`;
      DESCRIPTION.textContent = data.weather[0].main.charAt(0).toUpperCase() + data.weather[0].main.slice(1);

      const iconCode = data.weather[0].icon;
      WEATHER_ICON.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

      //=============================================Block 3=======================================================================================================================

      LOADING.classList.add("hidden"); // hide loading bar, because we need to see results;
      WEATHER_RESULT.classList.remove("hidden"); // Previously WEATHER_RESULT was hidden, now we just remove "hidden" part;
    } else {
      LOADING.classList.add("hidden");

      if (response.status === 404) {
        ERROR_MESSAGE.textContent = `City "${cityName}" not found`;
      } else {
        ERROR_MESSAGE.textContent = `Error: ${response.status} ${response.statusText}`;
      }

      ERROR_CARD.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error: ", error); // Any Network Isuues, and son on...;

    LOADING.classList.add("hidden");
    ERROR_MESSAGE.textContent = "Network error. Check your connection.";
    ERROR_CARD.classList.remove("hidden");
  } finally {
    SEARCH_BUTTON.disabled = false;
    CITY_INPUT.value = "";
  }
});
