export default function Page() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white group overflow-hidden transition-colors duration-500 hover:bg-black">
      <img
        src="/ZeroNine-logoonly.svg"
        alt="Zero9 Logo"
        className="w-44 h-44 animate-spin-slow grayscale group-hover:grayscale-0 group-hover:invert transition-all duration-700 ease-in-out"
      />
    </div>
  );
}
