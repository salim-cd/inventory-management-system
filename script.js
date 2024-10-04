// Inventory Array to store the items
let inventory = [];

// Track the item being edited
let editIndex = null;

// Get DOM elements
const form = document.getElementById('inventory-form');
const inventoryTableBody = document.querySelector('#inventory-table tbody');
const searchInput = document.getElementById('searchItem');

// Save inventory data to LocalStorage
function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Load inventory data from LocalStorage
function loadInventory() {
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
        inventory = JSON.parse(storedInventory);
        updateInventoryTable();
    }
}

// Call loadInventory when the page loads
window.onload = loadInventory;

// Form submit event listener
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form input values
    const itemName = document.getElementById('itemName').value;
    const itemQuantity = document.getElementById('itemQuantity').value;
    const itemPrice = document.getElementById('itemPrice').value;

    // Create or update inventory item object
    const newItem = {
        name: itemName,
        quantity: parseInt(itemQuantity),
        price: parseFloat(itemPrice),
        totalValue: parseInt(itemQuantity) * parseFloat(itemPrice)
    };

    // Check if we are editing an existing item
    if (editIndex !== null) {
        // Update existing item
        inventory[editIndex] = newItem;
        editIndex = null;
        form.querySelector('button[type="submit"]').textContent = 'Add Item';
    } else {
        // Add new item
        inventory.push(newItem);
    }

    // Update the inventory table
    updateInventoryTable();

    // Reset the form
    form.reset();
});

// Function to update the inventory table
function updateInventoryTable() {
    // Clear the existing table rows
    inventoryTableBody.innerHTML = '';

    // Loop through the inventory and create rows
    inventory.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${item.totalValue.toFixed(2)}</td>
            <td>
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Delete</button>
            </td>
        `;

        inventoryTableBody.appendChild(row);
    });

    // Save the updated inventory to LocalStorage
    saveInventory();
}

// Function to edit an inventory item
function editItem(index) {
    const item = inventory[index];

    document.getElementById('itemName').value = item.name;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemPrice').value = item.price;

    // Set the edit index
    editIndex = index;

    // Change the submit button text to 'Update Item'
    document.querySelector('button[type="submit"]').textContent = 'Update Item';
}

// Function to delete an item from the inventory
function deleteItem(index) {
    // Remove item from inventory array
    inventory.splice(index, 1);

    // Update the table after deletion
    updateInventoryTable();
}

// Function to filter inventory based on search input
function filterInventory() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredInventory = inventory.filter(item => item.name.toLowerCase().includes(searchTerm));

    inventoryTableBody.innerHTML = '';

    filteredInventory.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${item.totalValue.toFixed(2)}</td>
            <td>
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Delete</button>
            </td>
        `;

        inventoryTableBody.appendChild(row);
    });
}
