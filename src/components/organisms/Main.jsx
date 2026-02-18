import { useEffect, useState, useRef } from "react";
import bgSmall from "../../assets/images/bg-today-small.svg";
import axios from "axios";

export default function Main() {
  const [search, setSearch] = useState("");
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
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
      alert("Please select a valid location from the suggestions.");
    }
  }

  //   FETCH WEATHER DATA FOR SELECTED LOCATION (default to Milan if no location selected)
  useEffect(() => {
    axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${searchedLocation?.latitude || 45.46}&longitude=${searchedLocation?.longitude || 9.18}&daily=temperature_2m_min,temperature_2m_max,weather_code&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code`,
      )
      .then((res) => setWeatherData(res.data));
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

  return (
    <main className="bg-bg min-h-screen text-neutral-0 font-dm-sans">
      <div className="container">
        {/* HERO */}
        <h1 className="text-6xl font-semibold text-center leading-17.5 py-11.25 font-bricolage">
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
          <div
            className="text-center pt-11 pb-14 bg-no-repeat my-8 bg-cover rounded-3xl"
            style={{ backgroundImage: `url(${bgSmall})` }}
          >
            <h2 className="text-2xl font-semibold mb-4">
              {searchedLocation
                ? `${searchedLocation.name}, ${searchedLocation.postcodes ? searchedLocation.postcodes[0] : ""}, ${searchedLocation.country}`
                : "Milan, Italy"}
            </h2>
            <p className="text-lg text-neutral-200 mb-9">
              {weatherData.current.time.toLocaleString()}
            </p>
            <p className="italic font-bold text-7xl">
              {weatherData.current.temperature_2m}
              {weatherData.current_units.temperature_2m}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
