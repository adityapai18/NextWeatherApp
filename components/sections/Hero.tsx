import { useState } from "react";
import Image from "next/image";

const Hero = () => {
  // Sample random weather data
  const data = {
    weather: [{ main: "Clear" }],
    main: { temp: 25.3 }, // Temperature in Celsius
    name: "New York",
    sys: { country: "US" },
    dt: 1672531200,
    timezone: -18000,
  };

  // Function to format temperature (toggle between Celsius and Fahrenheit)
  const [isCelsius, setIsCelsius] = useState(true);

  const temperatureUnit = (temperature: number) => {
    return isCelsius
      ? `${temperature.toFixed(1)} °C`
      : `${(temperature * 1.8 + 32).toFixed(1)} °F`; // Convert to Fahrenheit
  };

  // Utility to get day and time based on timestamp
  const findTime = (timestamp: number, timezone: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    };
    return [date.toLocaleDateString("en-US", { weekday: "long" }), date.toLocaleTimeString("en-US", options)];
  };

  // Default values
  let description = "imageNotFound";
  let [day, time] = findTime(data.dt, data.timezone);
  let temperatureDisplay = temperatureUnit(data.main.temp);

  // Weather description for image
  description = data.weather[0]?.main.toLowerCase();

  return (
    <section className="flex flex-col justify-center mt-3 mb-5 padding-x">
      <div className="relative">
        <Image
          src={`/hero/${description}.webp`}
          width={1000}
          height={1000}
          alt="weather-img"
          priority={true}
          className="w-full h-[50vh] rounded-lg object-cover"
        />
        <div className="absolute bottom-0 p-3 flexBetween w-full sm:gap-0 gap-2">
          <div className="flex flex-col gap-2 hero-Text-Bg relative z-10">
            <h1 className="sm:text-7xl text-3xl">{temperatureDisplay}</h1>
            <h2 className="sm:text-3xl text-2xl">
              {data.name}&nbsp;
              <span className="sm:inline-block hidden">
                , {data.sys?.country}
              </span>
            </h2>
          </div>
          <div className="flex flex-col gap-2 justify-end mt-auto h-1/2 hero-Text-Bg relative z-10">
            <h3 className="hero-Subtext">{time}</h3>
            <h3 className="hero-Subtext">
              {data.weather[0]?.main}&nbsp;
              <span className="sm:inline-block hidden">, {day}</span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
