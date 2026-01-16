// Conditional field logic

import { RatingMap } from "../types/ratings";

export function setupConditionalFields(ratings:RatingMap):void {
    const supportRadios = document.querySelectorAll<HTMLInputElement>('input[name="support-contacted"]');
    
    supportRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            const contacted = document.querySelector<HTMLInputElement>('input[name="support-contacted"]:checked')?.value;
            
            document.querySelectorAll<HTMLElement>("[data-conditional='support-yes']").forEach(group => {
                if (contacted === "yes") {
                    group.classList.remove("disabled");
                } else {
                    group.classList.add("disabled");
                    const category = group.dataset.category;
                    if(!category) return;
                    ratings[category] = 0;
                    group.classList.remove("invalid");
                    
                    const stars = group.querySelectorAll<HTMLElement>(".star");
                    stars.forEach(b => b.classList.remove("active"));
                }
            });
        });
    });
}


export function getSupportContactedStatus() {
    const checked = document.querySelector<HTMLInputElement>('input[name="support-contacted"]:checked');
    return checked ? (checked.value as "yes" | "no"): null;
}
