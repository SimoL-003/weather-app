import SecondaryWeatherInfo from "../atoms/SecondaryWeatherInfo";

export default function WeatherInfoGrid({ weatherData }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 my-9 gap-4 lg:gap-6">
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
  );
}
