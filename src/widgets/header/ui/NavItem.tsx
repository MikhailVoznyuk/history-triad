import Image from "next/image";

import {forwardRef, Dispatch, SetStateAction, RefObject} from "react";
import type {NavItemData} from "@/widgets/header/model/types";


type NavItemProps = {
    item: NavItemData;
    onSelect?: () => void;
}

const NavItem = forwardRef<HTMLDivElement, NavItemProps>((props: NavItemProps, ref) => {
    return (
        <div ref={ref} className="absolute" onClick={props.onSelect}>
            <div className="relative w-[80px] h-[80px] top-[-40px] left-[-40px] overflow-hidden rounded-[50%] border-2 border-cloud">
                <Image className="absolute top-0 left-0" width={80} height={80} src={props.item.img} alt="Person profile" />
            </div>
        </div>
    )
})

NavItem.displayName = "NavItem";

export default NavItem;