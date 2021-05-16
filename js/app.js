const resultsList = document.querySelector('.results-list');
const resultCounterElt = document.querySelector('.results-header__counter');
const resultInfoElt = document.querySelector('.results-header__info');
const dropdownElt = document.querySelector('.dropdown');
const dropdownListElt = document.querySelector('.dropdown__list');
const dropdownListItems = document.querySelectorAll('.dropdown__list--item');
const dropdownSelectSpan = document.querySelector('.dropdown__select span');
const dropdownSelectImg = document.querySelector('.dropdown__select img');
const selectSpanElt = document.querySelector('.dropdown__select span');
const searchSpanElt = document.querySelector('.search-span');
const searchInputElt = document.querySelector('#search-input');
const formElt = document.querySelector('.form');
const errorInfoElt = document.querySelector('.error-info');

let parameter = null;


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
        selectSpanElt.setAttribute('data-value', item.getAttribute('data-value'));
        console.log(selectSpanElt.getAttribute('data-value'));
        parameter = selectSpanElt.getAttribute('data-value');
    })
})

function createList(id, artist, title, album, mbid) {
    // Création des éléments
    let newId = document.createElement('p');
    let newArtist= document.createElement('p');
    let newTitle = document.createElement('p');
    let newAlbum = document.createElement('p');
    let newButton = document.createElement('button');
    let newImg = document.createElement('img');
    let newLine = document.createElement('li');
    let newMbid = mbid;
    // Distribution des classes
    newId.classList.add('results-list__item--id');
    newArtist.classList.add('results-list__item--artist');
    newTitle.classList.add('results-list__item--title');
    newAlbum.classList.add('results-list__item--album');
    newButton.classList.add('results-list__item--more');
    newLine.classList.add('results-list__item');
    // Attributs du logo
    newImg.src = 'img/logo_plus.svg';
    newImg.alt = 'logo_plus';
    // Contenu textuel des éléments
    newId.textContent = id;
    newArtist.textContent = artist;
    newTitle.textContent = title;
    newAlbum.textContent = album;
    // Ajout de l'image
    newButton.appendChild(newImg);
    // Nouvelle requête lors du clique sur le bouton
    newButton.addEventListener('click', () => {
        console.log(id + ' mbid :  ' + newMbid);
        lookupRequest(parameter, newMbid);
    })
    // Ajout des éléments
    newLine.appendChild(newId);
    newLine.appendChild(newArtist);
    newLine.appendChild(newTitle);
    newLine.appendChild(newAlbum);
    newLine.appendChild(newButton);
    // Ajout de la nouvelle ligne
    resultsList.insertAdjacentElement('beforeend', newLine);
}

formElt.addEventListener('submit', (e) => {
    // Empêche le comportement par défault de la soumission d'un formulaire
    e.preventDefault();
    let findSpaceRegex = /\W/;
    // Englobe la valeur de l'input entre guillemet si l'utilisateur a rentré plusieurs mots, afin de filtrer plus précisément les résultats de la requête
    let inputValue = findSpaceRegex.test(searchInputElt.value) ? '\"' + searchInputElt.value + '\"' : searchInputElt.value;
    // Si le champs input n'est pas vide
    if (inputValue.length > 0) {
        // Si l'utilisateur a sélectionné un type de recherche
        if (selectSpanElt.hasAttribute('data-value')) {
            // Montre ou cache les éléments d'informations
            errorInfoElt.textContent = '';
            resultCounterElt.style.display = 'block';
            resultInfoElt.style.display = 'none';
            // Vide resultList a chaque soumission de formulaire pour afficher les nouveaux résultats de la requête
            while (resultsList.hasChildNodes()) {
                resultsList.firstChild.remove();
            }
            if (selectSpanElt.getAttribute('data-value') === 'all') {
                searchAllTypesRequest(encodeURIComponent(inputValue));
            } else {
                searchRequest(parameter, encodeURIComponent(inputValue));
            }
            console.log(encodeURIComponent(inputValue));
            console.log(inputValue);
        } else {
            errorInfoElt.textContent = 'Please select your type of search.';
        }
    } else {
        errorInfoElt.textContent = 'Please enter something to search.';
    }
})

function searchRequest(parameter, value) {
    let request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
        // Si l'opération de récupération est terminée
        if (request.readyState === XMLHttpRequest.DONE) {
            // Si la requête a été effectué avec succès
            if (request.status === 200) {
                // Conversion des données JSON en données interprétables par le Javascript
                let response = JSON.parse(request.response);
                console.log(response);
                // Affiche le nombre de résultats trouvés
                resultCounterElt.textContent = response.count + ' results';
                // Si aucun résultat n'est trouvé
                if (response.count === 0) {
                    // Affiche les infos a l'utilisateur
                    resultInfoElt.style.display = 'block';
                    resultInfoElt.textContent = 'There is no result for your request.';
                } else {
                    // Si non lance la fonction createList pour chaque éléments du tableau recordings 
                    response.recordings.forEach((element, index) => {
                        createList(
                            index + 1,
                            element['artist-credit'][0].name,
                            element.title,
                            element.releases ? element.releases[0].title : '',
                            element.id
                        );
                    });
                }
            } else {
                console.error('Error !');
            }
        }
    })
    request.open('GET', `http://musicbrainz.org/ws/2/recording/?query=${parameter}:${value}&fmt=json&limit=100&offset=0`);
    request.send();
}

function searchAllTypesRequest(value) {
    let request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
        //console.log(request.readyState); 
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                // Conversion des données JSON en données interprétables par le Javascript
                let response = JSON.parse(request.response);
                console.log(response);
                resultCounterElt.textContent = response.count + ' results';
                response.recordings.forEach((element, index) => {
                    createList(
                        index + 1,
                        element['artist-credit'][0].name,
                        element.title,
                        element.releases ? element.releases[0].title : '',
                        element.id
                    );
                });
            } else {
                console.error('Error !');
            }
        }
    })
    request.open('GET', `http://musicbrainz.org/ws/2/recording/?query=release:${value}artist:${value}recording:${value}&fmt=json&limit=100&offset=0`);
    request.send();
}

//searchAllTypesRequest();

function lookupRequest(mbid) {
    let request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
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
    request.open('GET', `https://musicbrainz.org/ws/2/recording/${mbid}?inc=artists+releases&fmt=json`);
    request.send(); 
}

function lookupRequestTest(parameter, mbid) {
    let request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
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
    request.open('GET', `https://musicbrainz.org/ws/2/${parameter}/${mbid}?inc=artists+releases+discids+ratings&fmt=json`);
    request.send(); 
}

//lookupRequestTest('recording', '27af3d46-6f52-456d-96cb-b18ad379a939');


