import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white flex items-center px-4 shadow-md border-b border-slate-200">
      <Link href="/" className="flex items-center no-underline">
        <Image src="/logo.png" alt="QuickChart" height={44} width={220} priority className="py-3" />
      </Link>
    </header>
  );
}
