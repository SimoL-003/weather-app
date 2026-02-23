function getHourlyWeather(hourlyData) {
  // Get the current hour
  const currentHour = new Date().getHours();

  // Find the index of the current hour in the hourly data
  const currentHourIndex = hourlyData.time.findIndex((time) => {
    const date = new Date(time);
    return date.getHours() === currentHour;
  });

  // If the current hour is not found, return null
  if (currentHourIndex === -1) {
    return null;
  }

  // Return the weather data for the next 24 hours starting from the current hour

  let hourlyWeather = [];
  for (let i = currentHourIndex; i < currentHourIndex + 24; i++) {
    hourlyWeather.push({
      time: hourlyData.time[i],
      temperature_2m: hourlyData.temperature_2m[i],
      weather_code: hourlyData.weather_code[i],
    });
  }

  return hourlyWeather;
}

export default getHourlyWeather;
