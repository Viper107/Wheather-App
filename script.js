const searchBtn = document.querySelector("button")
const cityInput = document.querySelector("input")
const resultDiv = document.querySelector(".result")

searchBtn.addEventListener("click", ()=>{
    const city = cityInput.value.trim();
    if(city){
        getCoordinates(city);

    }

    else{
        resultDiv.innerHTML = "<h3> Please enter a city name </h3>"
    }
});

async function getCoordinates(city) {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    const response = await fetch(geoUrl);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      resultDiv.innerHTML = "<h3>❌ City not found.</h3>";
      return;
    }

    const { latitude, longitude, name, country } = data.results[0];
    getWeather(latitude, longitude, name, country); // fetch weather next
  } catch (error) {
    resultDiv.innerHTML = "<h3>⚠️ Error fetching location.</h3>";
  }
}


async function getWeather(lat, lon, name, country) {
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await fetch(weatherUrl);
    const data = await response.json();

    const weather = data.current_weather;
    const condition = mapWeatherCode(weather.weathercode);

    resultDiv.innerHTML = `
      <h3>🌍 Weather in ${name}, ${country}</h3>
      <h3>🌡️ Temperature: ${weather.temperature} °C</h3>
      <h3>⛅ Condition: ${condition}</h3>
      <h3>💨 Wind Speed: ${weather.windspeed} km/h</h3>
    `;
  } catch (error) {
    resultDiv.innerHTML = "<h3>⚠️ Error fetching weather.</h3>";
  }
}


function mapWeatherCode(code) {
  const weatherMap = {
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤️",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Fog 🌫️",
    48: "Rime fog ❄️",
    51: "Light drizzle 🌦️",
    61: "Rain showers 🌧️",
    71: "Snowfall ❄️",
    80: "Heavy rain 🌧️",
    95: "Thunderstorm ⛈️"
  };
  return weatherMap[code] || "Unknown";
}
