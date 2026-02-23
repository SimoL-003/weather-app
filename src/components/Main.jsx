import { useEffect, useState, useRef } from "react";
import axios from "axios";
import getHourlyWeather from "../functions/getHourlyWeather";
import HourlyWeather from "./atoms/HourlyWeather";
import getDailyWeather from "../functions/getDailyWeather";
import MainWeatherCard from "./organisms/MainWeatherCard";
import WeatherInfoGrid from "./organisms/WeatherInfoGrid";
import DailyForecast from "./organisms/DailyForecast";

export default function Main() {
  const [search, setSearch] = useState(""); // controlled input value
  const [searchedLocation, setSearchedLocation] = useState(null); // location object selected from suggestions
  const [weatherData, setWeatherData] = useState(null); // weather data for selected location
  const [locationSuggestions, setLocationSuggestions] = useState([]); // list of location suggestions based on search input
  const debounceTimeout = useRef(null);

  //   HANDLE FORM SUBMISSION
  function handleSubmit(e) {
    e.preventDefault();
    const selectedLocation = locationSuggestions.find((loc) => {
      const postcode =
        loc.postcodes && loc.postcodes.length > 0
          ? `, ${loc.postcodes[0]}`
          : "";
      const suggestionString = `${loc.name}${postcode}, ${loc.country}`;
      return suggestionString === search.trim();
    });
    if (selectedLocation) {
      setSearchedLocation(selectedLocation);
    } else {
      // TODO togliere l'alert e inserire un messaggio di errore sotto il campo di ricerca
      alert("Please select a valid location from the suggestions.");
    }
  }

  //   FETCH WEATHER DATA FOR SELECTED LOCATION (default to Milan if no location selected)
  useEffect(() => {
    axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${searchedLocation?.latitude || 45.46}&longitude=${searchedLocation?.longitude || 9.18}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`,
      )
      .then((res) => {
        setWeatherData(res.data);
        setSearch("");
      });
  }, [searchedLocation]);

  //   FETCH LOCATION SUGGESTIONS
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (search.trim() === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocationSuggestions([]);
      return;
    }

    debounceTimeout.current = setTimeout(() => {
      axios
        .get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search.trim())}&count=10&language=en&format=json`,
        )
        .then((res) => {
          if (res.data && res.data.results) {
            setLocationSuggestions(res.data.results);
          } else {
            setLocationSuggestions([]);
          }
        })
        .catch(() => setLocationSuggestions([]));
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [search]);

  // Get hourly weather data for the next 24 hours starting from the current hour
  const hourlyWeather = weatherData
    ? getHourlyWeather(weatherData.hourly, weatherData.hourly_units)
    : null;

  // Get daily weather data for the next 7 days starting from today
  const dailyWeather = weatherData
    ? getDailyWeather(weatherData.daily, weatherData.daily_units)
    : null;

  return (
    <main className="bg-neutral-900 min-h-screen text-neutral-0 font-dm-sans pb-10 px-4">
      <div className="container max-w-full lg:max-w-6xl mx-auto px-3 lg:px-0">
        {/* HERO */}
        <h1 className="text-5xl font-semibold text-center leading-tight py-8 lg:py-12 font-bricolage px-2 lg:px-4">
          How's the sky looking today?
        </h1>

        {/* SEARCH FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-2.5 max-w-xl lg:max-w-2xl mx-auto"
        >
          {/* Input */}
          <div className="lg:w-4/5">
            <label htmlFor="search" className="invisible absolute">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a place..."
              className="bg-neutral-600 py-4 px-5 tracking-wider text-lg rounded-2xl placeholder:text-neutral-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              list="location-suggestions"
              autoComplete="off"
            />
            <datalist id="location-suggestions">
              {locationSuggestions.map((loc) => {
                const postcode =
                  loc.postcodes && loc.postcodes.length > 0
                    ? `, ${loc.postcodes[0]}`
                    : "";
                return (
                  <option
                    key={loc.id}
                    value={`${loc.name}${postcode}, ${loc.country}`}
                  />
                );
              })}
            </datalist>
          </div>
          {/* Button */}
          <button className="bg-blue-500 py-4 font-semibold tracking-wide text-lg rounded-2xl lg:w-1/5 hover:bg-blue-700 transition-colors">
            Search
          </button>
        </form>

        {weatherData && (
          <>
            {/* WEATHER INFO */}
            <section className="flex flex-col lg:flex-row gap-6 lg:gap-12 mt-8">
              <div className="w-full lg:w-4/5">
                {/* MAIN WEATHER CARD */}
                <MainWeatherCard
                  searchedLocation={searchedLocation}
                  weatherData={weatherData}
                />
                {/* SECONDARY WEATHER INFO */}
                <WeatherInfoGrid weatherData={weatherData} />

                {/* DAILY FORECAST */}
                <DailyForecast dailyWeather={dailyWeather} />
              </div>

              {/* HOURLY FORECAST */}
              <div className="my-8 lg:my-0 bg-neutral-800 px-5 py-8 rounded-2xl border border-neutral-600 flex flex-col justify-center lg:justify-start gap-5 lg:gap-3 w-full lg:w-1/5 min-w-55 lg:max-h-150 overflow-y-auto">
                <h2 className="font-semibold text-2xl">Hourly forecast</h2>

                {hourlyWeather &&
                  hourlyWeather.map((hour, index) => (
                    <HourlyWeather
                      key={index}
                      weather_code={hour.weather_code}
                      temperature={hour.temperature_2m}
                      temperature_unit={hour.temperature_2m_unit}
                      time={hour.time}
                    />
                  ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
