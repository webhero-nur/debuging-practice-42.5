const loadPhones = async (searchText, dataLimit) => {
    if (searchText === '' || searchText.toLowerCase() === 'all') {
        searchText = 'a';
    }
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`
    const res = await fetch(url);
    const data = await res.json();
    displayPhones(data.data, dataLimit);
}

const displayPhones = (phones, dataLimit) => {
    const phonesContainer = document.getElementById('phones-container');
    phonesContainer.textContent = '';
    // display 10 phones only 
    const showAll = document.getElementById('show-all');
    if (dataLimit && phones.length > 10) {
        phones = phones.slice(0, 10);
        showAll.classList.remove('d-none');
    }
    else {
        showAll.classList.add('d-none');
    }


    // display no phones found
    const noPhone = document.getElementById('no-found-message');
    if (phones.length === 0) {
        noPhone.classList.remove('d-none');
    }
    else {
        noPhone.classList.add('d-none');
    }
    // display all phones
    phones.forEach(phone => {
        const phoneDiv = document.createElement('div');
        phoneDiv.classList.add('col');
        // console.log(phone);
        phoneDiv.innerHTML = `
        <div class="card p-4">
            <img src="${phone.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${phone.phone_name}</h5>
                <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <button onclick="loadPhoneDetails('${phone.slug}')" href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#phoneDetailModal">Show Details</button>
                
            </div>
        </div>
        `;
        phonesContainer.appendChild(phoneDiv);
    });
    // stop spinner or loader
    toggleSpinner(false);
}

const processSearch = (dataLimit) => {
    toggleSpinner(true);
    const searchField = document.getElementById('search-field');
    const searchText = searchField.value;
    loadPhones(searchText, dataLimit);
}

// handle search button click
document.getElementById('btn-search').addEventListener('click', function () {
    // start loader
    processSearch(10);
})

// search input field enter key handler
document.getElementById('search-field').addEventListener('keypress', function (e) {
    if (e.key === 'enter') {
        processSearch(10);
    }
});

const toggleSpinner = isLoading => {
    const loaderSection = document.getElementById('loader');
    if (isLoading) {
        loaderSection.classList.remove('d-none')
    }
    else {
        loaderSection.classList.add('d-none');
    }
}


// not the best way to load show All
document.getElementById('btn-show-all').addEventListener('click', function () {
    processSearch(0);
})

const loadPhoneDetails = async id => {
    const url = `https://openapi.programming-hero.com/api/phone/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayPhoneDetails(data.data);
}

const displayPhoneDetails = device => {
    // console.log(phone);
    const modalTitle = document.getElementById('phoneDetailModalLabel');
    modalTitle.innerText = device.name;
    const phoneDetails = document.getElementById('phone-details');
    phoneDetails.innerHTML = `
        <div class="card mx-auto" style="width: 95%">
            <img src="${device.image}" class="card-img-top" alt="Picture of ${device.name}">
            <div class="card-body">
                <h5 class="card-title text-center">Brand: <strong class="text-info">${device.brand}</strong></h5>
                <p>Release Date: <strong>${device.releaseDate}</strong></p>
                <p>Storage: <strong>${device?.mainFeatures?.storage}</strong></p>
                <p>Bluetooth: <strong>${device.others ? device.others.Bluetooth : '<span class="text-black-50">No Bluetooth Information</span>'}</strong></p>
                <p>Sensor: <strong>${device.mainFeatures.sensors ? device.mainFeatures.sensors[0] : 'no sensor'}</strong></p>
            </div>
        </div>
    `
}

loadPhones('a', 10);