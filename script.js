const API = "http://127.0.0.1:5000/products";
const pid = document.getElementById("pid");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");
const productList = document.getElementById("productList");

function addProduct() {
    if (!nameInput.value || !priceInput.value || !quantityInput.value) {
        alert("Please fill all fields");
        return;
    }

    fetch(API, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: nameInput.value,
            price: parseFloat(priceInput.value),
            quantity: parseInt(quantityInput.value)
        })
    })
    .then(res => res.json())
    .then(() => {
        clearForm();
        loadProducts();
    });
}

function loadProducts() {
    fetch(API)
    .then(res => res.json())
    .then(data => {
        productList.innerHTML = "";
        data.forEach(p => {
            productList.innerHTML += `
                <tr>
                    <td>${p.name}</td>
                    <td>${p.price}</td>
                    <td>${p.quantity}</td>
                    <td>
                        <button class="edit" onclick="editProduct(${p.id}, '${p.name}', ${p.price}, ${p.quantity})">Edit</button>
                        <button class="delete" onclick="deleteProduct(${p.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
    });
}

function editProduct(id, nameVal, priceVal, qtyVal) {
    pid.value = id;
    nameInput.value = nameVal;
    priceInput.value = priceVal;
    quantityInput.value = qtyVal;
}

function updateProduct() {
    if (!pid.value) {
        alert("Select a product to update");
        return;
    }

    fetch(API + "/" + pid.value, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: nameInput.value,
            price: parseFloat(priceInput.value),
            quantity: parseInt(quantityInput.value)
        })
    })
    .then(res => res.json())
    .then(() => {
        clearForm();
        loadProducts();
    });
}

function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    fetch(API + "/" + id, { method: "DELETE" })
    .then(() => loadProducts());
}

function clearForm() {
    pid.value = "";
    nameInput.value = "";
    priceInput.value = "";
    quantityInput.value = "";
}

// Initial load
loadProducts();
