const apiEndpoint = 'http://localhost:4040/api/product-list';
const designNamesEndpoint = 'http://localhost:4040/api/design/names';

async function addProduct() {
    const dn = document.getElementById("designName").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const currentCost = parseFloat(document.getElementById("currentCost").value);
    const sizeName = document.getElementById("sizeName").value;
    const color = document.getElementById("color").value;

    if (!designName || !quantity || !currentCost || !sizeName || !color) {
        alert("All fields are required!");
        return;
    }

    if (isNaN(quantity) || quantity < 1) {
        alert("Quantity must be a positive integer!");
        return;
    }

    if (isNaN(currentCost) || currentCost <= 0) {
        alert("Cost must be a positive number!");
        return;
    }


    const productData = {
        quantity: quantity,
        cost: currentCost,
        designName: dn,
        size: {
            sizeName: sizeName,
        },
        color: color,
    };
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if (response.status >= 200 && response.statusn<300) {
            alert("Product created successfully!");
            document.getElementById("designName").value = "";
            document.getElementById("quantity").value = "";
            document.getElementById("currentCost").value = "";
            document.getElementById("sizeName").value = "";
        } else {
            alert("Failed to create the product. Please try again.");
        }
    } catch (error) {
        alert("An error occurred while sending the request.");
        console.error(error);
    }

}


// Function to fetch design names
async function fetchDesignNames() {
    try {
        const response = await fetch(designNamesEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to fetch design names');
        }
    } catch (error) {
        console.error('Error fetching design names:', error);
        return [];
    }
}

// Function to show design name options
function showAllOptions() {
    const optionsList = document.getElementById('options-list');
    if (optionsList.style.display === 'none') {
        optionsList.innerHTML = '';
        options.forEach(option => appendOptionElement(option, optionsList));
        optionsList.style.display = 'block';
    }
}

// Function to append an option element to the options list
function appendOptionElement(option, optionsList) {
    const optionElement = document.createElement('div');
    optionElement.textContent = option;
    optionElement.addEventListener('click', () => {
        document.getElementById('designName').value = option;
        optionsList.style.display = 'none';
    });
    optionsList.appendChild(optionElement);
}

// Function to filter options based on user input
function filterOptions() {
    const inputText = document.getElementById('designName').value;

    const regex = new RegExp(inputText, 'i');
    const filteredOptions = options.filter(option => regex.test(option));

    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = '';

    if (filteredOptions.length > 0) {
        filteredOptions.forEach(option => {
            appendOptionElement(option, optionsList);
        });
        optionsList.style.display = 'block';
    } else {
        optionsList.style.display = 'none';
    }
}

// Function to suggest subcategories based on user input
let options = []; // Array to store subcategory names

fetch(designNamesEndpoint, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json())
    .then(data => {
        options = data; // Store subcategory names in the array
    })
    .catch(error => {
        console.error('API request error:', error);
    });
document.getElementById('designName').addEventListener('focus', function () {
    showAllOptions();
});


document.addEventListener('click', (event) => {
    const optionsList = document.getElementById('options-list');
    if (!event.target.matches('#subCategoryName') && !event.target.matches('#options-list div')) {
        optionsList.style.display = 'none';
    }
});


function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Extract the designName parameter from the URL and set it as the value of the input field
const designName = getURLParameter('designName');
const designNameInput = document.getElementById('designName');
if (designNameInput && designName) {
    designNameInput.value = designName;
}