function createDesign() {
  const form = document.getElementById('design-form');
  const formData = new FormData(form);
  const subCategoryName = formData.get('subCategoryName');
  formData.delete('subCategoryName');
  const formDataObject = {};
  for (const [key, value] of formData.entries()) {
    formDataObject[key] = value;
  }

  // Get the image file separately
  const imageInput = document.getElementById('image');
  const imageFile = imageInput.files[0];

  // API request with subCategoryName as a query parameter
  const apiUrl = `http://localhost:4040/api/design?subCategoryName=${subCategoryName}`;

  // Create a new FormData object and append the image
  const combinedData = new FormData();
  combinedData.append('image', imageFile);
  combinedData.append('data', new Blob([JSON.stringify(formDataObject)], { type: 'application/json' }));

  // Append the remaining form data to combinedData
  for (var pair of formData.entries()) {
    combinedData.append(pair[0], pair[1]);
  }

  fetch(apiUrl, {
    method: 'POST',
    body: combinedData
  })
    .then(response => {
      if (response.ok) {
        // Handle success
        alert('Design created successfully!');
      } else {
        // Handle error
        alert('Failed to create design');
      }
    })
    .catch(error => {
      console.error('API request error:', error);
    });
}



document.addEventListener("DOMContentLoaded", function () {
  const imageInput = document.getElementById("image");
  const selectedImage = document.getElementById("selectedImage");

  imageInput.addEventListener("change", function () {
    const selectedFile = imageInput.files[0];

    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      selectedImage.src = objectURL;
    } else {
      selectedImage.src = ""; // Clear the image if no file is selected
    }
  });

  // Your existing code here...
});


// Function to suggest subcategories based on user input
let options = []; // Array to store subcategory names
const subCategoryInput = document.getElementById('subCategoryName');

// Fetch the list of subcategory names from the API
fetch('http://localhost:4040/api/subcategory/names', {
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

function filterOptions() {
  const inputText = document.getElementById('subCategoryName').value;

  const regex = new RegExp(inputText, 'i');
  const filteredOptions = options.filter(option => regex.test(option));

  const optionsList = document.getElementById('options-list');
  optionsList.innerHTML = '';

  if (filteredOptions.length > 0) {
    filteredOptions.forEach(option => {
      const optionElement = document.createElement('div');
      optionElement.textContent = option;
      optionElement.addEventListener('click', () => {
        document.getElementById('subCategoryName').value = option;
        optionsList.style.display = 'none';
      });
      optionsList.appendChild(optionElement);
    });
    optionsList.style.display = 'block';
  } else {
    optionsList.style.display = 'none';
  }
}

function showAllOptions() {
  const optionsList = document.getElementById('options-list');
  if (optionsList.style.display === 'none') {
    optionsList.innerHTML = '';
    options.forEach(option => {
      const optionElement = document.createElement('div');
      optionElement.textContent = option;
      optionElement.addEventListener('click', () => {
        document.getElementById('subCategoryName').value = option;
        optionsList.style.display = 'none';
      });
      optionsList.appendChild(optionElement);
    });
    optionsList.style.display = 'block';
  }
}

document.addEventListener('click', (event) => {
  const optionsList = document.getElementById('options-list');
  if (!event.target.matches('#subCategoryName') && !event.target.matches('#options-list div')) {
    optionsList.style.display = 'none';
  }
});