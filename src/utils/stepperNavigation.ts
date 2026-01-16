// stepperNavigation.js

import { validateCurrentStep, validateRadios } from "./formValidation.js";
import * as conditional from "./conditional.js";
import { validatePurchasedate, validateSelect } from "./validation.js";
import { stepperState } from "../types/stepper";
import { RatingMap } from "../types/ratings";

let sections: HTMLElement[] = [];
let steps: HTMLElement[] = [];
let nextBtn: HTMLButtonElement | null = null;
let prevBtn: HTMLButtonElement | null = null;
let submitBtn: HTMLButtonElement | null = null;
const REQUIRED_RADIOS = ["method", "package-content-experience", "support-contacted", "recommendation-experience"];

const STEP_RADIOS: Record<number, string[]> = {
    0: ["method"],
    2: ["package-content-experience"],
    3: ["support-contacted", "recommendation-experience"]
};

export function initializeStepper(state: stepperState, ratings: RatingMap):void {
    sections = Array.from(document.querySelectorAll<HTMLElement>(".rating-section"));
    steps = Array.from(document.querySelectorAll<HTMLElement>(".step"));

    nextBtn = document.getElementById("nextBtn") as HTMLButtonElement | null;
    prevBtn = document.getElementById("prevBtn") as HTMLButtonElement | null;
    submitBtn = document.getElementById("submit") as HTMLButtonElement | null;

    if (!nextBtn || !prevBtn) {
        console.error("Stepper buttons not found");
        return;
    }

    updateStepUI(state);

    nextBtn.addEventListener("click", () => {
        const supportContacted = conditional.getSupportContactedStatus() ?? "";
        let isFormValid = true;
        
        if(!validateSelect("item-select")){
            isFormValid = false;
        }
        if(state.currentStep === 3 && supportContacted === null){
            isFormValid = false;
        }

        const radiosToValidate = STEP_RADIOS[state.currentStep] || [];
        console.log(radiosToValidate);
        const radiosValid = validateRadios(radiosToValidate);
        if (!radiosValid) isFormValid = false;

        const stepValid = validateCurrentStep(
            state.currentStep,
            ratings,
            supportContacted
        );
        if (!stepValid) isFormValid = false;

        if (!isFormValid) {
            document.querySelector(".invalid")?.scrollIntoView({ behavior: "smooth", block: "center" });
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


function updateStepUI(state: stepperState):void {
    sections.forEach((section, index) => {
        section.classList.toggle("active", index === state.currentStep);
    });

    steps.forEach((step, index) => {
        step.classList.toggle("active", index === state.currentStep);
    });

    if (!prevBtn) return;
    prevBtn.disabled = state.currentStep === 0;

    if (state.currentStep === sections.length - 1) {
        if (!nextBtn) return;
        nextBtn.style.display = "none";
        if (submitBtn) submitBtn.style.display = "inline-block";
    } else {
        if (!nextBtn) return;
        nextBtn.style.display = "inline-block";
        if (submitBtn) submitBtn.style.display = "none";
    }
}


export function getCurrentStep(state: stepperState):number {
    return state.currentStep;
}

export function setCurrentStep(state: stepperState, step: number):void {
    state.currentStep = step;
    updateStepUI(state);
}