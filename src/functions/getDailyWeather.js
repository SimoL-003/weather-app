export default function getDailyWeather(dailyData, dailyUnits) {
  // Get the current date
  const currentDate = new Date().toISOString().split("T")[0];

  // Find the index of the current date in the daily data
  const currentDateIndex = dailyData.time.findIndex(
    (time) => time === currentDate,
  );

  // If the current date is not found, return null
  if (currentDateIndex === -1) {
    return null;
  }

  // Return the weather data for the next 7 days starting from today
  let dailyWeather = [];
  for (let i = currentDateIndex; i < currentDateIndex + 7; i++) {
    dailyWeather.push({
      time: dailyData.time[i],
      temperature_2m_min: dailyData.temperature_2m_min[i],
      temperature_2m_max: dailyData.temperature_2m_max[i],
      temperature_2m_unit: dailyUnits.temperature_2m,
      weather_code: dailyData.weather_code[i],
    });
  }

  return dailyWeather;
}
