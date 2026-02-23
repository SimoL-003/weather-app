import { weatherCodeToIcon } from "../../functions/helper";

export default function HourlyWeather({
  weather_code,
  temperature,
  time,
  temperature_unit,
}) {
  return (
    <div className="flex justify-between items-center bg-neutral-700 border border-neutral-600 pr-3 rounded-2xl my-2 lg:my-0 lg:py-3">
      <p className="font-medium text-2xl lg:text-lg flex items-center gap-2">
        <span>
          {/* Icon */}
          <img
            src={weatherCodeToIcon(weather_code)}
            alt="Weather icon"
            className="w-12 lg:w-10"
          />
        </span>
        {/* Time */}
        {new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          hour12: false,
        })}
      </p>
      {/* Temperature */}
      <p className="text-xl lg:text-base">
        {temperature} {temperature_unit}
      </p>
    </div>
  );
}
