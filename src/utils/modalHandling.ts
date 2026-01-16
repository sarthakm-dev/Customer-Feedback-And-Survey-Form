// Modal handling utilities

import { RecordData } from "../types/record";

export function showRatingsModal(record:RecordData):void {
    (document.getElementById("modal-title") as HTMLElement).innerText = "Ratings Details";

    const tbody = document.getElementById("ratings-table-body") as HTMLTableSectionElement;
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

    const optionalDiv = document.getElementById("optional-text-modal") as HTMLElement;
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
    const carmodal = document.getElementById("carsmodal") as HTMLElement;
    carmodal.innerHTML = `
    <div class="optional-row">
            <strong>Car Type:</strong>
            <p>${record.car || "<span class='na'>Not provided</span>"}</p>
        </div>
    `
    openModal();
}

export function openModal():void {
    const modalOverlay = document.getElementById("modal-overlay");
    if (modalOverlay) modalOverlay.classList.remove("hidden");
}


export function closeModal():void {
    const modalOverlay = document.getElementById("modal-overlay");
    if (modalOverlay) modalOverlay.classList.add("hidden");
}

export function openSuccessModal(message="Form submitted successfully"):void{
    const modal = document.getElementById("success-modal-overlay") as HTMLElement;
    const text = modal.querySelector<HTMLElement>(".success-text");
    if(!text) return;
    text.textContent = message;
    modal.classList.remove("hidden");
}

export function closeSuccessModal():void{
    (document.getElementById("success-modal-overlay") as HTMLElement).classList.add("hidden");
}

export function setupSuccessModalHandlers():void{
    const okBtn = document.getElementById("success-ok");
    okBtn?.addEventListener("click",closeSuccessModal);
}
export function setupModalHandlers() {
    const modalClose = document.getElementById("modal-close") as HTMLElement;
    const modalOverlay = document.getElementById("modal-overlay") as HTMLElement;

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e:MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if(!target) return;
            if (target.id === "modal-overlay") {
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

export function openDeleteModal(index:number):number {
    const deleteOverlay = document.getElementById("delete-modal-overlay");
    if (deleteOverlay) deleteOverlay.classList.remove("hidden");
    return index;
}


export function closeDeleteModal():void {
    const deleteOverlay = document.getElementById("delete-modal-overlay");
    if (deleteOverlay) deleteOverlay.classList.add("hidden");
}


export function setupDeleteModalHandlers(onConfirmDelete:()=>void):void {
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
