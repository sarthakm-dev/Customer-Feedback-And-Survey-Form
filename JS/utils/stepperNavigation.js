// stepperNavigation.js

import { validateCurrentStep, validateRadios } from "./formValidation.js";
import * as conditional from "./conditional.js";
import { validatePurchasedate } from "./validation.js";
let sections = [];
let steps = [];
let nextBtn = null;
let prevBtn = null;
let submitBtn = null;
const REQUIRED_RADIOS = ["method","package-content-experience","support-contacted","recommendation-experience"];
const STEP_RADIOS = {
    0: ["method"],
    2: ["package-content-experience"],
    3: ["support-contacted","recommendation-experience"]
};
export function initializeStepper(state, ratings) {
    sections = document.querySelectorAll(".rating-section");
    steps = document.querySelectorAll(".step");

    nextBtn = document.getElementById("nextBtn");
    prevBtn = document.getElementById("prevBtn");
    submitBtn = document.getElementById("submit");
    
    if (!nextBtn || !prevBtn) {
        console.error("Stepper buttons not found");
        return;
    }

    updateStepUI(state);

    nextBtn.addEventListener("click", () => {
        const supportContacted = conditional.getSupportContactedStatus();

        if(state.currentStep===0){
            
        }
        const radiosToValidate = STEP_RADIOS[state.currentStep] || [];
        const radiosValid = validateRadios(radiosToValidate);
        if(!radiosValid){
            document.querySelector(".radio-container.invalid")?.scrollIntoView({behavior:"smooth",block:"center"});
            return;
        }
        const isValid = validateCurrentStep(
            state.currentStep,
            ratings,
            supportContacted
        );

        if (!isValid) {
            document
                .querySelector(".invalid")
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        if (state.currentStep < sections.length - 1) {
            state.currentStep++;
            updateStepUI(state);
        }
    });

    prevBtn.addEventListener("click", () => {
        if (state.currentStep > 0) {
            state.currentStep--;
            updateStepUI(state);
        }
    });
}


function updateStepUI(state) {
    sections.forEach((section, index) => {
        section.classList.toggle("active", index === state.currentStep);
    });

    steps.forEach((step, index) => {
        step.classList.toggle("active", index === state.currentStep);
    });


    prevBtn.disabled = state.currentStep === 0;

    if (state.currentStep === sections.length - 1) {
        nextBtn.style.display = "none";
        if (submitBtn) submitBtn.style.display = "inline-block";
    } else {
        nextBtn.style.display = "inline-block";
        if (submitBtn) submitBtn.style.display = "none";
    }
}


export function getCurrentStep(state) {
    return state.currentStep;
}

export function setCurrentStep(state, step) {
    state.currentStep = step;
    updateStepUI(state);
}