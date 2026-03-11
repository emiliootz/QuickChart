import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-blue-800 text-white h-14 flex items-center px-4 shadow-md">
      <Link href="/" className="flex items-center gap-2 no-underline">
        <span className="text-red-400 text-2xl font-bold leading-none">+</span>
        <span className="font-bold text-lg tracking-tight">QuickChart</span>
        <span className="text-blue-300 text-sm hidden sm:inline">EMS PCR Generator</span>
      </Link>
    </header>
  );
}
