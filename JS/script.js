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

// variables
const form = document.getElementById("form-container");
let records = storage.getRecords();
let editIndex = null;
let deleteIndex = null;
const requiredRadios = ["method", "package-content-experience", "support-contacted", "recommendation-experience"]
const ratingData = ratings.initializeRatings();
const stepperState = {
    currentStep: 0
};

tableRendering.renderMainTable(records);
validation.setupEmailValidation();
validation.setupOrderNumberValidation();
validation.setupDateValidation();
ratings.setupStarRatings(ratingData);
conditional.setupConditionalFields(ratingData);
stepperNav.initializeStepper(stepperState,ratingData);

function saveRecords() {
    storage.saveToLocalStorage(records);
}



//Delete Modal
function handleDeleteConfirm() {
    if (deleteIndex !== null) {
        records.splice(deleteIndex, 1);
        saveRecords();
        tableRendering.renderMainTable(records);
    }
    modalHandling.closeDeleteModal();
}

modalHandling.setupDeleteModalHandlers(handleDeleteConfirm);

// Update to Submit button
function  resetEditMode(){
    editIndex=null;
    const submitBtn=document.getElementById("submit");
    if(submitBtn){
        submitBtn.textContent="Submit";
    }
}

//Table Action
tableActions.setupTableActionHandlers({
    onView: (index) => {
        modalHandling.showRatingsModal(records[index]);
    },
    onEdit: (index) => {
        formManagement.populateForm(records[index], ratingData, form);
        editIndex = index;
        const submitBtn = document.getElementById("submit");
        if(submitBtn){
            submitBtn.textContent="Update";
        }
        const modalMessage = document.getElementById("success-message");
        if(modalMessage){
            modalMessage.textContent = "Form updated successfully";
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onDelete: (index) => {
        deleteIndex = index;
        deleteIndex = modalHandling.openDeleteModal(index);
    }
});

//Radio Validation

requiredRadios.forEach(name=>{
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const container = document.querySelector(`[data-radio="${name}"]`);
    radios.forEach(radio=>{
        radio.addEventListener("change",()=>{
            container.classList.remove("invalid");
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
    const order_input = document.querySelector(`input[name="product-name"]`);
    if (!validation.formatRequired(order_input)) {
        valid = false;
    }
    const email_input = document.querySelector('input[name="email"]');
    if (!validation.validateRequired(email_input)) {
        email_input.classList.add("invalid");
        valid = false;
        email_input.nextElementSibling.style.visibility = "visible";
    } else {
        email_input.classList.remove("invalid");
        email_input.nextElementSibling.style.visibility = "hidden";
    }
    const date_input = document.querySelector('input[name="purchase-date"]');
    if (!date_input.value.trim()) {
        date_input.classList.add("invalid");
        valid = false;
        date_input.nextElementSibling.style.visibility = "visible";
    } else {
        date_input.classList.remove("invalid");
        date_input.nextElementSibling.style.visibility = "hidden";
    }

    for (const name of requiredRadios) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        const content = document.querySelector(`[data-radio="${name}"]`);
        if (!checked) {
            content.classList.add("invalid");
            valid = false;
        } else {
            content.classList.remove("invalid");
        }
    }

    // Conditional validation
    const ratingGroups = document.querySelectorAll(".rating-group");
    ratingGroups.forEach(group => {
        const category = group.dataset.category;
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
    const display = {
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
        participateInMonthlyReview: formData.get("review") === "Yes" ? "yes" : "no",
        ratings: { ...ratingData }
    };

    console.log("FORM SUBMITTED:", display);
    if (editIndex == null) {
        records.push(display);
    } else {
        records[editIndex] = display;
        editIndex = null;
        resetEditMode();
    }
    saveRecords();
    tableRendering.renderMainTable(records);
    stepperNav.setCurrentStep(stepperState,0);
    modalHandling.openSuccessModal();
    resetEditMode();
    formManagement.resetForm(form, ratingData);
});