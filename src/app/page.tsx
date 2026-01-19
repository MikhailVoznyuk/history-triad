import Image from "next/image";
import Header from "@/widgets/header";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans dark:bg-black">
      <main className='text-white'>
        <Header />
      </main>
    </div>
  );
}
