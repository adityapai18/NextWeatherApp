"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [location, setLocation] = useState<string>("New York, US");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Default location coordinates
  const defaultCoords = { lat: 40.7128, lon: -74.006 };

  // Function to fetch weather data
  async function fetchWeather(lat: number, lon: number) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setLoading(false);
    }
  }

  // Request user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          // If location permission is denied, use default location
          fetchWeather(defaultCoords.lat, defaultCoords.lon);
        }
      );
    } else {
      // If Geolocation is not supported, use default location
      fetchWeather(defaultCoords.lat, defaultCoords.lon);
    }
  }, []);

  return (
    <div>
      
    </div>
  );
}
