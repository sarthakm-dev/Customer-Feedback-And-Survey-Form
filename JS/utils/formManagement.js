// Form population and reset logic
import * as ratings from './ratings.js';

export function restoreRadio(name, value) {
    if (!value) return;
    document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
        radio.checked = radio.value === value;
    });
}

export function populateForm(data, ratings, form) {
    form["product-name"].value = data.orderNumber;
    form.email.value = data.email;
    form["purchase-date"].value = data.purchaseDate;
    
    restoreRadio("method", data.shoppingMethod);
    restoreRadio("package-content-experience", data.packageContentMatch);
    restoreRadio("support-contacted", data.supportContacted);
    restoreRadio("recommendation-experience", data.recommendToFriends);
    restoreRadio("review", data.participateInMonthlyReview);
    
    form["what-did-you-like"].value = data.whatDidYouLike || "";
    form["what-to-improve"].value = data.whatToImprove || "";
    form["additional-comments"].value = data.additionalComments || "";
    form.review.checked = data.participateInMonthlyReview ==="yes";
    document.querySelectorAll(".star").forEach(star => star.classList.remove("active"));
    Object.keys(ratings).forEach(k => ratings[k] = 0);
    
    Object.entries(data.ratings).forEach(([category, value]) => {
        ratings[category] = value;
        const group = document.querySelector(`.rating-group[data-category="${category}"]`);
        if (!group) return;
        
        group.querySelectorAll(".star").forEach(star => {
            star.classList.toggle("active", Number(star.dataset.value) <= value);
        });
    });
}

export function resetForm(form, ratingData) {
    form.reset();
    Object.keys(ratingData).forEach(k => (ratingData[k] = 0));
    ratings.clearStarRatings();
}

export function goToFirstRatedSection(data) {
    const sections = [
        ["product-quality", "matches-description", "durability", "value-for-money"],
        ["websites-ease-of-use", "product-search", "checkout-process", "payment-options"],
        ["delivery-experience", "delivery-speed", "packaging-quality"],
        ["support-responsiveness", "support-helpfulness"]
    ];

    let currentStep = 0;
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].some(cat => data.ratings[cat] > 0)) {
            currentStep = i;
            break;
        }
    }
    
    return currentStep;
}
