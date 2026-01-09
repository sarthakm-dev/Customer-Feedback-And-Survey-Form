const form = document.getElementById("form-container");

//Box rating Logic
const ratings = {};
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

//Conditional Required
const supportRadios = document.querySelectorAll('input[name="support-contacted"]')
supportRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        const contacted = document.querySelector('input[name="support-contacted"]:checked')?.value;
        document.querySelectorAll("[data-conditional='support-yes']").forEach(group => {
            if (contacted === "yes") {
                group.classList.remove("disabled")

            } else {
                group.classList.add("disabled");
                ratings[group.dataset.category] = 0;
                group.classList.remove("invalid");
                const stars = group.querySelectorAll(".stars");
                stars.forEach(b => b.classList.remove("active"));
            }
        });
    });
});

// Real Time Validation Logic
function formatRequired(input){
 
    const order_id = input.value.trim();
    const prefix = order_id.slice(0, 3);
    const middle = order_id[3];
    const suffix = order_id.slice(4);
    
    if (order_id.length !== 10 || prefix !== "ORD" || isNaN(suffix) || middle !== "-") {

        input.classList.add("invalid");
        
        input.nextElementSibling.style.visibility = "visible";
        return false
    } else {
        input.classList.remove("invalid");
        input.nextElementSibling.style.visibility = "hidden";
        return true;
    }
}
function isValidEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}


function validateRequired(input) {
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
const email = document.querySelectorAll('input[name="email"]');
email.forEach(input => {
    input.addEventListener('blur', () => {
        validateRequired(input);
    })
    input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
            validateRequired(input);
        }
    })
})
const orderNumber = document.querySelectorAll('input[name="product-name"]');
orderNumber.forEach(input=>{
    input.addEventListener('blur', () => {
        formatRequired(input);
    })
    input.addEventListener('input', () => {
        
            formatRequired(input);
        
    })
})
const rateElements= document.querySelectorAll('.rating-group');
rateElements.forEach(group=>{
    const stars = group.querySelectorAll(".star");
    stars.forEach(star=>{
        let check = false;
        star.addEventListener("click",()=>{
            const value = star.dataset.value;
            ratings[group.dataset.category]=value;
            group.classList.remove("invalid");
            const error = group.querySelector(".error");
            if(error){
                check = true;
            }
        })
        if(check){
            const error = group.querySelector(".error");
            error.style.visibility="hidden";
        }
    })
})
const requiredRadios = ["method", "package-content-experience", "support-contacted", "recommendation-experience"]
requiredRadios.forEach(name=>{
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const container = document.querySelector(`[data-radio="${name}"]`);
    radios.forEach(radio=>{
        radio.addEventListener("change",()=>{
            container.classList.remove("invalid");
        });
    });
});
function scrollToFirstInvalid(){
    const firstInvalid = document.querySelector('.invalid input, .invalid textarea, .rating-group.invalid, .radio-container.invalid');
    if(!firstInvalid) return;
    firstInvalid.scrollIntoView({
        behavior:"smooth",
        block:"center"
    })
}
const dateInput = document.getElementById("purchase-date");
dateInput.max = new Date().toISOString().split("T")[0];
dateInput.addEventListener("blur",()=>{
    if(dateInput.value.trim()){
        dateInput.classList.remove("invalid");
        dateInput.nextElementSibling.style.visibility="hidden";
    }
})
dateInput.addEventListener("input",()=>{
    if(dateInput.value.trim()){
        dateInput.classList.remove("invalid");
        dateInput.nextElementSibling.style.visibility="hidden";
    }
})
//Form Validation
form.addEventListener("submit", e => {
    e.preventDefault();

    let valid = true;


    // Order Number Required Logic
    const order_input = document.querySelector(`input[name="product-name"]`);
    if(!formatRequired(order_input)){
        valid = false;
    }
    //Email required Logic
    const email_input = document.querySelector('input[name="email"]');
    if (!validateRequired(email_input)) {
        email_input.classList.add("invalid");
        valid = false;
        email_input.nextElementSibling.style.visibility = "visible";
    } else {
        email_input.classList.remove("invalid");
        email_input.nextElementSibling.style.visibility = "hidden";
    }
    //Date Input Required logic
    const date_input = document.querySelector('input[name="purchase-date"]');
    if (!date_input.value.trim()) {
        date_input.classList.add("invalid");
        valid = false;
        date_input.nextElementSibling.style.visibility = "visible";
    } else {
        date_input.classList.remove("invalid");
        date_input.nextElementSibling.style.visibility = "hidden";
    }

    //Radios required logic
    const requiredRadios = ["method", "package-content-experience", "support-contacted", "recommendation-experience"]
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
    const supportContacted = document.querySelector('input[name="support-contacted"]:checked')?.value;
    ratingGroups.forEach(group => {
        const category = group.dataset.category;
        const isConditional = group.dataset.conditional === "support-yes";
        if (ratings[category] === 0 && (!isConditional || supportContacted === "yes")) {
            group.classList.add("invalid");
            valid = false;
        } else {
            group.classList.remove("invalid");
        }
    });
    if (!valid) {
        alert("Please fill all required fields");
        scrollToFirstInvalid();
        return;
    }
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
        participateInMonthlyReview: formData.get("review") === "yes" ? "yes" : "no",
        ratings
    }
    console.log("FORM SUBMITTED:", display);
    alert("Form submitted successfully!");
});