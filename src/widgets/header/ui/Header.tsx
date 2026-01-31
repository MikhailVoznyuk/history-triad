import dynamic from "next/dynamic";
const Navigation = dynamic(() => import("./Navigation"), { ssr: false });

export default function Header() {
    return (
        <div className="flex w-screen h-screen items-center justify-center">
            <Navigation />
        </div>
    )
}