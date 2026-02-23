import { weatherCodeToIcon } from "../../functions/helper";

export default function DailyWeatherCard({
  weatherCode,
  day,
  minTemp,
  maxTemp,
  tempUnit,
}) {
  return (
    <div className="bg-neutral-800 px-5 py-8 rounded-2xl border border-neutral-600 flex flex-col justify-center gap-2">
      <p className="text-center text-xl font-semibold">
        {new Date(day).toLocaleDateString("en-US", {
          weekday: "short",
        })}
      </p>
      <img src={weatherCodeToIcon(weatherCode)} alt="Weather icon" />
      <p className="flex justify-between text-xl">
        <span>
          {Math.floor(minTemp)}
          {tempUnit}
        </span>
        <span>
          {Math.floor(maxTemp)}
          {tempUnit}
        </span>
      </p>
    </div>
  );
}
