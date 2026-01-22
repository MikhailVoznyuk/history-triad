import {createScope, createTimeline, utils} from "animejs";

export type Scope = ReturnType<typeof createScope>;
export type TL = ReturnType<typeof createTimeline>;


export const makeScope = createScope;
export const makeTimeline = createTimeline;
export const animeUtils = utils;



