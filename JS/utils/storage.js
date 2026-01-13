// Local storage management

const STORAGE_KEY = "customer-feedback-records";


export function getRecords() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}


export function saveToLocalStorage(records) {
    saveRecords(records);
}
