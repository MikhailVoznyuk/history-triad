"use client"

import Image from "next/image";

import {forwardRef, Dispatch, SetStateAction, RefObject} from "react";
import type {NavItemData} from "@/widgets/header/model/types";


type NavItemProps = {
    item: NavItemData;
    onSelect?: () => void;
}

const NavItem = forwardRef<HTMLDivElement, NavItemProps>((props: NavItemProps, ref) => {
    return (
        <div ref={ref} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 " onClick={props.onSelect}>
            <div className="relative size-[50px] sm:size-[80px]  origin-center overflow-hidden rounded-[50%] border-2 border-cloud">
                <Image className="absolute top-0 left-0" width={80} height={80} src={props.item.img} alt="Person profile" />
            </div>
        </div>
    )
})

NavItem.displayName = "NavItem";

export default NavItem;