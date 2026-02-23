import { useEffect, useState, useRef } from "react";
import bgSmall from "../../assets/images/bg-today-small.svg";
import axios from "axios";
import { weatherCodeToIcon } from "../../functions/helper";
import SecondaryWeatherInfo from "../atoms/SecondaryWeatherInfo";
import getHourlyWeather from "../../functions/getHourlyWeather";
import HourlyWeather from "../atoms/HourlyWeather";
import getDailyWeather from "../../functions/getDailyWeather";
import DailyWeatherCard from "../atoms/DailyWeatherCard";

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
        `https://api.open-meteo.com/v1/forecast?latitude=${searchedLocation?.latitude || 45.46}&longitude=${searchedLocation?.longitude || 9.18}&daily=temperature_2m_min,temperature_2m_max,weather_code&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code`,
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
    <main className="bg-neutral-900 min-h-screen text-neutral-0 font-dm-sans">
      <div className="container">
        {/* HERO */}
        <h1 className="text-6xl font-semibold text-center leading-17.5 py-11.25 font-bricolage px-4">
          How's the sky looking today?
        </h1>

        {/* SEARCH FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
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
            className="bg-neutral-600 py-4 px-5 tracking-wider text-lg rounded-2xl placeholder:text-neutral-200"
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
          <button className="bg-blue-500 py-4 font-semibold tracking-wide text-lg  rounded-2xl">
            Search
          </button>
        </form>

        {/* TODAY */}
        {weatherData && (
          <>
            {/* MAIN WEATHER CARD */}
            <div
              className="text-center pt-11 pb-14 bg-no-repeat my-8 bg-cover rounded-3xl px-2"
              style={{ backgroundImage: `url(${bgSmall})` }}
            >
              {/* Location */}
              <h2 className="text-2xl font-semibold mb-4">
                {searchedLocation
                  ? `${searchedLocation.name}${searchedLocation.postcodes ? `, ${searchedLocation.postcodes[0]}` : ""}, ${searchedLocation.country}`
                  : "Milan, Italy"}
              </h2>

              {/* Date */}
              <p className="text-lg text-neutral-200 mb-9">
                {(() => {
                  const dateStr = weatherData.current.time;
                  const date = new Date(dateStr);
                  return date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                })()}
              </p>

              {/* Icon and temperature */}
              <div className="flex justify-center items-center gap-8">
                <img
                  src={weatherCodeToIcon(weatherData.current.weather_code)}
                  alt={weatherCodeToIcon(weatherData.current.weather_code)}
                  className="w-24"
                />
                <p className="italic font-bold text-7xl">
                  {weatherData.current.temperature_2m}
                  {weatherData.current_units.temperature_2m}
                </p>
              </div>
            </div>

            {/* SECONDARY WEATHER INFO */}
            <div className="grid grid-cols-2 my-9 gap-4">
              {/* Apparent temperature */}
              <SecondaryWeatherInfo
                title={"Feels Like"}
                data={weatherData.current.apparent_temperature}
                temperature={weatherData.current_units.apparent_temperature}
              />
              {/* Relative humidity */}
              <SecondaryWeatherInfo
                title={"Humidity"}
                data={weatherData.current.relative_humidity_2m}
                temperature={weatherData.current_units.relative_humidity_2m}
              />
              {/* Wind speed */}
              <SecondaryWeatherInfo
                title={"Wind Speed"}
                data={weatherData.current.wind_speed_10m}
                temperature={weatherData.current_units.wind_speed_10m}
              />
              {/* Precipitation */}
              <SecondaryWeatherInfo
                title={"Precipitation"}
                data={weatherData.current.precipitation}
                temperature={weatherData.current_units.precipitation}
              />
            </div>

            {/* HOURLY FORECAST */}
            <div className="my-8 bg-neutral-800 px-5 py-8 rounded-2xl border border-neutral-600 flex flex-col justify-center gap-5">
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
          </>
        )}

        {/* DAILY FORECAST */}
        {weatherData && (
          <>
            <div>
              <h2 className="font-semibold text-2xl">Daily forecast</h2>
              <div className="grid grid-cols-3 gap-4 py-4">
                {dailyWeather &&
                  dailyWeather.map((day, index) => (
                    <DailyWeatherCard
                      key={index}
                      weatherCode={day.weather_code}
                      day={day.time}
                      minTemp={day.temperature_2m_min}
                      maxTemp={day.temperature_2m_max}
                      tempUnit={day.temperature_2m_unit}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
