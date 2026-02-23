export default function SecondaryWeatherInfo({ title, data, temperature }) {
  return (
    <div className="bg-neutral-800 px-4 py-8 lg:px-2 lg:py-6 rounded-2xl border border-neutral-600 flex flex-col justify-center gap-3 lg:gap-2 items-start">
      <h4 className="font-bricolage text-neutral-200 text-xl lg:text-lg">
        {title}
      </h4>
      <p className="font-light text-3xl lg:text-2xl">
        {data} {temperature}
      </p>
    </div>
  );
}
