import Image from "next/image";
import Header from "@/widgets/header";
import Background from "@/shared/ui/background";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans dark:bg-black">
      <main className='text-white'>
          <Background img={"/backgrounds/background1.jpg"} />
          <Header />
      </main>
    </div>
  );
}
