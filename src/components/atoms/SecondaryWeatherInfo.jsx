export default function SecondaryWeatherInfo({ title, data, temperature }) {
  return (
    <div className="bg-neutral-800 px-5 py-8 rounded-2xl border border-neutral-600 flex flex-col justify-center gap-5">
      <h4 className="font-bricolage text-neutral-200 text-2xl">{title}</h4>
      <p className="font-light text-4xl">
        {data}
        {temperature}
      </p>
    </div>
  );
}
