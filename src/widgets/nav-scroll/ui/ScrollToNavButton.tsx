type Props = {
    navId: string,
    isVisible: boolean,
}

export function ScrollToNavButton({navId, isVisible}: Props) {
    const onClick = () => {
        requestAnimationFrame(() => {
            const el = document.getElementById(navId);
            if (!el) return;
            el.scrollIntoView({behavior: "smooth", block: "start"});
        })
    }

    return (
        <button
            onClick={onClick}
            className={`fixed z-10 bottom-3 right-3 sm:bottom-8 sm:right-8 size-12 sm:size-14  rounded-full flex justify-center items-center bg-gold hover:bg-cloud cursor-pointer}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transition: "0.3s ease-out",
                boxShadow: "0 0 8px black",
            }}
        >
            <div className="relative size-full">
                <div className="absolute left-1/2 top-1/2 size-8 sm:size-10  rounded-full -translate-1/2 border-2 border-graphite ">
                    <span className="absolute left-1/2 top-1/2 size-3 sm:size-4  bg-graphite rounded-full -translate-1/2"/>
                    <span className="absolute left-0 top-1/2 size-2 sm:size-[10px]  bg-graphite rounded-full -translate-1/2"/>
                    <span className="absolute left-full top-1/2 size-[10px] bg-graphite rounded-full -translate-1/2"/>
                </div>
            </div>


        </button>
    )
}