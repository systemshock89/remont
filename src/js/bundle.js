// // Import vendor jQuery plugin example
// import '~/app/libs/mmenu/dist/mmenu.js'

'use strict';

document.addEventListener("DOMContentLoaded", function(event) {

    // header__top-button visible
    if(getComputedStyle(document.querySelector('.header__mobile')).display === 'none'){
        showHeaderBtn();
        document.addEventListener("scroll", () => {
            showHeaderBtn();
        });
        function showHeaderBtn(){
            const headerTopBtn = document.querySelector('.header__top-button');
            const headerBtn = document.querySelector('.header__button');
            const headerTopHeight = document.querySelector('.header__desktop-top').clientHeight;
            if(headerBtn.getBoundingClientRect().top - headerTopHeight <= 0){
                headerTopBtn.classList.add('header__top-button_active');
            } else {
                headerTopBtn.classList.remove('header__top-button_active');
            }
        }
    }


    // Mmenu
    new Mmenu( "#mmenu", {
        // options
        slidingSubmenus: false, // открывать подменю снизу или в виде скользящих меню
        // scrollBugFix: { // пока обходимся без фикса
        //     "fix": false
        // },
        navbar: false, // убрать сверху название меню
        // "counters": true, // кол-во подразделов
        extensions: [
            "border-full", // линии пунктов на всю ширину меню
            "multiline", // длинные навания без сокращений
            "pagedim-black", // затемнение сайта при открытии меню
            // "theme-dark"
        ],
        navbars: [
            // {
            //     position: "top",
            //     content: [
            //         "searchfield"
            //     ]
            // },
            {
                position: "top",
                // content: $("#mmenu-top-buttons").children().toArray()
                content: Array.from(document.querySelector("#mmenu-top-buttons").children)
            },
            // {
            //     "position": "top",
            //     "type": "tabs",
            //     // "content": $("#mmenu-tabs").children().toArray()
            //     "content": Array.from(document.querySelector("#mmenu-tabs").children)
            // },
            {
                // "use": ($("#mmenu-socials").length > 0 ? true : false),
                use: (document.querySelector("#mmenu-socials") ? true : false),
                position: "bottom",
                // content: $("#mmenu-socials").children().toArray()
                content: (document.querySelector("#mmenu-socials") ? Array.from(document.querySelector("#mmenu-socials").children) : null)
            },
        ],
        // setSelected: {
        //     hover: true // чтобы пункт меню был активным при наведении мышью (например, для десктопа).
        //     Раскомментировать только если меню будет использоваться на десктопе
        // },
    }, {
        // configuration
        classNames: {
            selected: (document.querySelector("body.item") ? "active": "selected"),
        },
        offCanvas: {
            page: {
                selector: ".page"
            }
        },
        language: "ru",
        // "searchfield": {
        //     "clear": true
        // }
    });

    // options for landing
    if( document.querySelector("body.landing") ){
        Mmenu.options.onClick.close = true;
    }

    // скрипт, чтобы верхнее меню пряталось при прокрутке вниз
    // new Mhead( ".header-mobile", {
    //     pin: 100
    // });


    // https://github.com/Faisal-Manzer/postcss-viewport-height-correction
    const customViewportCorrectionVariable = 'vh';

    function setViewportProperty(doc) {
        let prevClientHeight;
        const customVar = '--' + ( customViewportCorrectionVariable || 'vh' );
        function handleResize() {
            const clientHeight = doc.clientHeight;
            if (clientHeight === prevClientHeight) return;
            requestAnimationFrame(function updateViewportHeight(){
                doc.style.setProperty(customVar, (clientHeight * 0.01) + 'px');
                prevClientHeight = clientHeight;
            });
        }
        handleResize();
        return handleResize;
    }
    window.addEventListener('resize', setViewportProperty(document.documentElement));
    // //https://github.com/Faisal-Manzer/postcss-viewport-height-correction


    // Lazyload
    // with use_native
    const lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazy",
        use_native: true,
    });

    // without use_native (false)
    const lazyLoadInstance2 = new LazyLoad({
        elements_selector: ".block-bg, .img-container-bg"
    });

    const lazyLoadInstance_slider = new LazyLoad({
        elements_selector: ".lazy-slider-bg"
    });
    // /Lazyload


    /* slider */
    try {
        const sliders = document.querySelectorAll('.slider');

        sliders.forEach(slider => {
            const selector = '.' + slider.classList.value.trim().replace(/\s+/g, '.');
            const swiper = new Swiper(selector + ' .swiper', {
                loop: slider.querySelectorAll(' .swiper-slide').length > 1 ? true : false,
                preloadImages: false,
                lazy: true,
                autoplay: {
                    delay: 9000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false
                },
                pagination: {
                    el: selector + ' .swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: selector + ' .swiper-button-next',
                    prevEl: selector + ' .swiper-button-prev',
                },
            });
        });
    } catch (err) {
        console.log(err);
    }
    /* /slider */


    /* slider-form */
    try {
        const sliders = document.querySelectorAll('.slider-form');

        sliders.forEach(slider => {
            const selector = '.' + slider.classList.value.trim().replace(/\s+/g, '.');
            const swiper = new Swiper(selector + ' .swiper', {
                preloadImages: false,
                lazy: true,
                pagination: {
                    el: selector + " .swiper-pagination-fraction",
                    type: "fraction",
                },
                navigation: {
                    nextEl: selector + ' .swiper-btn-next',
                    prevEl: selector + ' .swiper-btn-prev',
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: false
                },
                simulateTouch: false,
                allowTouchMove: false
            });

            // swiper__pagination
            const paginations = document.querySelectorAll(selector + ' .swiper__pagination');

            swiper.slides.forEach(slide => {
                const dots = [];
                for (let i = 0; i < swiper.slides.length; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('swiper__pagination-item');
                    slide.querySelector('.swiper__pagination').append(dot);

                    if (i == 0) {
                        dot.classList.add('swiper__pagination-item_active');
                    }

                    dots.push(dot);
                }
            });

            swiper.on('slideChange', function () {
                paginations.forEach(pagination => {
                    const dots = pagination.querySelectorAll('.swiper__pagination-item');
                    dots.forEach((dot, i) => {
                        dot.classList.remove('swiper__pagination-item_active');
                    });
                    dots[swiper.activeIndex].classList.add('swiper__pagination-item_active');
                    return false;
                });
            });

        });

    } catch (err) {
        console.log(err);
    }
    /* /slider-form */


    /* slider-tabs */
    try {
        const sliders = document.querySelectorAll('.slider-tabs');

        sliders.forEach(slider => {
            const selector = '.' + slider.classList.value.trim().replace(/\s+/g, '.');
            const swiper = new Swiper(selector + ' .swiper', {
                preloadImages: false,
                lazy: true,
                navigation: {
                    nextEl: selector + ' .swiper-button-next',
                    prevEl: selector + ' .swiper-button-prev',
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: false
                },
                simulateTouch: false,
                allowTouchMove: false
            });

            const tabs = document.querySelectorAll('.slider-tabs__tab');

            function tabsRemoveActive(){
                tabs.forEach(tab => {
                    tab.classList.remove('slider-tabs__tab_active');
                    return false;
                });
            }

            tabs.forEach((tab, i) => {
                tab.addEventListener('click', () => {
                    tabsRemoveActive();
                    tab.classList.add('slider-tabs__tab_active');
                    swiper.slideTo(i);
                    return false;
                });
            });

            swiper.on('slideChange', function () {
                tabsRemoveActive();
                tabs[swiper.activeIndex].classList.add('slider-tabs__tab_active');
                return false;
            });
        });
    } catch (err) {
        console.log(err);
    }
    /* /slider-tabs */


    /* slider-thumbs */
    try {
        const sliders = document.querySelectorAll('.slider-thumbs');

        sliders.forEach(slider => {
            const selector = '.' + slider.classList.value.trim().replace(/\s+/g, '.');

            let swiperThumbs;
            if(window.innerWidth >= 768){
                swiperThumbs = new Swiper(selector + ' .slider-thumbs__carousel .swiper', {
                    preloadImages: false,
                    lazy: true,
                    spaceBetween: 10,
                    slidesPerView: 4,
                    watchSlidesProgress: true,
                    centerInsufficientSlides: true
                });
            }

            const swiperMain = new Swiper(selector + ' .slider-thumbs__main .swiper', {
                preloadImages: false,
                lazy: true,
                rewind: true,
                // autoplay: {
                //     delay: 3000,
                //     pauseOnMouseEnter: true,
                //     disableOnInteraction: false
                // },
                navigation: {
                    nextEl: selector + ' .swiper-button-next',
                    prevEl: selector + ' .swiper-button-prev',
                },
                thumbs: {
                    swiper: (swiperThumbs ? swiperThumbs : null),
                }
            });

        });
    } catch (err) {
        console.log(err);
    }
    /* /slider-thumbs */


    /* slider-carousel_products */
    try {
        const sliders = document.querySelectorAll('.slider-carousel_products');

        sliders.forEach(slider => {
            const selector = '.' + slider.classList.value.trim().replace(/\s+/g, '.');
            const swiper = new Swiper(selector + ' .swiper', {
                loop: slider.querySelectorAll(' .swiper-slide').length > 4 ? true : false,
                slidesPerView: 1,
                spaceBetween: 15,
                breakpoints: {
                    426: {
                        slidesPerView: 2,
                        spaceBetween: 15
                    },
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    },
                    1360: {
                        slidesPerView: 4,
                        spaceBetween: 30
                    }
                },
                preloadImages: false,
                lazy: true,
                autoplay: {
                    delay: 9000,
                    pauseOnMouseEnter: true,
                },
                navigation: {
                    nextEl: selector + ' .swiper-button-next',
                    prevEl: selector + ' .swiper-button-prev',
                },
            });
        });
    } catch (err) {
        console.log(err);
    }
    /* /slider-carousel_products */


    /* slider-carousel_reviews */
    try {
        const sliders = document.querySelectorAll('.slider-carousel_reviews');

        sliders.forEach(slider => {
            const selector = '.' + slider.classList.value.trim().replace(/\s+/g, '.');
            const swiper = new Swiper(selector + ' .swiper', {
                rewind: true,
                slidesPerView: 1,
                spaceBetween: 15,
                breakpoints: {
                    426: {
                        slidesPerView: 2,
                        spaceBetween: 15
                    },
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    },
                    1360: {
                        slidesPerView: 4,
                        spaceBetween: 30
                    }
                },
                preloadImages: false,
                lazy: true,
                autoplay: {
                    delay: 9000,
                    pauseOnMouseEnter: true,
                },
                navigation: {
                    nextEl: selector + ' .swiper-button-next',
                    prevEl: selector + ' .swiper-button-prev',
                },
            });
        });
    } catch (err) {
        console.log(err);
    }
    /* /slider-carousel_reviews */


    /* fancybox 3 */
    try {

        // настройки для всех fancybox по умолчанию
        $.fancybox.defaults.thumbs.autoStart = true;
        $.fancybox.defaults.animationEffect = "zoom";
        $.fancybox.defaults.transitionEffect = "slide";
        $.fancybox.defaults.hash = false;
        $.fancybox.defaults.infobar = true;
        $.fancybox.defaults.mobile.thumbs = {
            autoStart : false
        };
        $.fancybox.defaults.buttons = [
            'slideShow',
            'fullScreen',
            'thumbs',
            'close',
            // 'share',
            // 'download',
            // 'zoom'
        ];
        $.fancybox.defaults.lang = 'ru';
        $.fancybox.defaults.i18n = {
            'ru': {
                CLOSE: 'Закрыть',
                NEXT: 'Следующий',
                PREV: 'Предыдуший',
                ERROR: 'Запрошенный контент не может быть загружен. <br/> Пожалуйста, повторите попытку позже.',
                PLAY_START: 'Слайдшоу',
                PLAY_STOP: 'Пауза',
                FULL_SCREEN: 'На весь экран',
                THUMBS: 'Эскизы',
                DOWNLOAD: 'Скачать',
                SHARE: 'Поделиться',
                ZOOM: 'Увеличить'
            }
        };


        $("[data-fancybox]").fancybox();

        // кнопка вызова окна заказа в товаре (оно большое по высоте - нужно чтобы прокручивалось на мобильном)
        $("[data-fancybox].order").fancybox({
            mobile : {
                touch : false
            }
        });

        // чтобы в слайдере возврат фокуса при закрытии окна не приводил к смещению слайдов
        $("[data-fancybox].seo-btn-tovar").fancybox({
            backFocus : false
        });

        // widget-phone
        // $("[data-fancybox].widget-phone").fancybox({
        //     beforeClose : function( instance, current ) {
        //
        //         $widget_str = current.$content["0"].className;
        //
        //         // если попап является виджетом обратного звонка, то включать значок при закрытии попапа
        //         if ($widget_str.indexOf('modal-widget-phone') + 1) {
        //             $('.widget-phone').stop().fadeIn(450);
        //         }
        //     }
        // });

        /* Открываем автоматом по id через класс */
        // var fancybox_start_id = window.location.href.indexOf("#");
        // if (fancybox_start_id > 0) {
        //     var fancybox_id = window.location.href.substring(fancybox_start_id + 1);
        //
        //     $("[data-fancybox]").each(function() {
        //         if( $(this).attr('data-fancybox-id') == fancybox_id){
        //             $(this).click();
        //         }
        //     });
        // }

    } catch (err) {
        console.log(err);
    }
    /* /fancybox 3 */


    /* Animations */
    animateElements({
        container: 'catalog-advantage-variant10',
        element: 'img-container',
        classAnimEnd: 'backInLeft'
    });

    animateElements({
        container: 'catalog-advantage-variant10',
        element: 'text-container',
        classAnimEnd: 'fadeIn'
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
    /* /Animations */

});