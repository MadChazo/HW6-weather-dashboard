var searchBtn = document.getElementById("search-button");
var citySearch = document.getElementById("city-search");
var historyList = document.getElementById("history");

var cityHistory = JSON.parse(localStorage.getItem("history")) || [];

function weatherFinder(lat, lon) {
  var requestURL =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=218343ff3f62251dde68dd390ad7ac64";
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function createHistory(city) {
  var historyBtn = document.createElement("button");
  historyBtn.textContent = city;
  historyList.appendChild(historyBtn);
}

function searchHandler() {
  var cityInput = citySearch.value;
  var requestURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityInput +
    "&limit=5&appid=218343ff3f62251dde68dd390ad7ac64";
  if (!cityInput) {
    console.log("no input");
    return;
  }
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data.length) {
        console.log("no city found");
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

for (let i = 0; i < cityHistory.length; i++) {
  createHistory(cityHistory[i]);
}

searchBtn.addEventListener("click", searchHandler);
