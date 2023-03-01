var weatherImage = "";

var imagePhoto = {
  thunder:
    "https://s-media-cache-ak0.pinimg.com/originals/2e/43/73/2e4373184057ab029b5ca15aca484b09.jpg",
  rainy: "https://i.ytimg.com/vi/q76bMs-NwRk/maxresdefault.jpg",
  cloudy:
    "https://static1.squarespace.com/static/57523357c2ea515ccf6c1adb/58dcea75bebafb06e997da9c/58dcece61e5b6cf38585d46b/1490873606398/mostly+cloudy.jpg",
  snow: "https://static.bhphotovideo.com/explora/sites/default/files/Correct.jpg",
  clear:
    "https://mota.ru/upload/wallpapers/2010/05/14/08/01/22099/mota_ru_0051405-2560x1600.jpg",
  drizzle:
    "https://s-media-cache-ak0.pinimg.com/736x/e4/43/f5/e443f59b4f03dd487d090a279c2f08ab--rain-drops-water-drops.jpg",
  haze: "https://ak3.picdn.net/shutterstock/videos/3578564/thumb/1.jpg",
  tornado: "https://i.ytimg.com/vi/5QnsRXUbsK4/maxresdefault.jpg",
  cold: "https://static.pexels.com/photos/374/snow-dawn-sunset-winter.jpg",
  windy: "https://ak9.picdn.net/shutterstock/videos/4337360/thumb/1.jpg",
  hail: "https://s-media-cache-ak0.pinimg.com/236x/7c/60/3d/7c603d9183ff32c92330780a2ebdcfca--rainy-weather-rainy-days.jpg",
  sunny: "https://i.ytimg.com/vi/rG9fev-m0ag/maxresdefault.jpg",
};

function selectImage(id) {
  if (id >= 200 && id <= 232) {
    weatherImage = imagePhoto.thunder;
  } else if (id >= 300 && id <= 321) {
    weatherImage = imagePhoto.drizzle;
  } else if (id >= 500 && id <= 531) {
    weatherImage = imagePhoto.rainy;
  } else if (id >= 600 && id <= 622) {
    weatherImage = imagePhoto.snow;
  } else if (id >= 701 && id <= 721) {
    weatherImage = imagePhoto.haze;
  } else if (id === 800) {
    weatherImage = imagePhoto.clear;
  } else if (id >= 801 && id <= 804) {
    weatherImage = imagePhoto.cloudy;
  } else if (id >= 900 && id <= 902) {
    weatherImage = imagePhoto.tornado;
  } else if (id === 903) {
    weatherImage = imagePhoto.cold;
  } else if (id === 904) {
    weatherImage = imagePhoto.sunny;
  } else if (id === 905) {
    weatherImage = imagePhoto.windy;
  } else if (id === 906) {
    weatherImage = imagePhoto.hail;
  } else {
    weatherImage = imagePhoto.windy;
  }

  $("body").css("background-image", "url(" + weatherImage + ")");
}
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "2ff29bed3181c3526c35cc5408037f85";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "2ff29bed3181c3526c35cc5408037f85";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

search("New York");
