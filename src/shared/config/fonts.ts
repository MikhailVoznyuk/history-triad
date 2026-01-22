import {Cormorant_SC} from "next/font/google";

export const cormorant = Cormorant_SC(
    {
        subsets: ["latin", "cyrillic"],
        weight: ["300", "400", "500", "600", "700"],
        variable: "--font-cormorant",
        display: "swap",
    }
);