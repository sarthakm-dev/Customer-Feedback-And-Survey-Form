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
                    <button class="view-btn" data-index="${index}"><svg  xmlns="http://www.w3.org/2000/svg" width="20" height="20"  
fill="#4f9b7a" viewBox="0 0 24 24"  
transform="scale(-1,1) ">
<!--Boxicons v3.0.7 https://boxicons.com | License  https://docs.boxicons.com/free-->
<path d="M17 6V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H2v2h2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h2V6zM9 4h6v2H9zM6 20V8h12v12z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
</svg></button>
                    <button class="edit-btn" data-index="${index}"><svg  xmlns="http://www.w3.org/2000/svg" width="20" height="20"  
fill="#4f9b7a" viewBox="0 0 24 24"  
transform="scale(-1,1) ">
<!--Boxicons v3.0.7 https://boxicons.com | License  https://docs.boxicons.com/free-->
<path d="m17.71 7.29-3-3a.996.996 0 0 0-1.41 0l-11.01 11A1 1 0 0 0 2 16v3c0 .55.45 1 1 1h3c.27 0 .52-.11.71-.29l11-11a.996.996 0 0 0 0-1.41ZM5.59 18H4v-1.59l7.5-7.5 1.59 1.59zm8.91-8.91L12.91 7.5 14 6.41 15.59 8zM11 18h11v2H11z"></path>
</svg></button>
                    <button class="delete-btn" data-index="${index}"><svg  xmlns="http://www.w3.org/2000/svg" width="20" height="20"  
fill="#4f9b7a" viewBox="0 0 24 24"  
transform="scale(-1,1) ">
<!--Boxicons v3.0.7 https://boxicons.com | License  https://docs.boxicons.com/free-->
<path d="M17 6V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H2v2h2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h2V6zM9 4h6v2H9zM6 20V8h12v12z"></path>
</svg></button>
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
