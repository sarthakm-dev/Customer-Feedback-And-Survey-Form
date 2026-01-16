// Rating/Star logic utilities
import { RatingMap } from "../types/ratings";
export function setupStarRatings(ratings:RatingMap):void {
    const ratingGroups = document.querySelectorAll<HTMLElement>(".rating-group");
    
    ratingGroups.forEach(group => {
        const category = group.dataset.category;
        if(!category){
            return;
        }
        const stars = group.querySelectorAll<HTMLElement>('.star');
        ratings[category] = 0;

        function paint(value:number) {
            stars.forEach(star => {
                star.classList.toggle("active", Number(star.dataset.value) <= value);
            });
        }

        stars.forEach(star => {
            const value = Number(star.dataset.value);
            
            star.addEventListener("click", () => {
                ratings[category] = value;
                paint(value);
                group.classList.remove("invalid");
            });
            
            star.addEventListener("mouseenter", () => {
                paint(value);
            });
        });

        group.addEventListener("mouseleave", () => {
            paint(ratings[category]);
        });
    });
}

export function setupBasicStarRatings(ratings:RatingMap):void {
    const ratingGroups = document.querySelectorAll<HTMLElement>(".rating-group");
    
    ratingGroups.forEach(group => {
        const category = group.dataset.category;
        if(!category){
            return;
        }
        const stars = group.querySelectorAll<HTMLElement>(".star");
        ratings[category] = 0;
        
        stars.forEach(star => {
            star.addEventListener("click", () => {
                ratings[category] = Number(star.dataset.value);
                stars.forEach(b =>{
                    const currValue = Number(b.dataset.value);
                    const starValue = Number(star.dataset.value);
                    b.classList.toggle("active", currValue <= starValue);
                })
                group.classList.remove("invalid");
            });
        });
    });
}

export function restoreRatings(ratings:RatingMap):void {
    document.querySelectorAll<HTMLElement>(".star").forEach(star => star.classList.remove("active"));
    Object.keys(ratings).forEach(k => ratings[k] = 0);
    
    Object.entries(ratings).forEach(([category, value]) => {
        ratings[category] = value;
        const group = document.querySelector<HTMLElement>(`.rating-group[data-category="${category}"]`);
        if (!group) return;
        
        group.querySelectorAll<HTMLElement>(".star").forEach(star => {
            star.classList.toggle("active", Number(star.dataset.value) <= value);
        });
    });
}

export function initializeRatings():RatingMap {
    const ratings:RatingMap = {};
    const ratingGroups = document.querySelectorAll<HTMLElement>(".rating-group");
    
    ratingGroups.forEach(group => {
        const category = group.dataset.category;
        if(!category) return;
        ratings[category] = 0;
    });
    
    return ratings;
}


export function clearStarRatings() {
    document.querySelectorAll(".star").forEach(s => s.classList.remove("active"));
}
