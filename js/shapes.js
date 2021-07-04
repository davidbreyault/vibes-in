const containerDiv = document.querySelector('.hero__landing');

function createBokehCircle() {

    let colors = ['#ff6767', '#505158', '#ff6744', '#ff4b23'];
    let sizes = [7, 9, 11];
    let yTop = Math.floor(Math.random() * window.innerHeight);
    let xLeft = Math.floor(Math.random() * window.innerWidth);
    let dimension = sizes[Math.floor(Math.random() * sizes.length)];
    // Création du cercle
    let circle = document.createElement('div');
    circle.classList.add('circle');
    // Positionnement aléatoire du cercle dans son conteneur
    circle.style.top = yTop + 'px';
    circle.style.left = xLeft + 'px';
    // Attribution d'une couleur et d'une taille aléatoire parmi les valeurs définies dans les tableaux ci-dessus
    circle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    circle.style.width = dimension + 'rem';
    circle.style.height = dimension + 'rem';
    // Ajout du cercle dans le DOM
    containerDiv.appendChild(circle);
    setTimeout(() => {
        circle.remove();
    }, 6000);
}

// Création de 2 cercles toutes les 500 millisecondes
setInterval(() => {
    let multiplicator = window.innerWidth > 992 ? 2 : 1;
    for (let i = 0; i < multiplicator; i++) {
        createBokehCircle();
    }
}, 500);

