// HTML element variables
var searchBtn = document.getElementById("search-button");
var clearBtn = document.getElementById("clear");
var citySearch = document.getElementById("city-search");
var historyList = document.getElementById("history");
var todayCity = document.getElementById("today-city");
var todayIcon = document.getElementById("today-icon");
var todayStats = document.getElementById("today-stats");
var fiveDays = document.getElementsByClassName("five-day");
var weatherInfo = document.getElementById("main");
// Local storage variable for search history
var cityHistory = JSON.parse(localStorage.getItem("history")) || [];

// Reformats dates from YYYY-DD-MM to DD/MM/YYYY
function reformatDate(date) {
  var dateArray = date.split("-");
  var newDate = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0];
  return newDate;
}

// Displays selected weather data on webpage
function printWeather(data) {
  var city = data.city.name;
  var todayDate = reformatDate(data.list[0].dt_txt.split(" ")[0]);
  var todayWeather = {
    temp: data.list[0].main.temp,
    wind: data.list[0].wind.speed,
    humidity: data.list[0].main.humidity,
  };
  todayCity.textContent = city + " (" + todayDate + ")";
  todayIcon.src =
    "https://openweathermap.org/img/wn/" +
    data.list[0].weather[0].icon +
    "@2x.png";
  todayStats.innerHTML =
    "<li>Temp: " +
    todayWeather.temp +
    " &deg;F</li><li>Wind: " +
    todayWeather.wind +
    " MPH</li><li>Humidity: " +
    todayWeather.humidity +
    "%</li>";
  for (let i = 0; i < fiveDays.length; i++) {
    var thisDate = fiveDays[i].children[0];
    var thisIcon = fiveDays[i].children[1];
    var thisStats = fiveDays[i].children[2];
    var weatherIndex = 7 + 8 * i;
    var date = reformatDate(data.list[weatherIndex].dt_txt.split(" ")[0]);
    var weather = {
      temp: data.list[weatherIndex].main.temp,
      wind: data.list[weatherIndex].wind.speed,
      humidity: data.list[weatherIndex].main.humidity,
    };
    thisDate.textContent = date;
    thisIcon.src =
      "https://openweathermap.org/img/wn/" +
      data.list[weatherIndex].weather[0].icon +
      "@2x.png";
    thisStats.innerHTML =
      "<li>Temp: " +
      weather.temp +
      " &deg;F</li><li>Wind: " +
      weather.wind +
      " MPH</li><li>Humidity: " +
      weather.humidity +
      "%</li>";
  }
  weatherInfo.setAttribute("style", "display: block");
}

// Gets weather data based on coords
function weatherFinder(lat, lon) {
  var requestURL =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=218343ff3f62251dde68dd390ad7ac64";
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      printWeather(data);
    });
}

// Creates history buttons and adds listeners
function createHistory(city) {
  var historyBtn = document.createElement("li");
  historyBtn.innerHTML = "<button>" + city + "</button>";
  historyBtn.classList.add("historyBtn");
  historyList.appendChild(historyBtn);
  historyBtn.addEventListener("click", function () {
    citySearch.value = city;
    searchHandler();
  });
}

// Fetches coordinates based on city name input, adds to search history if needed
function searchHandler() {
  var cityInput = citySearch.value;
  var requestURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityInput +
    "&limit=5&appid=218343ff3f62251dde68dd390ad7ac64";
  if (!cityInput) {
    return;
  }
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data.length) {
        alert("No city found with that name.");
        return;
      }
      if (!cityHistory.includes(cityInput)) {
        cityHistory.push(cityInput);
        createHistory(cityInput);
        localStorage.setItem("history", JSON.stringify(cityHistory));
      }
      var cityLat = data[0].lat;
      var cityLon = data[0].lon;
      weatherFinder(cityLat, cityLon);
    });
}

// Clears search history
function clearHandler() {
  localStorage.clear();
  historyList.innerHTML = "";
  citySearch.value = "";
}

// Pulls from local storage if any and calls createHistory to make buttons
for (let i = 0; i < cityHistory.length; i++) {
  createHistory(cityHistory[i]);
}

// Event listeners
searchBtn.addEventListener("click", searchHandler);
clearBtn.addEventListener("click", clearHandler);
