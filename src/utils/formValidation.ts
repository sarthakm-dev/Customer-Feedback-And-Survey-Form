// Form submission and validation logic
import { RatingMap } from '../types/ratings';
import * as validation from './validation.js';

export function validateRadios(requiredRadios:string[]):boolean {
    let valid = true;

    requiredRadios.forEach(name => {
        const checked = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
        const container = document.querySelector<HTMLElement>(`[data-radio="${name}"]`);

        if (!checked) {
            container?.classList.add("invalid");
            valid = false;
        } else {
            container?.classList.remove("invalid");
        }
    });

    return valid;
}

export function validateCurrentStep(currentStep:number, ratings:RatingMap, supportContacted:string) {
    let valid = true;
    if(currentStep===0){
        const orderInput = document.querySelector<HTMLInputElement>(`input[name="product-name"]`);
        
        if(!orderInput) return;
        if(!orderInput.value.trim()){
            orderInput.classList.add("invalid");
            (orderInput.nextElementSibling as HTMLElement).style.visibility = "visible";
            valid = false;
        }
        const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
        if(!emailInput) return;
        if(!emailInput.value.trim()){
            emailInput.classList.add("invalid");
            (emailInput.nextElementSibling as HTMLElement).style.visibility = "visible";
            valid = false;
        }
        const dateInput = document.querySelector<HTMLInputElement>(`input[name="purchase-date"]`);
        if(!dateInput) return;
        if(!dateInput.value){
            dateInput.classList.add("invalid");
            (dateInput.nextElementSibling as HTMLElement).style.visibility = "visible";
            valid = false;
        }
    }
    const stepConfig = [
        {
            ratings: [
                "product-quality",
                "matches-description",
                "durability",
                "value-for-money"
            ]
        },
        {
            ratings: [
                "websites-ease-of-use",
                "product-search",
                "checkout-process",
                "payment-options"
            ]
        },
        {
            ratings: [
                "delivery-experience",
                "delivery-speed",
                "packaging-quality"
            ]
        },
        {
            ratings: [
                "support-responsiveness",
                "support-helpfulness"
            ],
            conditionalOn: "support-contacted"
        }
    ];

    
    const config = stepConfig[currentStep];

    // Check ratings in this step
    config.ratings.forEach(category => {
        const group = document.querySelector<HTMLElement>(
            `.rating-group[data-category="${category}"]`
        );

       
        if(!group) return;
        const isConditional = group.dataset.conditional === "support-yes";

        if (
            ratings[category] === 0 &&
            (!isConditional || supportContacted === "yes")
        ) {
            group.classList.add("invalid");
            valid = false;
        } else {
            group.classList.remove("invalid");
        }
    });

    return valid;
}

export function validateFormSubmission(form:HTMLFormElement, ratings:RatingMap, supportContacted:string) {
    let valid = true;
    const requiredRadios = ["method", "package-content-experience", "support-contacted", "recommendation-experience"];

    // Order Number Required Logic
    const order_input = document.querySelector<HTMLInputElement>(`input[name="product-name"]`);
    if(!order_input) return;
    if (!validation.formatRequired(order_input)) {
        valid = false;
    }

    // Email required Logic
    const email_input = document.querySelector<HTMLInputElement>('input[name="email"]');
    if(!email_input) return;
    if (!validation.validateRequired(email_input)) {
        email_input.classList.add("invalid");
        valid = false;
        (email_input.nextElementSibling as HTMLElement).style.visibility = "visible";
    } else {
        email_input.classList.remove("invalid");
        (email_input.nextElementSibling as HTMLElement).style.visibility = "hidden";
    }

    // Date Input Required logic
    const date_input = document.querySelector<HTMLInputElement>('input[name="purchase-date"]');
    if(!date_input) return;
    if (!date_input.value.trim()) {
        date_input.classList.add("invalid");
        valid = false;
        (date_input.nextElementSibling as HTMLElement).style.visibility = "visible";
    } else {
        date_input.classList.remove("invalid");
        (date_input.nextElementSibling as HTMLElement).style.visibility = "hidden";
    }

    // Radios required logic
    for (const name of requiredRadios) {
        const checked = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
        const content = document.querySelector<HTMLElement>(`[data-radio="${name}"]`);
        if(!content) return;
        if (!checked) {
            content.classList.add("invalid");
            valid = false;
        } else {
            content.classList.remove("invalid");
        }
    }

    // Conditional validation
    const ratingGroups = Array.from(document.querySelectorAll<HTMLElement>(".rating-group"));
    ratingGroups.forEach(group => {
        const category = group.dataset.category;
        if(!category) return;
        const isConditional = group.dataset.conditional === "support-yes";
        if (ratings[category] === 0 && (!isConditional || supportContacted === "yes")) {
            group.classList.add("invalid");
            valid = false;
        } else {
            group.classList.remove("invalid");
        }
    });

    return valid;
}

export function createFormData(form:HTMLFormElement, ratings:RatingMap) {
    const formData = new FormData(form);
    
    return {
        orderNumber: formData.get("product-name"),
        email: formData.get("email"),
        purchaseDate: formData.get("purchase-date"),
        shoppingMethod: formData.get("method"),
        packageContentMatch: formData.get("package-content-experience"),
        supportContacted: formData.get("support-contacted"),
        recommendToFriends: formData.get("recommendation-experience"),
        whatDidYouLike: formData.get("what-did-you-like"),
        whatToImprove: formData.get("what-to-improve"),
        additionalComments: formData.get("additional-comments"),
        participateInMonthlyReview: formData.get("review") === "yes" ? "yes" : "no",
        ratings: { ...ratings }
    };
}
