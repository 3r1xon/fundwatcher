import { movements } from "./movements.interface";

export interface months {
    month: string,
    movements: Array<movements>
}

export interface years {
    year: number,
    months: Array<months>
}