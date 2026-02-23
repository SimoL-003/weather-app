export default function Header() {
  return (
    <header className="bg-neutral-900 flex items-center md:pt-10">
      <div className="container">
        {/* LOGO */}
        <img src="/logo.svg" alt="Logo" className="w-[45%] max-w-56" />
      </div>
    </header>
  );
}
