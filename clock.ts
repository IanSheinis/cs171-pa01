import { utcTimeFnNumber } from "./config";

export class Clock {
    private lastSynchronizationTime: number;  // Rbase - real time of last sync
    private localTime: number;                 // Lbase - local time at last sync
    private rho: number;

    constructor(rho: number) {
        const now = utcTimeFnNumber();
        this.lastSynchronizationTime = now;  // Rbase
        this.localTime = now;                 // Lbase (starts synchronized)
        this.rho = rho;
    } 

    public getTime() {
        const currentTime = utcTimeFnNumber();  // R(t)
        const elapsed = currentTime - this.lastSynchronizationTime;  // R(t) - Rbase
        return this.localTime + elapsed * (1 + this.rho);  // ✅ Lbase + elapsed × (1 + ρ)
    }

    public setTime(newLocalTime: number) {
        this.localTime = newLocalTime;              // ✅ Set Lbase
        this.lastSynchronizationTime = utcTimeFnNumber();  // ✅ Set Rbase to NOW
    }
}