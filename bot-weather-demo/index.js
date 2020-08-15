require("dotenv").config();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const axios = require("axios");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let telegram_url =
  "https://api.telegram.org/bot" +
  process.env.TELEGRAM_API_TOKEN +
  "/sendMessage";
let openWeatherUrl = process.env.OPENWEATHER_API_URL;

app.get("/", (req, res) => {
  res.send("Welcome to weather bot demo");
});

app.post("/bot-weather", function (req, res) {
  const { message } = req.body;
  let city = message.text;
  console.log("city : " + city);
  get_forecast(city).then((response) => {
    sendMessage(telegram_url, message, response, res);
  });
});

function sendMessage(url, message, reply, res) {
  axios
    .post(url, {
      chat_id: `${message.chat.id}`,
      parse_mode: "html",
      text: reply,
    })
    .then((response) => {
      // console.log("Sent : " + reply);
      res.end("ok");
    })
    .catch((error) => {
      console.log(error);
    });
}

function get_forecast(city) {
  let new_url =
    openWeatherUrl + city + "&appid=" + process.env.OPENWEATHER_API_KEY;
  // let new_url = 'http://demo4823458.mockable.io/openweathermap';
  // console.log("get_forecast url : " + new_url);
  return axios
    .get(new_url)
    .then((response) => {
      let weather_desc;
      if (response.data.weather != undefined && response.data.weather.length > 0) {
        weather_desc = response.data.weather[0].main + ', ' + response.data.weather[0].description;
      }
      let temp = response.data.main.temp;
      let humi = response.data.main.humidity;
      let wind_speed = response.data.wind.speed;

      // Converts temperature from Kelvin to Celsius
      temp = Math.round(temp - 273.15);
      let city_name = response.data.name;
      let resp = `${city_name} ~ weather: ${weather_desc} | temp: ${temp} &#x2103; | humi: ${humi} % | wind: ${wind_speed} m/s`;
      return resp;
    })
    .catch((error) => {
      console.log(error);
      let resp = city + " not found!";
      console.log(resp);
      return resp;
    });
}

app.listen(3000, () => console.log("Telegram bot is listening on port 3000!"));
