animateElements({
    container: 'catalog-advantage-variant10',
    element: 'img-container',
    classAnimEnd: 'backInLeft'
});

animateElements({
    container: 'catalog-advantage-variant11',
    element: 'item',
    classAnimEnd: 'fadeIn'
});

animateElements({
    container: 'catalog-advantage-variant11',
    element: 'img-container',
    classAnimEnd: 'backInLeft'
});

animateElements({
    container: 'catalog-advantage-variant10',
    element: 'item',
    classAnimEnd: 'fadeIn'
});

animateElements({
    container: 'catalog-advantage-variant12',
    element: 'item',
    classAnimStart: 'animate-item2-start',
    classAnimEnd: 'animate-item2-end'
});

animateElements({
    container: 'stages',
    element: 'stages__item',
    classAnimEnd: 'fadeIn'
});

function animateElements({container, element, classAnimStart, classAnimEnd, threshold = 0.25, once = false}){
    /**
     * container - класс контейнера, на который ставится наблюдатель
     * element - класс анимируемого эл-та (добавить ему visibility: hidden)
     * classAnimStart - класс начальной точки анимации (при keyframes он не нужен)
     * classAnimEnd - класс конечной точки анимации
     * threshold - допустимый процент пересечения контейнера, когда начнется анимация
     * (на мобильниках начинаем анимацию сразу же: threshold = 0)
     * once - проиграть анимацию только 1 раз
     */
    if(window.outerWidth <= 768){
        threshold = 0;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const elements = entry.target.querySelectorAll('.' + container + ' .' + element);
            elements.forEach(el => {
                if(classAnimStart){
                    el.classList.add(classAnimStart);
                }

                setTimeout(() =>{
                    if(once){
                        if(entry.isIntersecting){
                            el.classList.add(classAnimEnd);
                        }
                    } else {
                        el.classList.toggle(classAnimEnd, entry.isIntersecting);
                    }
                }, 100);
            });
        });
    }, {
        threshold: threshold
    });

    const observeContainers = document.querySelectorAll('.' + container);
    observeContainers.forEach(el => observer.observe(el));
}