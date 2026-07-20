let merchants = [];
let summary = {};

const merchantList = document.querySelector(".merchant-list");
const searchInput = document.getElementById("search");

const filterButtons = document.querySelectorAll(".filter button");

const addModal = document.getElementById("addModal");
const deleteMerchantModal = document.getElementById("deleteMerchantModal");
const bulkDeleteModal = document.getElementById("bulkDeleteModal");

const addButton = document.querySelector(".add-btn");
const cancelButton = document.querySelector(".cancel");
const saveButton = document.querySelector(".save");

const merchantName = document.getElementById("merchantNames");
const merchantBrand = document.getElementById("merchantBrand");

const deleteName = document.getElementById("deleteName");

const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");
const confirmBulkDelete = document.getElementById("confirmBulkDelete");

let currentFilter = "Semua";
let currentKeyword = "";

function renderMerchant() {

    merchantList.innerHTML = "";

    let data = merchants.filter(item => {

        const brand =
            currentFilter === "Semua"
                ? true
                : item.brand === currentFilter;

        const keyword =
            item.name.toLowerCase()
                .includes(currentKeyword.toLowerCase());

        return brand && keyword;

    });

    if (data.length === 0) {

        merchantList.innerHTML = `
            <div class="card">
                <h2>Sedang Memuat...</h2>
            </div>
        `;

        return;

    }


let html = "";

    data.forEach(item => {

        merchantList.innerHTML += `

<div class="card">

    <div class="left">

        <h2>${item.name}</h2>

    </div>

    <div class="right">

        <span class="badge ${item.brand}">
            ${item.brand}
        </span>

        <div class="menu">

            <button class="menu-btn">
                ⋮
            </button>

            <div class="dropdown">

                <button
                    class="delete-btn"
                    data-id="${item.id}">
                    🗑 Delete
                </button>

            </div>

        </div>

    </div>

</div>

`;

    });

    setupMenu();
    setupDelete();

}

searchInput.addEventListener("input", function () {

    currentKeyword = this.value;

    renderMerchant();

});

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

console.log(button);
console.log(button.dataset);
console.log(button.dataset.filter);

        renderMerchant();

    });

});

function setupMenu() {

    const menus = document.querySelectorAll(".menu-btn");

    menus.forEach(menu => {

        menu.onclick = function (e) {

            e.stopPropagation();

            document.querySelectorAll(".dropdown").forEach(drop => {

                if (drop !== menu.nextElementSibling) {

                    drop.classList.remove("show");

                }

            });

            menu.nextElementSibling.classList.toggle("show");

        };

    });

}

document.addEventListener("click", () => {

    document.querySelectorAll(".dropdown").forEach(drop => {

        drop.classList.remove("show");

    });

});

renderMerchant();

addButton.addEventListener("click", () => {

    merchantNames.value = "";
    merchantBrand.value = "DMI";

    addModal.classList.add("show");

});

cancelButton.addEventListener("click", () => {

    addModal.classList.remove("show");

});

saveButton.addEventListener("click", async () => {

    const names = merchantNames.value
    .split("\n")
    .map(item => item.trim())
    .filter(item => item !== "");

if(names.length===0){

    alert("Merchant tidak boleh kosong");

    return;

}

await Promise.all(

    names.map(name =>

        fetch("/api/merchants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                brand: merchantBrand.value
            })
        })

    )

);
    addModal.classList.remove("show");

await loadMerchants();

});


const totalMerchant = document.getElementById("totalMerchant");
const totalDMI = document.getElementById("totalDMI");
const totalKMI = document.getElementById("totalKMI");
const totalKALABIRU = document.getElementById("totalKALABIRU");

function updateSummary() {

    totalMerchant.textContent = summary.total;

    totalDMI.textContent = summary.dmi;

    totalKMI.textContent = summary.kmi;

    totalKALABIRU.textContent = summary.kalabiru;

}

function setupDelete() {

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(button => {

        button.onclick = function () {

            deleteId = Number(this.dataset.id);

            const merchant = merchants.find(item => item.id === deleteId);

            if (!merchant) return;

            deleteName.innerText = merchant.name;

            deleteMerchantModal.classList.add("show");

            bulkDeleteModal.classList.remove("show");

            document.querySelectorAll(".dropdown").forEach(drop => {

                drop.classList.remove("show");

            });

        };

    });

}

cancelDelete.addEventListener("click", () => {

    deleteMerchantModal.classList.remove("show");

});

confirmDelete.addEventListener("click", async () => {

    // Tutup modal langsung
    deleteMerchantModal.classList.remove("show");

    // Disable tombol agar tidak bisa diklik dua kali
    confirmDelete.disabled = true;

    try {

        const response = await fetch("/api/merchants/" + deleteId, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Gagal menghapus merchant");
        }

        await loadMerchants();

    } catch (err) {

        alert(err.message);

    } finally {

        confirmDelete.disabled = false;

    }

});

confirmBulkDelete.addEventListener("click", async () => {

    const brand = document.getElementById("deleteBrand").value;

    bulkDeleteModal.classList.remove("show");

    try {

        const response = await fetch("/api/merchants/bulk-delete", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                brand: brand
            })

        });

        const result = await response.json();

        console.log(result);

        await loadMerchants();

    } catch (err) {

        console.error(err);

    }

});

window.addEventListener("click", (e) => {

    if (e.target === addModal) {

        addModal.classList.remove("show");

    }

    if (e.target === deleteMerchantModal) {

        deleteMerchantModal.classList.remove("show");

    }

    if (e.target === bulkDeleteModal) {

    bulkDeleteModal.classList.remove("show");

}

});

window.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        addModal.classList.remove("show");

        deleteMerchantModal.classList.remove("show");

        document.querySelectorAll(".dropdown").forEach(drop => {

            drop.classList.remove("show");

        });

    }

});


merchantName.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        saveButton.click();

    }

});

console.log(totalMerchant);
console.log(totalDMI);
console.log(totalKMI);
console.log(totalKALABIRU);

async function loadMerchants() {

    const response = await fetch("/api/merchants");

    const result = await response.json();

    merchants = result.data;

    summary = result.summary;

    renderMerchant();

    updateSummary();

}

function openBulkDeleteModal() {
    bulkDeleteModal.classList.add("show");
}

function closeBulkDeleteModal() {
    bulkDeleteModal.classList.remove("show");
}

loadMerchants();