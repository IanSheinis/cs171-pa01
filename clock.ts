import { utcTimeFnNumber } from "./config";

export class Clock {
    private lastSynchronizationTime: number;  // Rbase 
    private localTime: number;                 // Lbase 
    private rho: number;

    constructor(rho: number) {
        const now = utcTimeFnNumber();
        this.lastSynchronizationTime = now;  
        this.localTime = now;                 
        this.rho = rho;
    } 

    public getTime() {
        const currentTime = utcTimeFnNumber();  // R(t)
        const elapsed = currentTime - this.lastSynchronizationTime;  // R(t) - Rbase
        return this.localTime + elapsed * (1 + this.rho);  // Lbase + elapsed × (1 + ρ), from lecture
    }

    public setTime(newLocalTime: number) {
        this.localTime = newLocalTime;             
        this.lastSynchronizationTime = utcTimeFnNumber(); 
    }
}