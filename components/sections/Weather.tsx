import { useState } from "react";
// import { formatTime } from "@/utils";
import WeatherCard from "@/components/WeatherCard";
import { Button } from "../ui/button";

const Weather = () => {
  // Sample mock weather data
  const data = {
    main: {
      temp: 25.3,
      humidity: 70,
      feels_like: 24.5,
    },
    sys: {
      sunrise: 1672560000,
      sunset: 1672603200,
    },
    wind: {
      speed: 12,
    },
    visibility: 10,
  };

  // State to toggle between Celsius and Fahrenheit
  const [isCelsius, setIsCelsius] = useState(true);

  const toggleTemperatureUnit = () => {
    setIsCelsius((prev) => !prev);
  };

  // Function to format temperature
  const temperatureUnit = (temperature: number) => {
    return isCelsius ? `${temperature.toFixed(1)} °C` : `${((temperature * 9) / 5 + 32).toFixed(1)} °F`;
  };

  // Prepare temperature display
  const temperatureDisplay = temperatureUnit(data.main.temp);

  // Weather card data array
  const weatherCardArray = [
    {
      title: "Sunrise",
      imgSrc: "/weather/sunrise.svg",
      value: `${(data?.sys?.sunrise)}`,
    },
    {
      title: "Sunset",
      imgSrc: "/weather/sunset.svg",
      value: `${(data?.sys?.sunset)}`,
    },
    {
      title: "Wind",
      imgSrc: "/weather/wind.svg",
      value: `${data?.wind?.speed} km/h`,
    },
    {
      title: "Humidity",
      imgSrc: "/weather/humidity.svg",
      value: `${data?.main?.humidity} %`,
    },
    {
      title: "Feels Like",
      imgSrc: "/weather/feels.svg",
      value: temperatureDisplay,
    },
    {
      title: "Visibility",
      imgSrc: "/weather/visibility.svg",
      value: `${data.visibility} km`,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
      <Button onClick={toggleTemperatureUnit}>
        Change to {isCelsius ? "°F" : "°C"}
      </Button>

      {weatherCardArray.map((card, index) => (
        <WeatherCard
          title={card.title}
          imgSrc={card.imgSrc}
          value={card.value}
          key={index}
        />
      ))}
    </div>
  );
};

export default Weather;
