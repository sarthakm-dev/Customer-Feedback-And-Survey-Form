// Table rendering utilities


export function renderMainTable(records) {
    const tbody = document.querySelector("#main-table tbody");
    tbody.innerHTML = "";
    
    records.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}.</td>
            <td>${item.orderNumber}</td>
            <td>${item.email}</td>
            <td>${item.purchaseDate}</td>
            <td>${item.shoppingMethod}</td>
            <td>
                <div class="table-actions">
                    <button class="view-btn" data-index="${index}">👁</button>
                    <button class="edit-btn" data-index="${index}">✎</button>
                    <button class="delete-btn" data-index="${index}">🗑</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


export function renderRatingsTable(ratings) {
    const section = document.getElementById("ratings-section");
    const tbody = document.querySelector("#ratings-table tbody");
    tbody.innerHTML = "";
    
    Object.entries(ratings).forEach(([category, value]) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${category.replace(/-/g, " ")}</td>
            <td>${value === 0 ? "N/A" : value}</td>
        `;
        tbody.appendChild(tr);
    });
    
    if (section) section.style.display = "block";
}
