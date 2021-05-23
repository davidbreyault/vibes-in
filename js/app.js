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
let offset = 0;
let cumulOffset = 0;

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

function limitCharacterLength(string) {
    let stringLength = 38;
    let newString = string.length > stringLength 
        ? string.slice(0, stringLength - 3).concat('...')
        : string;
    return newString;
}

function createList(id, artist, title, album, mbid) {
    // Création des éléments
    let newId = document.createElement('p');
    let newIdImg = document.createElement('img');
    let newIdSpan = document.createElement('span');
    // Artiste
    let newArtist= document.createElement('p');
    let newArtistImg = document.createElement('img');
    let newArtistSpan = document.createElement('span');
    // Titre
    let newTitle = document.createElement('p');
    let newTitleImg = document.createElement('img');
    let newTitleSpan = document.createElement('span');
    // Album
    let newAlbum = document.createElement('p');
    let newAlbumImg = document.createElement('img');
    let newAlbumSpan = document.createElement('span');
    // Boutton
    let newButton = document.createElement('button');
    let newImgButton = document.createElement('img');
    let newLine = document.createElement('li');
    let newMbid = mbid;
    // Distribution des classes
    newId.classList.add('results-list__item--id');
    newArtist.classList.add('results-list__item--artist');
    newTitle.classList.add('results-list__item--title');
    newAlbum.classList.add('results-list__item--album');
    newButton.classList.add('results-list__item--more');
    newLine.classList.add('results-list__item');
    // Attributs des logos
    newIdImg.src = 'img/icon-hashtag.svg';
    newIdImg.alt = 'id_hashtag';
    newArtistImg.src = 'img/icon-artist.svg';
    newArtistImg.alt = 'artist_icon';
    newTitleImg.src = 'img/icon-music-note.svg';
    newTitleImg.alt = 'title_icon';
    newAlbumImg.src = 'img/icon-disc.svg';
    newAlbumImg.alt = 'album_icon';
    newImgButton.src = 'img/icon-plus.svg';
    newImgButton.alt = 'plus_icon';
    // Contenu textuel des éléments
    newIdSpan.textContent = id;
    newArtistSpan.textContent = artist;
    newTitleSpan.textContent = title;
    newAlbumSpan.textContent = album;
    // Ajout images et span
    newId.appendChild(newIdImg);
    newId.appendChild(newIdSpan);
    newArtist.appendChild(newArtistImg);
    newArtist.appendChild(newArtistSpan);
    newTitle.appendChild(newTitleImg);
    newTitle.appendChild(newTitleSpan);
    newAlbum.appendChild(newAlbumImg);
    newAlbum.appendChild(newAlbumSpan);
    // Boutton
    newButton.appendChild(newImgButton);
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

function createSpinnerLoader() {
    let newLoadingWheel = document.createElement('div');
    newLoadingWheel.classList.add('loader');
    resultsList.appendChild(newLoadingWheel);
}

function createShowMoreButton() {
    let showMoreButton = document.createElement('button');
    showMoreButton.textContent = 'More results';
    showMoreButton.classList.add('show-more-button');
    resultsList.appendChild(showMoreButton);
}

formElt.addEventListener('submit', (e) => {
    // Empêche le comportement par défault de la soumission d'un formulaire
    e.preventDefault();
    // Réinitialise offset à zéro à chaque nouvelle recherche
    offset = 0;
    cumulOffset = 0;
    // Si l'utilisateur a rentré plusieurs mots, englobe la valeur de l'input entre guillemets, afin de filtrer plus précisément les résultats de la requête
    let findSpaceRegex = /\W/;
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
            createSpinnerLoader();
            searchRequest(parameter, encodeURIComponent(inputValue));
        } else {
            errorInfoElt.textContent = 'Please select your type of search.';
        }
    } else {
        errorInfoElt.textContent = 'Please enter something to search.';
    }
})

function searchRequest(parameter, value) {
    let request = new XMLHttpRequest();
    // Construction de l'url en fonction de ce que recherche l'utilisateur
    let URL = selectSpanElt.getAttribute('data-value') !== 'all'
        ? `http://musicbrainz.org/ws/2/recording/?query=${parameter}:${value}&fmt=json&limit=50&offset=${offset}`
        : `http://musicbrainz.org/ws/2/recording/?query=release:${value}artist:${value}recording:${value}&fmt=json&limit=50&offset=${offset}`;
    // Lorsque l'état de chargement du protocole change
    request.addEventListener('readystatechange', () => {
        // Si l'opération de récupération est terminée
        if (request.readyState === XMLHttpRequest.DONE) {
            // Si la requête a été effectué avec succès
            if (request.status === 200) {
                // Suppression du loader de chargement s'il existe
                if (document.querySelector('.loader') !== null) {
                    document.querySelector('.loader').remove();
                }
                // Conversion des données JSON en données interprétables par le Javascript
                let response = JSON.parse(request.response);
                console.log(response);
                // Affiche le nombre de résultats trouvés
                let plurial = response.count > 1 ? 's' : '';
                resultCounterElt.textContent = response.count + ' result' + plurial;
                // Si aucun résultat n'est trouvé
                if (response.count === 0) {
                    // Affiche les infos a l'utilisateur
                    resultInfoElt.style.display = 'block';
                    resultInfoElt.textContent = 'There is no result for your request.';
                } else {
                    // Si non lance la fonction createList pour chaque éléments du tableau recordings 
                    response.recordings.forEach((element, index) => {
                        createList(
                            response.offset + index + 1,
                            limitCharacterLength(element['artist-credit'][0].name),
                            limitCharacterLength(element.title),
                            element.releases ? limitCharacterLength(element.releases[0].title) : '',
                            element.id
                        );
                    });
                    // Incrémente le cumul
                    cumulOffset += response.recordings.length;
                    // S'il reste encore des résultat à afficher
                    if (cumulOffset < response.count) {
                        // Création d'un boutton pour afficher plus de résultats
                        createShowMoreButton();
                        // Incrémentation de l'offset
                        offset = response.offset + 50;
                        // Lors du clique sur le bouton précedemment crée
                        document.querySelector('.show-more-button').addEventListener('click', (e) => {
                            // Supression de ce dernier, pour laisser place au spinner de chargement
                            e.target.remove();
                            createSpinnerLoader();
                            // Laisse passer une seconde pour bien apercevoir le spinner
                            setTimeout(() => {
                                // Envoie de la nouvelle requête pour récupérer les données suivantes
                                searchRequest(parameter, value);
                            }, 1000);
                        })
                    }
                }
            } else {
                console.error('Error !');
            }
        }
    })
    request.open('GET', URL);
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
    request.open('GET', `https://musicbrainz.org/ws/2/${parameter}/${mbid}?inc=artists+releases&fmt=json`);
    request.send(); 
}

//lookupRequestTest('recording', '34d2d331-d96b-4008-b8b2-d194c9cbf810');