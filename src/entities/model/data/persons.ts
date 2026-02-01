import {ELISEEV_CONTENT} from "@/entities/model/data/eliseev";
import {MARTYANOV_CONTENT} from "@/entities/model/data/martyanov";
import {LAGIDZE_CONTENT} from "@/entities/model/data/lagidze";

import type {PersonContent} from "@/entities/model/types";

const persons = {
    [ELISEEV_CONTENT.id]: ELISEEV_CONTENT,
    [MARTYANOV_CONTENT.id] : MARTYANOV_CONTENT,
    [LAGIDZE_CONTENT.id] : LAGIDZE_CONTENT,
} as const satisfies  Record<string, PersonContent>

export {persons};