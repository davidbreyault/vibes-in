const btnScrollToTop = document.querySelector('#btn-scroll-top');

window.addEventListener('scroll', () => {
    btnScrollToTop.style.display = window.pageYOffset >= 1000 ? 'flex' : 'none';
})

btnScrollToTop.addEventListener('click', (e) => {
    window.scrollTo({
        top: 825,
        left:0,
        behavior:"smooth"
    });
})