// Imports
import * as validation from './utils/validation.js';
import * as ratings from './utils/ratings.js';
import * as conditional from './utils/conditional.js';
import * as storage from './utils/storage.js';
import * as formManagement from './utils/formManagement.js';
import * as stepperNav from './utils/stepperNavigation.js';
import * as tableRendering from './utils/tableRendering.js';
import * as modalHandling from './utils/modalHandling.js';
import * as formValidation from './utils/formValidation.js';
import * as tableActions from './utils/tableActions.js';
import { RatingMap } from './types/ratings';
import { RecordData } from './types/record';
import { stepperState } from './types/stepper';

// variables

const form = document.getElementById("form-container") as HTMLFormElement;
let records: RecordData[] = storage.getRecords();
let editIndex: number | null = null;
let deleteIndex: number | null = null;
const requiredRadios = ["method", "package-content-experience", "support-contacted", "recommendation-experience"]
const ratingData: RatingMap = ratings.initializeRatings();
const stepperState: stepperState = {
    currentStep: 0
};

tableRendering.renderMainTable(records);
validation.setupEmailValidation();
validation.setupOrderNumberValidation();
validation.setupDateValidation();
ratings.setupStarRatings(ratingData);
conditional.setupConditionalFields(ratingData);
stepperNav.initializeStepper(stepperState, ratingData);

function saveRecords():void  {
    storage.saveToLocalStorage(records);
}



//Delete Modal
function handleDeleteConfirm(): void {
    if (deleteIndex !== null) {
        records.splice(deleteIndex, 1);
        saveRecords();
        tableRendering.renderMainTable(records);
    }
    modalHandling.closeDeleteModal();
}

modalHandling.setupDeleteModalHandlers(handleDeleteConfirm);

// Update to Submit button
function resetEditMode():void {
    editIndex = null;
    const submitBtn = document.getElementById("submit");
    if (submitBtn) {
        submitBtn.textContent = "Submit";
    }
}

//Duplicate Check
function isDuplicateRecord(records:RecordData[], newRecord:RecordData, editIndex:number|null):boolean {
    return records.some((record, index) => {

        if (editIndex !== null && index === editIndex) {
            return false;
        }
        return (record.orderNumber === newRecord.orderNumber && record.email === newRecord.email);
    });

}

//Table Action
tableActions.setupTableActionHandlers({
    onView: (index:number) => {
        modalHandling.showRatingsModal(records[index]);
    },
    onEdit: (index:number) => {
        formManagement.populateForm(records[index], ratingData, form);
        editIndex = index;
        const submitBtn = document.getElementById("submit");
        if (submitBtn) {
            submitBtn.textContent = "Update";
        }
        const modalMessage = document.getElementById("success-message");
        if (modalMessage) {
            modalMessage.textContent = "Form updated successfully";
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onDelete: (index:number) => {
        deleteIndex = index;
        deleteIndex = modalHandling.openDeleteModal(index);
    }
});

//Radio Validation

requiredRadios.forEach(name => {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const container = document.querySelector(`[data-radio="${name}"]`);
    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            container?.classList.remove("invalid");
        });
    });
});

// Modal Handler
modalHandling.setupModalHandlers();

//Close Modal
modalHandling.setupSuccessModalHandlers();

//Form Submission
form.addEventListener("submit", e => {
    e.preventDefault();
    const supportContacted = conditional.getSupportContactedStatus();

    let valid = true;
    const requiredRadios = ["method", "package-content-experience", "support-contacted", "recommendation-experience"];
    const order_input = document.querySelector<HTMLInputElement>(`input[name="product-name"]`)!;
    if (!validation.formatRequired(order_input)) {
        valid = false;
    }
    const email_input = document.querySelector<HTMLInputElement>('input[name="email"]')!;
    if (!validation.validateRequired(email_input)) {
        email_input.classList.add("invalid");
        valid = false;
        if(email_input.nextElementSibling){
            (email_input.nextElementSibling as HTMLElement).style.visibility = "visible";
        }
    } else {
        email_input.classList.remove("invalid");
        if(email_input.nextElementSibling){
            (email_input.nextElementSibling as HTMLElement).style.visibility = "hidden";
        }
     
    }
    const date_input = document.querySelector<HTMLInputElement>('input[name="purchase-date"]')!;
    if (!date_input.value.trim()) {
        date_input.classList.add("invalid");
        valid = false;
        if(date_input.nextElementSibling){
            (date_input.nextElementSibling as HTMLElement).style.visibility = "visible";
        }
        
    } else {
        date_input.classList.remove("invalid");
        if(date_input.nextElementSibling){
            (date_input.nextElementSibling as HTMLElement).style.visibility = "hidden";
        }
    }

    for (const name of requiredRadios) {
        const checked = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
        const content = document.querySelector<HTMLElement>(`[data-radio="${name}"]`)!;
        if (!checked) {
            content.classList.add("invalid");
            valid = false;
        } else {
            content.classList.remove("invalid");
        }
    }

    // Conditional validation
    const ratingGroups = document.querySelectorAll<HTMLElement>(".rating-group");
    ratingGroups.forEach(group => {
        
        const category = group.dataset.category;
        if(!category) return;
        const isConditional = group.dataset.conditional === "support-yes";
        if (ratingData[category] === 0 && (!isConditional || supportContacted === "yes")) {
            group.classList.add("invalid");
            valid = false;
        } else {
            group.classList.remove("invalid");
        }
    });

    if (!valid) {
        alert("Please fill all required fields");
        validation.scrollToFirstInvalid();
        return;
    }

    // Create form data
    const formData = new FormData(form);
    function getString(fd:FormData,key:string):string | null{
        const value = fd.get(key);
        return typeof value === "string" ? value : null;
    }
    const display = {
        orderNumber: getString(formData,"product-name"),
        email: getString(formData,"email"),
        purchaseDate: getString(formData,"purchase-date"),
        shoppingMethod: getString(formData,"method"),
        packageContentMatch: getString(formData,"package-content-experience"),
        supportContacted: getString(formData,"support-contacted"),
        recommendToFriends: getString(formData,"recommendation-experience"),
        whatDidYouLike: getString(formData,"what-did-you-like"),
        whatToImprove: getString(formData,"what-to-improve"),
        additionalComments: getString(formData,"additional-comments"),
        participateInMonthlyReview: getString(formData,"review") === "Yes" ? "yes" : "no",
        ratings: { ...ratingData }
    };

    console.log("FORM SUBMITTED:", display);
    let successMessage;
    if (editIndex == null) {
        if (isDuplicateRecord(records, display, editIndex)) {
            alert("Feedback already exists for this OrderNumber and Email");
            return;
        }
        records.push(display);
        successMessage = "Form Submitted Successfully"
    } else {
        records[editIndex] = display;
        editIndex = null;
        resetEditMode();
        successMessage = "Form Updated Successfully"
    }

    saveRecords();
    tableRendering.renderMainTable(records);
    stepperNav.setCurrentStep(stepperState, 0);
    modalHandling.openSuccessModal(successMessage);
    resetEditMode();
    formManagement.resetForm(form, ratingData);
});