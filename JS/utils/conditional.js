// Conditional field logic

export function setupConditionalFields(ratings) {
    const supportRadios = document.querySelectorAll('input[name="support-contacted"]');
    
    supportRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            const contacted = document.querySelector('input[name="support-contacted"]:checked')?.value;
            
            document.querySelectorAll("[data-conditional='support-yes']").forEach(group => {
                if (contacted === "yes") {
                    group.classList.remove("disabled");
                } else {
                    group.classList.add("disabled");
                    ratings[group.dataset.category] = 0;
                    group.classList.remove("invalid");
                    
                    const stars = group.querySelectorAll(".star");
                    stars.forEach(b => b.classList.remove("active"));
                }
            });
        });
    });
}


export function getSupportContactedStatus() {
    return document.querySelector('input[name="support-contacted"]:checked')?.value;
}
