import { weatherCodeToIcon } from "../../functions/helper";

export default function DailyWeatherCard({
  weatherCode,
  day,
  minTemp,
  maxTemp,
}) {
  return (
    <div className="bg-neutral-800 px-4 py-6 lg:px-4 lg:py-6 rounded-2xl border border-neutral-600 flex flex-col justify-center gap-2 lg:gap-1 items-center min-w-20">
      <p className="text-center text-lg lg:text-base font-semibold">
        {new Date(day).toLocaleDateString("en-US", {
          weekday: "short",
        })}
      </p>
      <img
        src={weatherCodeToIcon(weatherCode)}
        alt="Weather icon"
        className="w-10 lg:w-10"
      />
      <p className="flex justify-between text-lg lg:text-base w-full">
        <span>{Math.floor(minTemp)}°</span>
        <span>{Math.floor(maxTemp)}°</span>
      </p>
    </div>
  );
}
