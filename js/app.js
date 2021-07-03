// Eléments du formulaire
const formElt = document.querySelector('.form');
const dropdownElt = document.querySelector('.dropdown');
const dropdownListElt = document.querySelector('.dropdown__list');
const dropdownListItems = document.querySelectorAll('.dropdown__list--item');
const dropdownSelectSpan = document.querySelector('.dropdown__select span');
const dropdownSelectImg = document.querySelector('.dropdown__select img');
const selectSpanElt = document.querySelector('.dropdown__select span');
const searchSpanElt = document.querySelector('.search-span');
const searchInputElt = document.querySelector('#search-input');
const errorInfoElt = document.querySelector('.error-info');
// Eléments de la liste de résultats
const resultsList = document.querySelector('.results-list');
const resultCounterElt = document.querySelector('.results-header__counter');
const resultInfoElt = document.querySelector('.results-header__info');
// Eléments de la modale
const modalElt = document.querySelector('.modal');
const closeModalButton = document.querySelector('.close-modal__cross');
const modalInfoHeader = document.querySelector('.modal__header p');
const modalInfoTitle = document.querySelector('.modal__infos .title');
const modalInfoArtist = document.querySelector('.modal__infos .artist');
const modalInfoAlbum = document.querySelector('.modal__infos .album');
const modalInfoGenre = document.querySelector('.modal__infos .genre');
const modalInfoYear = document.querySelector('.modal__infos .year');
const modalInfoCountry = document.querySelector('.modal__infos .country');
const modalInfoLength = document.querySelector('.modal__infos .length');
const coversZoneElt = document.querySelector('.covers');
const starsRating = document.querySelectorAll('.star');

let parameter = null;
let offset = 0;
let cumulOffset = 0;
let covers;

// Transition du span du label lors du focus de l'input de recherche
searchInputElt.addEventListener('focus', () => {
    searchSpanElt.classList.add('translate');
})

// Transition du span du label lors de la perte du focus seulement si l'input est vide
searchInputElt.addEventListener('blur', () => {
    searchSpanElt.classList.remove('translate');
    manageClass(searchSpanElt);
})

// Gestion du mouvement du span du label de l'input de recherche
function manageClass(element) {
    // Si le second paramètre est à true, ajoute cette classe, si non, supprime la.
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

// Assignation de la variable parameter pour customiser l'URL de la future requête 
dropdownListItems.forEach((item) => {
    item.addEventListener('click', () => {
        selectSpanElt.setAttribute('data-value', item.getAttribute('data-value'));
        parameter = selectSpanElt.getAttribute('data-value');
    })
})

// Contrôle la longueur de la chaine de caractères
function limitCharacterLength(string, stringLength) {
    let newString = string.length > stringLength 
        ? string.slice(0, stringLength - 3).concat('...')
        : string;
    return newString;
}

// Interdiction du scroll sur le body si la modale est ouverte
function scrollManager() {
    modalElt.classList.contains('open')
        ? document.body.style.overflow = 'hidden'
        : document.body.style.overflow = 'scroll';
}

// Création d'une ligne de données
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
    // bouton
    let newButton = document.createElement('button');
    let newImgButton = document.createElement('img');
    let newLine = document.createElement('li');
    let newTitleMbid = mbid;
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
    // bouton
    newButton.appendChild(newImgButton);
    // Lors du clique sur le bouton
    newButton.addEventListener('click', () => {
        //console.log(id + ' mbid :  ' + newTitleMbid);
        covers = 0;
        // Ouverture de la fenêtre modale
        modalElt.classList.add('open');
        // Scroll uniquement dans la modale
        scrollManager();
        // Utilisation du innerHTML dans ce cas précis, afin de vider l'intégrité du contenu de l'élément
        coversZoneElt.innerHTML = '';
        // Lancement d'une nouvelle requête pour récupérer les infos spécifiques et associées au titre en question
        lookupRequest(newTitleMbid, printDataInModal);
        // Lancement de la roulette de chargement
        createSpinnerLoader(coversZoneElt);
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

// Création de la roulette de chargement
function createSpinnerLoader(location) {
    let newLoadingWheel = document.createElement('div');
    newLoadingWheel.classList.add('loader');
    location.appendChild(newLoadingWheel);
}

// Création du bouton qui affichera les résultats suivants
function createShowMoreButton() {
    let showMoreButton = document.createElement('button');
    showMoreButton.textContent = 'More results';
    showMoreButton.classList.add('show-more-button');
    // Lors du clique sur le nouveau bouton
    showMoreButton.addEventListener('click', (e) => {
        // Supression de ce dernier
        e.target.remove();
        // Création du spinner de chargement
        createSpinnerLoader(resultsList);
    })
    resultsList.appendChild(showMoreButton);
}

// Pour chaque nouvelle recherche
formElt.addEventListener('submit', (e) => {
    // Empêche le comportement par défault de la soumission d'un formulaire
    e.preventDefault();
    // Réinitialise le offset à zéro à chaque nouvelle recherche
    offset = 0;
    cumulOffset = 0;
    covers = 0;
    // Si l'utilisateur a rentré plusieurs mots, englobe la valeur de l'input entre guillemets, afin de filtrer plus précisément les résultats de la requête
    let findSpaceRegex = /\W/;
    let inputValue = findSpaceRegex.test(searchInputElt.value) 
        ? '\"' + searchInputElt.value + '\"' 
        : searchInputElt.value;
    // Si le champs de recherche n'est pas vide
    if (inputValue.length > 0) {
        // Si l'utilisateur a sélectionné un type de recherche
        if (selectSpanElt.hasAttribute('data-value')) {
            // Montre ou cache les éléments d'informations
            errorInfoElt.textContent = '';
            resultCounterElt.style.display = 'block';
            resultInfoElt.style.display = 'none';
            // Vide 'resultList' a chaque soumission de formulaire pour afficher les nouveaux résultats de la requête
            while (resultsList.hasChildNodes()) {
                resultsList.firstChild.remove();
            }
            // Création du loader de chargement
            createSpinnerLoader(resultsList);
            // Lancement de la requête
            searchRequest(parameter, encodeURIComponent(inputValue));
        } else {
            errorInfoElt.textContent = 'Please select your type of search.';
        }
    } else {
        errorInfoElt.textContent = 'Please enter something to search.';
    }
})

// GET Search Request : /<ENTITY_TYPE>?query=<QUERY>&limit=<LIMIT>&offset=<OFFSET>
function searchRequest(parameter, value) {
    let request = new XMLHttpRequest();
    // Construction de l'url en fonction de ce que recherche l'utilisateur
    let URL = selectSpanElt.getAttribute('data-value') !== 'all'
        ? `https://musicbrainz.org/ws/2/recording/?query=${parameter}:${value}&fmt=json&limit=50&offset=${offset}`
        : `https://musicbrainz.org/ws/2/recording/?query=release:${value}%20OR%20artist:${value}%20OR%20recording:${value}&fmt=json&limit=50&offset=${offset}`;
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
                    response.recordings.map((element, index) => {
                        createList(
                            response.offset + index + 1,
                            limitCharacterLength(element['artist-credit'][0].name, 25),
                            limitCharacterLength(element.title, 38),
                            element.releases ? limitCharacterLength(element.releases[0].title, 38) : '',
                            element.id
                        );
                    });
                    // Incrémente le cumul
                    cumulOffset += response.recordings.length;
                    // S'il reste encore des résultat à afficher
                    if (cumulOffset < response.count) {
                        // Création d'un bouton pour afficher plus de résultats
                        createShowMoreButton();
                        // Incrémentation de l'offset
                        offset = response.offset + 50;
                        // Lors du clique sur le bouton précedemment crée
                        document.querySelector('.show-more-button').addEventListener('click', () => {
                            // Laisse passer une seconde pour bien apercevoir le spinner
                            setTimeout(() => {
                                // Récursivité : envoie de la nouvelle requête pour récupérer les données suivantes 
                                searchRequest(parameter, value);
                            }, 1000);
                        })
                    }
                }
            }
        }
    })
    request.open('GET', URL);
    request.send();
}

// GET lookup Request : /<ENTITY_TYPE>/<MBID>?inc=<INC>
function lookupRequest(mbid, callback) {
    let request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                // Conversion des données JSON en données interprétables par le Javascript
                let response = JSON.parse(request.response);
                callback(response);
            }
        }
    })
    request.open('GET', `https://musicbrainz.org/ws/2/recording/${mbid}?inc=artists+releases+ratings+release-groups+genres&fmt=json`);
    request.send(); 
}

// Fonction de callback qui sera executée suite au succès de la lookup Request
function printDataInModal(response) {
    modalInfoHeader.textContent = response['artist-credit'][0].name + ' - ' + response.title;
    modalInfoTitle.textContent = response.title;
    modalInfoArtist.textContent = response['artist-credit'][0].name;
    // Affichage de l'album
    const {releases} = response;
    let listAlbum = '';
    if (releases.length > 0) {
        releases.map(element => {
            listAlbum += (releases.indexOf(element) === releases.length - 1)
                ? element.title
                : element.title.concat('   -   ');
        })
    } else {
        listAlbum = ' /';
    }
    modalInfoAlbum.textContent = listAlbum;
    // Affichage du pays d'origine
    response.releases[0].country
        ? modalInfoCountry.textContent = response.releases[0].country
        : ' /';
    // Affichage de la date
    response['first-release-date'] 
        ? modalInfoYear.textContent = response['first-release-date'].slice(0, 4) 
        : ' /';
    // Affichage des genres s'ils sont renseignés
    let genres = '';
    let dataGenres = response['artist-credit'][0].artist.genres;
    if (dataGenres.length > 0) {
        dataGenres.map((element) => {
            genres += (dataGenres.indexOf(element) === dataGenres.length - 1)
                ? element.name.charAt(0).toUpperCase() + element.name.slice(1)
                : element.name.charAt(0).toUpperCase() + element.name.slice(1).concat(', ');
        })
    } else {
        genres = ' /';
    }
    modalInfoGenre.textContent = genres;
    // Traitement et affichage de la durée
    modalInfoLength.textContent = response.length === null ? ' /' : convertLengthTitle(response.length);
    // Traitement des notes
    response.rating.value !== null
        ? ratingSystem(response.rating.value)
        : hideRatings();
    // Récupération des id de tout les albums
    response.releases.map(album => {
        // Lancement de la requête pour récupérer les covers
        lookupRequestCover(album.id);
    })
    setTimeout(() => {
        if (covers === 0) {
            coversZoneElt.textContent = 'Aucune pochette d\'album disponible.'
        }
    }, 5000);
}

// Transformation de la durée au format 'MM:SS'
function convertLengthTitle(number) {
    // Convertion en minute de la durée exprimée en milliseconde
    let time = (Math.floor(number / 1000) / 60).toString();
    // Trouve au moins un chiffre, puis un point, puis un ou plusieurs chiffres 
    let regex = /^(\d{1,})\.(\d{1,})$/;
    // Regroupe minutes et secondes
    let groupMinutesSeconds = time.match(regex);
    // Récupération des minutes dans le tableau 'groupMinutesSeconds'
    let minutes = groupMinutesSeconds[1].padStart(2, '0');
    // Traitement des secondes
    let seconds = (Math.round(number / 1000) % 60).toString().padStart(2, '0');
    // Retourne l'affichage adéquat de la durée
    return minutes + ' : ' + seconds;
}

// Affichage dynamique des jaquettes d'album dans le DOM
function printCovers(url) {
    if (url === undefined) {
        return;
    } else {
        let newCover = document.createElement('img');
        newCover.src = url;
        newCover.alt = 'Album cover';
        coversZoneElt.appendChild(newCover);
        covers++;
    }
}

// Fermeture de la fenêtre modale lors du clique sur le bouton prévu à cet effet
closeModalButton.addEventListener('click', () => {
    modalElt.classList.remove('open');
    scrollManager();
})

// GET Covers Request
function lookupRequestCover(mbid) {
    let request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                // Conversion des données JSON en données interprétables par le Javascript
                let response = JSON.parse(request.response);
                // Suppression du loader de chargement s'il existe
                if (document.querySelector('.loader') !== null) {
                    document.querySelector('.loader').remove();
                }
                // Pour chaque images présente dans le tableau
                response.images.map(item => {
                    // Affiche l'image en question
                    if (item.thumbnails['250']) {
                        printCovers(item.thumbnails['250']);
                    } else if (item.thumbnails.small) {
                        printCovers(item.thumbnails.small);
                    } else if (item.image) {
                        printCovers(item.image);
                    }
                });
            } else {
                console.error('Aucune cover d\'album n\'a pu être trouvé avec cet mbid');
            }
        }
    });
    request.open('GET', `https://coverartarchive.org/release/${mbid}`);
    request.send(); 
}



// Gestion des étoiles en fonction de la note
function ratingSystem(rating) {
    const root = document.querySelector(':root');
    let regex = /^(\d)\.(\d{1,})$/;

    // Affichage des étoiles
    starsRating.forEach(star => {
        star.style.display = 'block';
        star.classList.remove('decimal');
    });

    // Si la note est un nombre entier
    if (!regex.test(rating)) {
        // Coloration des étoiles
        colorStars(rating);
    } else {
        // Séparation de l'entier et du décimal
        let ratingValues = rating.toString().match(regex);
        let integer = ratingValues[1];
        let decimal = ratingValues[2];
        // Coloration des étoiles pleines
        colorStars(integer);
        // Ajout de la classe 'décimal' sur l'étoile qui ne doit pas être remplie entièrement
        starsRating[integer].classList.add('decimal');
        // Attribution de la largeur à coloriser
        let widthValue = decimal < 10 ? decimal * 10 : decimal;
        // Changement dynamique du remplissage de l'étoile
        root.style.setProperty('--pseudo-width', widthValue + '%');
    }
}

// Remplissage des étoiles
function colorStars(note) {
    starsRating.forEach((star, index) => {
        // Si l'unité de la note est supérieure ou égale à son étoile correspondante
        if (note >= index + 1) {
            // Coloration de l'étoile
            star.style.backgroundColor = '#ff4b23';
        }
    });
}

// Cache les étoiles si la note n'est pas définie
function hideRatings() {
    starsRating.forEach(star => {star.style.display = 'none';});
}