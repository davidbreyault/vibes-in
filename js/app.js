const resultsList = document.querySelector('.results-list');
const dropdownElt = document.querySelector('.dropdown');
const dropdownListElt = document.querySelector('.dropdown__list');
const dropdownListItems = document.querySelectorAll('.dropdown__list--item');
const dropdownSelectSpan = document.querySelector('.dropdown__select span');
const dropdownSelectImg = document.querySelector('.dropdown__select img');
const searchSpanElt = document.querySelector('.search-span');
const searchInputElt = document.querySelector('#search-input');
const formElt = document.querySelector('.form');
let searchType = null;

function manageClass(element) {
    // Si l'argument le second paramètre est à true, ajoute cette classe, si non, supprime la.
    element.classList.toggle('translate', searchInputElt.value.length > 0);
}

// Fait apparaitre les options 
dropdownElt.addEventListener('click', () => {
    dropdownListElt.classList.toggle('dropdown__list--hidden');
    dropdownSelectImg.classList.toggle('rotate');

})

// Remplace le contenu textuel dans le dropdown 
dropdownListItems.forEach((option) => {
    option.addEventListener('click', () => {
        dropdownSelectSpan.textContent = option.textContent;
    }) 
})

// Transition du span lors du focus de l'input de recherche
searchInputElt.addEventListener('focus', () => {
    searchSpanElt.classList.add('translate');
})

// Transition du span lors de la perte du focus seulement si l'input est vide
searchInputElt.addEventListener('blur', () => {
    searchSpanElt.classList.remove('translate');
    manageClass(searchSpanElt);
})

dropdownListItems.forEach((item) => {
    item.addEventListener('click', () => {
        searchType = item.getAttribute('data-value');
        //console.log(item.getAttribute('data-value'));
    })
})

function createList(id, artist, title, album) {
    // Elements creation
    let newId = document.createElement('p');
    let newArtist= document.createElement('p');
    let newTitle = document.createElement('p');
    let newAlbum = document.createElement('p');
    let newButton = document.createElement('button');
    let newImg = document.createElement('img');
    let newLine = document.createElement('li');
    // Classes distribution
    newId.classList.add('results-list__item--id');
    newArtist.classList.add('results-list__item--artist');
    newTitle.classList.add('results-list__item--title');
    newAlbum.classList.add('results-list__item--album');
    newButton.classList.add('results-list__item--more');
    newLine.classList.add('results-list__item');
    // Image attribute
    newImg.src = 'img/logo_plus.svg';
    newImg.alt = 'logo_plus';
    // Elements text
    newId.textContent = id;
    newArtist.textContent = artist;
    newTitle.textContent = title;
    newAlbum.textContent = album;
    // Append button element
    newButton.appendChild(newImg);
    // Append elements
    newLine.appendChild(newId);
    newLine.appendChild(newArtist);
    newLine.appendChild(newTitle);
    newLine.appendChild(newAlbum);
    newLine.appendChild(newButton);
    // Append this new line
    resultsList.insertAdjacentElement('beforeend', newLine);
}

formElt.addEventListener('submit', (e) => {
    e.preventDefault();
    let searchValue = searchInputElt.value;
    let request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
        //console.log(request.readyState); 
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                // Conversion des données JSON en données interprétables par le Javascript
                let response = JSON.parse(request.response);
                console.log(response);
                
            } else {
                console.error('Error !');
            }
        }
    })

    request.open('GET', `https://musicbrainz.org/ws/2/${searchType}?query=${searchValue}&fmt=json`);
    request.send();
})


/*
let request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
        //console.log(request.readyState); 
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                // Conversion des données JSON en données interprétables par le Javascript
                let response = JSON.parse(request.response);
                console.log(response);
                
            } else {
                console.error('Error !');
            }
        }
    })
//request.open('GET', 'https://musicbrainz.org/ws/2/recording?query=%22we%20will%20rock%20you%22%20AND%20arid:0383dadf-2a4e-4d10-a46a-e9e041da8eb3&fmt=json');
//request.open('GET', `https://musicbrainz.org/ws/2/release?query=${encodeURIComponent('Miranda Shvangiradze')}&fmt=json&inc=recordings+artist`);
request.open('GET', `https://musicbrainz.org/ws/2/artist?query=odezenne&fmt=json`);
request.send();
*/





