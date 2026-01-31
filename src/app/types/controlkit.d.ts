declare module '@brunoimbrizi/controlkit' {
    export default class ControlKit {
        constructor(...args: any[]);
        addPanel?: (...args: any[]) => any;
    }
}