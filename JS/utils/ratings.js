// Rating/Star logic utilities

export function setupStarRatings(ratings) {
    const ratingGroups = document.querySelectorAll(".rating-group");
    
    ratingGroups.forEach(group => {
        const category = group.dataset.category;
        const stars = group.querySelectorAll('.star');
        ratings[category] = 0;

        function paint(value) {
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

export function setupBasicStarRatings(ratings) {
    const ratingGroups = document.querySelectorAll(".rating-group");
    
    ratingGroups.forEach(group => {
        const category = group.dataset.category;
        const stars = group.querySelectorAll(".star");
        ratings[category] = 0;
        
        stars.forEach(star => {
            star.addEventListener("click", () => {
                ratings[category] = Number(star.dataset.value);
                stars.forEach(b => b.classList.toggle("active", b.dataset.value <= star.dataset.value));
                group.classList.remove("invalid");
            });
        });
    });
}

export function restoreRatings(ratings) {
    document.querySelectorAll(".star").forEach(star => star.classList.remove("active"));
    Object.keys(ratings).forEach(k => ratings[k] = 0);
    
    Object.entries(ratings).forEach(([category, value]) => {
        ratings[category] = value;
        const group = document.querySelector(`.rating-group[data-category="${category}"]`);
        if (!group) return;
        
        group.querySelectorAll(".star").forEach(star => {
            star.classList.toggle("active", Number(star.dataset.value) <= value);
        });
    });
}

export function initializeRatings() {
    const ratings = {};
    const ratingGroups = document.querySelectorAll(".rating-group");
    
    ratingGroups.forEach(group => {
        const category = group.dataset.category;
        ratings[category] = 0;
    });
    
    return ratings;
}


export function clearStarRatings() {
    document.querySelectorAll(".star").forEach(s => s.classList.remove("active"));
}
