// Table action handlers 

import { TableActionHandlers } from "../types/table";

export function setupTableActionHandlers(handlers:TableActionHandlers):void {
    const table = document.querySelector<HTMLTableElement>("#main-table");
    
    if (table) {
        table.addEventListener("click", e => {
            const target = e.target as HTMLElement | null;
            if(!target) return;
            const index = target.dataset.index;
            if (index === undefined) return;

            if (target.classList.contains("view-btn")) {
                if(handlers.onView){
                    handlers.onView(Number(index));
                }
                
            }
            if (target.classList.contains("edit-btn")) {
                if(handlers.onEdit){
                    handlers.onEdit(Number(index));
                }
            }
            if (target.classList.contains("delete-btn")) {
                if(handlers.onDelete){
                    handlers.onDelete(Number(index));
                }
            }
        });
    }
}
