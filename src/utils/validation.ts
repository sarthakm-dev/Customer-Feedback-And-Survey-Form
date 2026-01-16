// Validation utility functions
const emailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;


export function formatRequired(input:HTMLInputElement):boolean {
    const order_id = input.value.trim();
    const prefix = order_id.slice(0, 3);
    const middle = order_id[3];
    const suffix = Number(order_id.slice(4));

    if (order_id.length !== 10 || prefix !== "ORD" || isNaN(suffix) || middle !== "-") {
        input.classList.add("invalid");
        (input.nextElementSibling as HTMLElement).style.visibility = "visible";
        return false;
    } else {
        input.classList.remove("invalid");
        (input.nextElementSibling as HTMLElement).style.visibility = "hidden";
        return true;
    }
}


export function isValidEmail(email:string):boolean {
    return emailRegex.test(email);
}


export function validateRequired(input:HTMLInputElement):boolean {
    if (!isValidEmail(input.value.trim())) {
        input.classList.add('invalid');
        (input.nextElementSibling as HTMLElement).style.visibility = "visible";
        return false;
    } else {
        input.classList.remove('invalid');
        (input.nextElementSibling as HTMLElement).style.visibility = "hidden";
        return true;
    }
}

export function setupEmailValidation():void {
    const email = document.querySelectorAll<HTMLInputElement>('input[name="email"]');
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


export function setupOrderNumberValidation():void {
    const orderNumber = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="product-name"]'));
    orderNumber.forEach(input => {
        input.addEventListener('blur', () => {
            formatRequired(input);
        });
        input.addEventListener('input', () => {
            formatRequired(input);
        });
    });
}

export function validatePurchasedate():boolean{
    const dateInput = document.querySelector<HTMLInputElement>(`input[name="purchase-date"]`);
    if(!dateInput) return true;
    if(!dateInput.value){
        dateInput.classList.add("invalid");
        (dateInput.nextElementSibling as HTMLElement).style.visibility = "visible";
        return false;
    }else{
        dateInput.classList.remove("invalid");
        (dateInput.nextElementSibling as HTMLElement).style.visibility="hidden";
        return true;
    }
}

export function setupDateValidation():void {
    const dateInput = document.getElementById("purchase-date") as HTMLInputElement | null;
    if(!dateInput) return;
    dateInput.max = new Date().toISOString().split("T")[0];
    
    dateInput.addEventListener("blur", () => {
        if (dateInput.value.trim()) {
            dateInput.classList.remove("invalid");
            (dateInput.nextElementSibling as HTMLElement).style.visibility = "hidden";
        }else{
            dateInput.classList.add("invalid");
            (dateInput.nextElementSibling as HTMLElement).style.visibility = "visible";
        }
    });
    
    dateInput.addEventListener("input", () => {
        if (dateInput.value.trim()) {
            dateInput.classList.remove("invalid");
            (dateInput.nextElementSibling as HTMLElement).style.visibility = "hidden";
        }else{
            dateInput.classList.add("invalid");
            (dateInput.nextElementSibling as HTMLElement).style.visibility = "visible";
        }
    });
}


export function scrollToFirstInvalid():void {
    const firstInvalid = document.querySelector<HTMLElement>('.invalid input, .invalid textarea, .rating-group.invalid, .radio-container.invalid');
    if (!firstInvalid) return;
    firstInvalid.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}
