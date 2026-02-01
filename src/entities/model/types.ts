export type ContentSection = { t: "text"; id: string; title: string; text: string }
                    | { t: "textImage"; id: string; title?: string; blocks: { id: string; title?: string; text: string; imgSrc: string; imgEffect?: "sepia" | "invert" }[] }
                    | { t: "timeline"; id: string; title?: string; items: { id: string; year: string; title: string; text: string }[] }
                    | { t: "gallery"; id: string; title?: string; items: { id: string; src: string; caption?: string }[] };

export type PersonContent = {
    id: string;
    sections: ContentSection[];
}
