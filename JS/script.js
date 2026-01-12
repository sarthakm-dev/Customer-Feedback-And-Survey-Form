const form = document.getElementById("form-container");
const STORAGE_KEY = "customer-feedback-records";
let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
renderMainTable();
let editIndex = null;
const ratings = {};
const ratingGroups = document.querySelectorAll(".rating-group");
const supportRadios = document.querySelectorAll('input[name="support-contacted"]');
const emailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
const supportContacted = document.querySelector('input[name="support-contacted"]:checked')?.value;
const requiredRadios = ["method", "package-content-experience", "support-contacted", "recommendation-experience"];
//Save to Local Storage
function saveToLocalStorage(){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(records));
}
//Box rating Logic


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
function formatRequired(input) {

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
orderNumber.forEach(input => {
    input.addEventListener('blur', () => {
        formatRequired(input);
    })
    input.addEventListener('input', () => {

        formatRequired(input);

    })
})
const rateElements = document.querySelectorAll('.rating-group');
rateElements.forEach(group => {
    const stars = group.querySelectorAll(".star");
    stars.forEach(star => {
        let check = false;
        star.addEventListener("click", () => {
            const value = star.dataset.value;
            ratings[group.dataset.category] = value;
            group.classList.remove("invalid");
            const error = group.querySelector(".error");
            if (error) {
                check = true;
            }
        })
        if (check) {
            const error = group.querySelector(".error");
            error.style.visibility = "hidden";
        }
    });
});

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


requiredRadios.forEach(name => {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const container = document.querySelector(`[data-radio="${name}"]`);
    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            container.classList.remove("invalid");
        });
    });
});
function scrollToFirstInvalid() {
    const firstInvalid = document.querySelector('.invalid input, .invalid textarea, .rating-group.invalid, .radio-container.invalid');
    if (!firstInvalid) return;
    firstInvalid.scrollIntoView({
        behavior: "smooth",
        block: "center"
    })
}
const dateInput = document.getElementById("purchase-date");
dateInput.max = new Date().toISOString().split("T")[0];
dateInput.addEventListener("blur", () => {
    if (dateInput.value.trim()) {
        dateInput.classList.remove("invalid");
        dateInput.nextElementSibling.style.visibility = "hidden";
    }
})
dateInput.addEventListener("input", () => {
    if (dateInput.value.trim()) {
        dateInput.classList.remove("invalid");
        dateInput.nextElementSibling.style.visibility = "hidden";
    }
});

function renderMainTable(){
    const tbody = document.querySelector("#main-table tbody");
    tbody.innerHTML="";
    records.forEach((item,index)=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index+1}.</td>
            <td>${item.orderNumber}</td>
            <td>${item.email}</td>
            <td>${item.purchaseDate}</td>
            <td>${item.shoppingMethod}</td>
            <td>
                <div class"table-actions>
                    <button class="view-btn" data-index="${index}">👁</button>
                    <button class="edit-btn" data-index="${index}">✎</button>
                    <button class="delete-btn" data-index="${index}">🗑</button>
                </div>
                
            </td>
        `;
        tbody.appendChild(tr);
    })
}
function renderRatingsTable(ratings){
    const section = document.getElementById("ratings-section");
    const tbody = document.querySelector("#ratings-table tbody");
    tbody.innerHTML = "";
    Object.entries(ratings).forEach(([category,value])=>{
        const tr = document.createElement("tr");
        tr.innerHTML = 
        `
        <td>${category.replace(/-/g," ")}</td>
        <td>${value=== 0?"N/A":value}</td>
        `;
        tbody.appendChild(tr);
    });
    section.style.display = "block";
}

document.querySelector("#main-table").addEventListener("click",e => {
    const index = e.target.dataset.index;
    if(index === undefined) return;
    if(e.target.classList.contains("view-btn")){
        renderRatingsTable(records[index].ratings);
        
    }
    if(e.target.classList.contains("edit-btn")){
        populateForm(records[index]);
        editIndex=index;
    }
    if(e.target.classList.contains("delete-btn")){
        if(confirm("Delete this record?")){
            records.splice(index,1);
            saveToLocalStorage();
            renderMainTable();
            document.getElementById("ratings-section").style.display="none";
        }
    }
});
function restoreRadio(name,value){
    if(!value) return;
    document.querySelectorAll(`input[name="${name}"]`).forEach(radio=>{
        radio.checked=radio.value===value;
    });
}
function goToFirstRatedSection(data) {
    const sections = [
        ["product-quality","matches-description","durability","value-for-money"],
        ["websites-ease-of-use","product-search","checkout-process","payment-options"],
        ["delivery-experience","delivery-speed","packaging-quality"],
        ["support-responsiveness","support-helpfulness"]
    ];

    for (let i = 0; i < sections.length; i++) {
        if (sections[i].some(cat => data.ratings[cat] > 0)) {
            currentStep = i;
            updateStepUI();
            break;
        }
    }
}
function populateForm(data){
    form["product-name"].value = data.orderNumber;
    form.email.value = data.email;
    form["purchase-date"].value = data.purchaseDate;
    restoreRadio("method",data.shoppingMethod);
    restoreRadio("package-content-experience",data.packageContentMatch);
    restoreRadio("support-contacted",data.supportContacted);
    restoreRadio("recommendation-experience",data.recommendToFriends);
    restoreRadio("review",data.participateInMonthlyReview);
    document.querySelectorAll(".star").forEach(star=> star.classList.remove("active"));
    Object.keys(ratings).forEach(k=>ratings[k]=0);
    Object.entries(data.ratings).forEach(([category,value])=>{
        ratings[category] = value;
        const group = document.querySelector(`.rating-group[data-category="${category}"]`);
        if(!group) return;
        group.querySelectorAll(".star").forEach(star=>{
            star.classList.toggle("active",Number(star.dataset.value)<=value);
        });
    });
    goToFirstRatedSection(data);
    window.scrollTo({top: 0 ,behavior:"smooth"});
}
function resetForm() {
    form.reset();
    editIndex = null;
    Object.keys(ratings).forEach(k=> (ratings[k]=0));
    document.querySelectorAll(".star").forEach(s=>s.classList.remove("active"));
}

// Stepper Slider
let currentStep = 0;
const sections = document.querySelectorAll(".rating-section");
const steps = document.querySelectorAll(".step");

function updateStepUI() {
  sections.forEach(s => s.classList.remove("active"));
  steps.forEach(s => s.classList.remove("active"));

  sections[currentStep].classList.add("active");
  steps[currentStep].classList.add("active");

  document.getElementById("prevStep").disabled = currentStep === 0;
  document.getElementById("nextStep").innerText =
    currentStep === sections.length - 1 ? "Finish" : "Next";
}

document.getElementById("nextStep").addEventListener("click", () => {
  if (currentStep < sections.length - 1) {
    currentStep++;
    updateStepUI();
  }
});

document.getElementById("prevStep").addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateStepUI();
  }
});

steps.forEach(step => {
  step.addEventListener("click", () => {
    currentStep = Number(step.dataset.step);
    updateStepUI();
  });
});

updateStepUI();
//Form Validation
form.addEventListener("submit", e => {
    e.preventDefault();

    let valid = true;


    // Order Number Required Logic
    const order_input = document.querySelector(`input[name="product-name"]`);
    if (!formatRequired(order_input)) {
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
        ratings: {...ratings}
    }
    console.log("FORM SUBMITTED:", display);
    if(editIndex==null){
        records.push(display);

    }else{
        records[editIndex]=display;
        editIndex=null;
    }
    saveToLocalStorage();
    renderMainTable();
    resetForm();
});