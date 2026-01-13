// Modal handling utilities

export function showRatingsModal(record) {
    document.getElementById("modal-title").innerText = "Ratings Details";

    const tbody = document.getElementById("ratings-table-body");
    tbody.innerHTML = "";

    Object.entries(record.ratings).forEach(([category, value]) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${category.replace(/-/g, " ")}</td>
            <td class="rating-cell">
                ${value === 0
                    ? `<span class="na">N/A</span>`
                    : `<span class="stars">${"★".repeat(value)}${"☆".repeat(5 - value)}</span>`
                }
            </td>
        `;
        tbody.appendChild(tr);
    });

    const optionalDiv = document.getElementById("optional-text-modal");
    optionalDiv.innerHTML = `
        <div class="optional-row">
            <strong>What did you like:</strong>
            <p>${record.whatDidYouLike || "<span class='na'>Not provided</span>"}</p>
        </div>

        <div class="optional-row">
            <strong>What to improve:</strong>
            <p>${record.whatToImprove || "<span class='na'>Not provided</span>"}</p>
        </div>

        <div class="optional-row">
            <strong>Additional comments:</strong>
            <p>${record.additionalComments || "<span class='na'>Not provided</span>"}</p>
        </div>

        <div class="optional-row">
            <strong>Participate in monthly review:</strong>
            <p>${record.participateInMonthlyReview === "yes" ? "Yes" : "No"}</p>
        </div>
    `;
    
    openModal();
}

export function openModal() {
    const modalOverlay = document.getElementById("modal-overlay");
    if (modalOverlay) modalOverlay.classList.remove("hidden");
}


export function closeModal() {
    const modalOverlay = document.getElementById("modal-overlay");
    if (modalOverlay) modalOverlay.classList.add("hidden");
}

export function openSuccessModal(){
    document.getElementById("success-modal-overlay").classList.remove("hidden");
}

export function closeSuccessModal(){
    document.getElementById("success-modal-overlay").classList.add("hidden");
}

export function setupSuccessModalHandlers(){
    const okBtn = document.getElementById("success-ok");
    okBtn?.addEventListener("click",closeSuccessModal);
}
export function setupModalHandlers() {
    const modalClose = document.getElementById("modal-close");
    const modalOverlay = document.getElementById("modal-overlay");

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target.id === "modal-overlay") {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });
}

export function openDeleteModal(index) {
    const deleteOverlay = document.getElementById("delete-modal-overlay");
    if (deleteOverlay) deleteOverlay.classList.remove("hidden");
    return index;
}


export function closeDeleteModal() {
    const deleteOverlay = document.getElementById("delete-modal-overlay");
    if (deleteOverlay) deleteOverlay.classList.add("hidden");
}


export function setupDeleteModalHandlers(onConfirmDelete) {
    const cancelBtn = document.getElementById("cancel-delete");
    const closeBtn = document.getElementById("close-delete-modal");
    const confirmBtn = document.getElementById("confirm-delete");

    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeDeleteModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeDeleteModal);
    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", onConfirmDelete);
    }
}
