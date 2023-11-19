  const defaultImageUrl = '/image/inventory.jpg';
  const columnWidth = 200;
    function getAllDesigns(){
        loadPage(0);
    }
function displayDesigns(data) {
    const designsList = document.getElementById('designs-list');
    designsList.innerHTML = '';


    if (data.length > 0) {
        data.forEach(design => {
			const dataURL = "data:image/jpeg;base64," + design.image;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="/AddProduct.html?designName=${design.designName}" class="btn">${design.designName}</a></td>
                <td>${design.description}</td>
                <td>${design.creatorName}</td>
                <td><img src=${dataURL} alt="Design Image" class="design-image" style="width: ${columnWidth}px; height: ${columnWidth / 2}px;">
                </td>
            `;
            designsList.appendChild(row);
        });

        // Add click event listeners to design names to display mini image
        const designNameElements = document.querySelectorAll('.design-name');
        designNameElements.forEach(element => {
            element.addEventListener('click', () => displayMiniImage(element));
        });
    } else {
        designsList.innerHTML = '<tr><td col span="4">No designs found.</td></tr>';
    }
}

    // Function to generate pagination links
    function generatePagination(totalPages, currentPage) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        // Add "Previous" button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add('page-link');
        prevButton.addEventListener('click', () => loadPage(currentPage - 1));
        pagination.appendChild(prevButton);

        for (let page = 0; page < totalPages; page++) {
            const pageLink = document.createElement('span');
            pageLink.textContent = page;
            pageLink.classList.add('page-link');
            pageLink.addEventListener('click', () => loadPage(page));
            pagination.appendChild(pageLink);
        }

        // Add "Next" button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add('page-link');
        nextButton.addEventListener('click', () => loadPage(currentPage + 1));
        pagination.appendChild(nextButton);

        // Disable "Previous" button if on the first page
        if (currentPage === 0) {
            prevButton.disabled = true;
        }

        // Disable "Next" button if on the last page
        if (currentPage === totalPages - 1) {
            nextButton.disabled = true;
        }
    }

    // Function to load a specific page
    function loadPage(page) {
        // Make an API request to get designs for the specified page and size
        const pageSize = 5;
        fetch(`http://localhost:4040/api/designs?page=${page}&size=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            // Display the designs for the selected page
            displayDesigns(data.contents);

            // Update pagination with the current page
            generatePagination(data.totalPages, page);
        })
        .catch(error => {
            console.error('API request error:', error);
        });
    }
    function displayMiniImage(designNameElement) {
        const imageName = designNameElement.getAttribute('data-image-name');
        const imageUrl = imageName ? `/image/${imageName}` : defaultImageUrl;
        const miniImage = document.getElementById('mini-design-image');
        miniImage.src = imageUrl;
    }

    // Initial call to display a default image
    displayMiniImage({ getAttribute: () => null }); // Pass an empty object to show the default image

