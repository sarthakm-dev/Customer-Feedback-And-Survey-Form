// Validation utility functions
const emailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;


export function formatRequired(input) {
    const order_id = input.value.trim();
    const prefix = order_id.slice(0, 3);
    const middle = order_id[3];
    const suffix = order_id.slice(4);

    if (order_id.length !== 10 || prefix !== "ORD" || isNaN(suffix) || middle !== "-") {
        input.classList.add("invalid");
        input.nextElementSibling.style.visibility = "visible";
        return false;
    } else {
        input.classList.remove("invalid");
        input.nextElementSibling.style.visibility = "hidden";
        return true;
    }
}


export function isValidEmail(email) {
    return emailRegex.test(email);
}


export function validateRequired(input) {
    if (!isValidEmail(input.value.trim())) {
        input.classList.add('invalid');
        input.nextElementSibling.style.visibility = "visible";
        return false;
    } else {
        input.classList.remove('invalid');
        input.nextElementSibling.style.visibility = "hidden";
        return true;
    }
}

export function setupEmailValidation() {
    const email = document.querySelectorAll('input[name="email"]');
    email.forEach(input => {
        input.addEventListener('blur', () => {
            validateRequired(input);
        });
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateRequired(input);
            }
        });
    });
}


export function setupOrderNumberValidation() {
    const orderNumber = document.querySelectorAll('input[name="product-name"]');
    orderNumber.forEach(input => {
        input.addEventListener('blur', () => {
            formatRequired(input);
        });
        input.addEventListener('input', () => {
            formatRequired(input);
        });
    });
}

export function validatePurchasedate(){
    const dateInput = document.querySelector(`input[name="purchase-date"]`);
    if(!dateInput) return true;
    if(!dateInput.value){
        dateInput.classList.add("invalid");
        dateInput.nextElementSibling.style.visibility = "visible";
        return false;
    }else{
        dateInput.classList.remove("invalid");
        dateInput.nextElementSibling.style.visibility="hidden";
        return true;
    }
}

export function setupDateValidation() {
    const dateInput = document.getElementById("purchase-date");
    dateInput.max = new Date().toISOString().split("T")[0];
    
    dateInput.addEventListener("blur", () => {
        if (dateInput.value.trim()) {
            dateInput.classList.remove("invalid");
            dateInput.nextElementSibling.style.visibility = "hidden";
        }else{
            dateInput.classList.add("invalid");
            dateInput.nextElementSibling.style.visibility = "visible";
        }
    });
    
    dateInput.addEventListener("input", () => {
        if (dateInput.value.trim()) {
            dateInput.classList.remove("invalid");
            dateInput.nextElementSibling.style.visibility = "hidden";
        }else{
            dateInput.classList.add("invalid");
            dateInput.nextElementSibling.style.visibility = "visible";
        }
    });
}


export function scrollToFirstInvalid() {
    const firstInvalid = document.querySelector('.invalid input, .invalid textarea, .rating-group.invalid, .radio-container.invalid');
    if (!firstInvalid) return;
    firstInvalid.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}
