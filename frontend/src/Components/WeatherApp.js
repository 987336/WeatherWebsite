import React, { useState, useEffect } from "react";
import "../../src/weather.css";
import { WiDaySunny, WiRain, WiSnow, WiCloud, WiThunderstorm } from "react-icons/wi";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  let YourKeyHere = "6e17e4b03169d8c8397f4a3db820a350";

  useEffect(() => {
    // Fetch current location weather on initial load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        () => {
          setError("Unable to retrieve your location. Please search manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const fetchWeatherByCoordinates = (lat, lon) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${YourKeyHere}`
    )
      .then((result) => result.json())
      .then((response) => {
        if (response.cod !== 200) {
          setError("Unable to fetch weather data. Please search manually.");
        } else {
          setWeather(response);
          setCity(response.name); // Set city name to display in the input field
        }
      });
  };

  const GetWeather = () => {
    if (!city) {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }
    setError(null);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${YourKeyHere}`
    )
      .then((result) => result.json())
      .then((response) => {
        if (response.cod !== 200) {
          setError("City not found. Please try again.");
          setWeather(null);
        } else {
          setWeather(response);
        }
      });
  };

  const getWeatherConditionClass = () => {
    if (!weather) return "default-bg";
    const condition = weather.weather[0].main.toLowerCase();
    switch (condition) {
      case "clear":
        return "sunny-bg";
      case "rain":
        return "rainy-bg";
      case "clouds":
        return "cloudy-bg";
      case "snow":
        return "snowy-bg";
      case "thunderstorm":
        return "stormy-bg";
      default:
        return "default-bg";
    }
  };

  return (
    <div className={`weather-app-container ${getWeatherConditionClass()}`}>
      <div className="content-card">
        <h1 className="app-title">Weather</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Search for a city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="city-input"
          />
          <button onClick={GetWeather} className="fetch-button">
            Search
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {weather && (
          <div className="weather-display">
            <div className="weather-summary">
              <div className="weather-icon">
                {getWeatherConditionClass() === "sunny-bg" && <WiDaySunny size={100} />}
                {getWeatherConditionClass() === "rainy-bg" && <WiRain size={100} />}
                {getWeatherConditionClass() === "cloudy-bg" && <WiCloud size={100} />}
                {getWeatherConditionClass() === "snowy-bg" && <WiSnow size={100} />}
                {getWeatherConditionClass() === "stormy-bg" && <WiThunderstorm size={100} />}
              </div>
              <div>
                <h2>{weather.name}</h2>
                <h3>{(weather.main.temp - 273.15).toFixed(1)}°C</h3>
                <p>{weather.weather[0].description}</p>
              </div>
            </div>
            <div className="weather-details">
              <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
              <p><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { WeatherApp };
