import { years } from "./years.interface";

export interface appJson {
    name: string,
    salary: number,
    maxOutGo: number,
    payday: number,
    years: Array<years>
}