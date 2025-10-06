import { utcTimeFnNumber } from "./config";

export class Clock {
    private lastSynchronizationTime: number;
    private localTime: number;
    private rho:number;

    constructor(rho: number) {
        this.lastSynchronizationTime = utcTimeFnNumber();
        this.localTime = utcTimeFnNumber();
        this.rho = rho;
    } 

    public getTime() {
        const currentTime = utcTimeFnNumber();
        const delta = (currentTime - this.lastSynchronizationTime) * ( 1 + this.rho);
        return currentTime + delta;
    }

    public setTime(timeServerTime: number) {
        this.lastSynchronizationTime = timeServerTime;
        return this.lastSynchronizationTime;
    }
}