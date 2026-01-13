// Table action handlers 

export function setupTableActionHandlers(handlers) {
    const table = document.querySelector("#main-table");
    
    if (table) {
        table.addEventListener("click", e => {
            const index = e.target.dataset.index;
            if (index === undefined) return;

            if (e.target.classList.contains("view-btn")) {
                handlers.onView && handlers.onView(Number(index));
            }
            if (e.target.classList.contains("edit-btn")) {
                handlers.onEdit && handlers.onEdit(Number(index));
            }
            if (e.target.classList.contains("delete-btn")) {
                handlers.onDelete && handlers.onDelete(Number(index));
            }
        });
    }
}
