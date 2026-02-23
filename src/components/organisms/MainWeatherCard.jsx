import bgSmall from "../../assets/images/bg-today-small.svg";
import { weatherCodeToIcon } from "../../functions/helper";

export default function MainWeatherCard({ searchedLocation, weatherData }) {
  return (
    <div
      className="main-weather-bg text-center pt-11 pb-14 bg-no-repeat my-8 bg-cover rounded-3xl px-2 lg:flex lg:items-center lg:justify-between lg:gap-16 lg:px-10 lg:mt-0"
      style={{ backgroundImage: `url(${bgSmall})` }}
    >
      {/* LOCATION and DATE */}
      <div className="lg:flex lg:flex-col lg:items-start lg:justify-center text-center lg:text-left lg:gap-3">
        {/* Location */}
        <h2 className="text-2xl font-semibold mb-4 lg:mb-0">
          {searchedLocation
            ? `${searchedLocation.name}${searchedLocation.postcodes ? `, ${searchedLocation.postcodes[0]}` : ""}, ${searchedLocation.country}`
            : "Milan, Italy"}
        </h2>
        {/* Date */}
        <p className="text-lg text-neutral-200 mb-9 lg:mb-0">
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
      </div>

      {/* ICON and TEMPERATURE */}
      <div className="flex justify-center items-center gap-8 lg:gap-10 mt-8 lg:mt-0">
        {/* Icon */}
        <img
          src={weatherCodeToIcon(weatherData.current.weather_code)}
          alt={weatherCodeToIcon(weatherData.current.weather_code)}
          className="w-24"
        />
        {/* Temperature */}
        <p className="italic font-bold text-7xl">
          {Math.floor(weatherData.current.temperature_2m)}
          {weatherData.current_units.temperature_2m}
        </p>
      </div>
    </div>
  );
}
