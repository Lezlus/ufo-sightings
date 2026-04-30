import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href='/map'>
        View The Map
      </Link>
    </main>
  );
}
