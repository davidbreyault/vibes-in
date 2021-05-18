const btnScrollToTop = document.querySelector('#btn-scroll-top');

window.addEventListener('scroll', () => {
    btnScrollToTop.style.display = window.pageYOffset >= 400 ? 'flex' : 'none';
})

btnScrollToTop.addEventListener('click', (e) => {
    window.scrollTo({
        top:00,
        left:0,
        behavior:"smooth"
    });
    console.log(e.target);
})