import DailyWeatherCard from "../molecules/DailyWeatherCard";

export default function DailyForecast({ dailyWeather }) {
  return (
    <div>
      <h2 className="font-semibold text-2xl">Daily forecast</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-4 lg:gap-4 py-4">
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
  );
}
