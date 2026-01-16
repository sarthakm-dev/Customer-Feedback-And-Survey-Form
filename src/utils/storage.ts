// Local storage management

import { RecordData } from "../types/record";

const STORAGE_KEY:string = "customer-feedback-records";


export function getRecords():RecordData[] {
    const store = localStorage.getItem(STORAGE_KEY);
    if(!store) return [];
    return JSON.parse(store) as RecordData[] || [];
}

export function saveRecords(records:RecordData[]):void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}


export function saveToLocalStorage(records:RecordData[]):void {
    saveRecords(records);
}
