/**
 * @description Основные скрипты
 */

document.addEventListener("DOMContentLoaded", function(event) {

    // header__top-button visible
    if(getComputedStyle(document.querySelector('.header__mobile')).display === 'none'){
        document.addEventListener("scroll", () => {
            const headerTopBtn = document.querySelector('.header__top-button');
            const headerBtn = document.querySelector('.header__button');
            const headerTopHeight = document.querySelector('.header__desktop-top').clientHeight;
            if(headerBtn.getBoundingClientRect().top - headerTopHeight <= 0){
                headerTopBtn.classList.add('header__top-button_active');
            } else {
                headerTopBtn.classList.remove('header__top-button_active');
            }
        });
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


    /* Верхнее меню - пункт еще */
    try {
        $('.menu-top ul.level1, .header__nav ul.level1').flexMenu({
            linkText : 'Еще...',
            linkTitle : 'Показать еще пункты',
            cutoff : 0,
            // popupClass : 'level2'
        });
    } catch (err) {
        console.log(err);
    }
    /* /Верхнее меню - пункт еще */


    /* Разворачивание разделов в вертикальном меню */
    // по клику на стрелку
    // $('.vertical-menu .submenu-btn').click(function (e) {
    //     e.preventDefault();
    //     var $this = $(this),
    //         $this_li = $this.closest('li');
    //
    //     $this_li.find('ul.level2').slideToggle(200, function(){
    //         /*
    //         Состояния пункта меню:
    //         - Если у пункта меню есть оба класса "selected" и "active" - то находимся в разделе, имеющем подразделы
    //         - Если у пункта меню один класс "active" - мы находимся в дочернем разделе,
    //         родитель которого имеет подразделы
    //          */
    //         if( !$this_li.hasClass('active') ){
    //             $this.toggleClass('submenu-btn-show')
    //             // если мы не находимся в разделе или подразделе этого пункта
    //             // меню, то подставлять класс submenu-btn-show, при котором стрелка развернута
    //         } else {
    //             $this.toggleClass('submenu-btn-hide');
    //             // иначе подставлять класс submenu-btn-hide,
    //             // при котором стрелка свернута
    //         }
    //     });
    // });

    // по клику на раздел без перехода в этот раздел (при активации галочки в админке)
    // $('.vertical-menu .submenu-toggle').click(function (e) {
    //     e.preventDefault();
    //     $(this).closest('.item-wrap').find('.submenu-btn').trigger( "click" );
    // });
    /* Разворачивание разделов в вертикальном меню */


    /* Верхнее меню - раздер без перехода внутрь - попадаем в подразделы */
    $('.menu-top .submenu-toggle').click(function (e) {
        e.preventDefault(); // при клике на ссылку никуда не переходим
    })
        .keydown(function(e){
            if(e.which === 13){
                e.preventDefault();
                $(this).closest('li').find('> ul').slideToggle(200); // при нажатии на enter разворачиваем подразделы
            }
        });
    /* Разворачивание разделов в вертикальном меню - попадаем в подразделы */


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
                    watchSlidesProgress: true
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


    /* /Carousel Owl Slider */
    $(".carousel-slider .owl-carousel").each(function(){
        var owl =  $(this);
        owl.owlCarousel({
            autoplay: true,
            autoplayTimeout: 9000,
            autoplayHoverPause: true,
            // lazyLoad:true,
            navText:  [
                "",
                ""
            ],
            dots: false,
            responsiveBaseElement: $('.page, #fullpage'),
            responsive:{
                0:{
                    items:1,
                    margin: 15,
                    nav: false,
                    dots: true,
                    // stagePadding: 35,
                    loop: true,
                    mouseDrag: false
                },
                576:{
                    items: 2,
                    margin: 30,
                    nav: false,
                    rewind:true,
                    dots: true,
                    mouseDrag: false
                },
                768:{
                    items: 3,
                    margin: 30,
                    nav: true,
                    rewind:true,
                    mouseDrag: true
                },
                992:{
                    items: 4,
                    margin: 30,
                    nav: true,
                    rewind:true
                }

            }
        }).on('changed.owl.carousel', function (event) {
            // при ручном перелистывании слайдера обновлять таймаут автопрокрутки
            owl.trigger('stop.owl.autoplay');
            owl.trigger('play.owl.autoplay', [9000]);
        });

        owl.find('.owl-nav .owl-prev').attr('title', 'Предыдущий');
        owl.find('.owl-nav .owl-next').attr('title', 'Следующий');
    });
    /* /Carousel Owl Slider */


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
        $("[data-fancybox].widget-phone").fancybox({
            beforeClose : function( instance, current ) {

                $widget_str = current.$content["0"].className;

                // если попап является виджетом обратного звонка, то включать значок при закрытии попапа
                if ($widget_str.indexOf('modal-widget-phone') + 1) {
                    $('.widget-phone').stop().fadeIn(450);
                }
            }
        });

        /* Открываем автоматом по id через класс */
        var fancybox_start_id = window.location.href.indexOf("#");
        if (fancybox_start_id > 0) {
            var fancybox_id = window.location.href.substring(fancybox_start_id + 1);

            $("[data-fancybox]").each(function() {
                if( $(this).attr('data-fancybox-id') == fancybox_id){
                    $(this).click();
                }
            });
        }

    } catch (err) {
        console.log(err);
    }
    /* /fancybox 3 */


    /* Табы */
    //показываем первую вк
    // $('.tovar-container .tabs .tabs-controls > .item').first().addClass('active');
    // $('.tovar-container .tabs .tabs-list > .item').first().addClass('active');
    //
    // $('.tabs-controls > .item').on('click', function (e) {
    //     e.preventDefault();
    //
    //     var item = $(this),
    //         contentItem = $(this).parent().parent().find('.tabs-list > .item'),
    //         itemPosition = item.index();
    //
    //     contentItem.eq(itemPosition)
    //         .add(item)
    //         .addClass('active')
    //         .siblings()
    //         .removeClass('active');
    // });
    /* /Табы */


    /* кнопка Наверх */
    if( $(window).scrollTop()>0 ){
        toTopButton();
    }
    $(window).scroll(function () {
        toTopButton();
    });
    function toTopButton() {
        if( !$('.toTop').length ){
            $('body').append('<a href="#top" class="toTop" title="Наверх"></a>');
        }
        var toTop = $('.toTop');
        if ($(window).scrollTop() > 0) {
            toTop.show();
            toTop.addClass('show');
        } else {
            toTop.removeClass('show');
            setTimeout(function () {
                toTop.hide();
            }, 250)
        }
    }
    /* /кнопка Наверх */


    /* WIDGET PHONE */
    try {
        $('.widget-phone').standart_widgetPhone({
            // widgetTimer: 0, // таймер ,по истечении которого появится виджет
        });
    } catch (err) {
        console.log(err);
    }
    /* /WIDGET PHONE */


    /* FAQ MINI */
    $('.faq-mini .item .question').click(function(e) {

        var faq_mini_item_this = $(this).closest('.item');
        e.preventDefault();

        if ( !faq_mini_item_this.hasClass('selected') ){
            faq_mini_item_this.find('.answer').slideToggle();
            faq_mini_item_this.toggleClass('selected');
        } else {
            faq_mini_item_this.find('.answer').slideUp();
            faq_mini_item_this.toggleClass('selected');
        }
    });
    /* /FAQ MINI */


    // Маска для удобного ввода телефона
    phone_input_mask();


    // таблица адаптивная - поведение стрелок
    table_responsive_func();


    // при клике по заголовку раскрывается таблица с ценами
    $('.price-block-button').click(function (e) {
        var $item =  $(this).closest('.price-block');
        e.preventDefault();
        $(this).toggleClass("active");
        $item.find('.block-hidden').slideToggle( function () {
            $item.toggleClass("opened");
        });
    });
    // /при клике по заголовку раскрывается таблица с ценами


    /* скрытие ссылок для seo */
    $('.hidden-link').replaceWith(function () {
        return '<a href="' + $(this).data('link') + '" target="_blank">' + $(this).html() + '</a>';
    });
    /* /скрытие ссылок для seo */


    // ссылка-якорь 1
    url_anchor_func(); // переход к якорю с id из урла (без анимации). Для корректной работы запускать после всех остальных скриптов (в конце ready)

    if( $('body.landing').length ) { // в лендинге
        $(window).scroll(function () {
            checkLandingSection($('.landing-section'), anchor_offset);
        });
    }
    // /ссылка-якорь 1

    // Выбор города - Где купить - Вариант 2
    $("select[name='select_city']").change(function(){
        if(this.value > 0){
            $("#selectcity").submit();
        }
    });

});


//Скрипт добавления ссылки на источник при копировании
(function($) {
    $(function() {
        function addLink() {
            var body_element = document.getElementsByTagName ('body') [0];
            var html = "";
            if (typeof window.getSelection != "undefined") {
                var selection = window.getSelection();
                if (selection.rangeCount) {
                    var container = document.createElement("div");
                    for (var i = 0, len = selection.rangeCount; i < len; ++i) {
                        container.appendChild(selection.getRangeAt(i).cloneContents());
                    }
                    html = container.innerHTML;
                }
            } else {
                return;
            }
            if (html.toString().split(' ').length < 10) {
                return;
            }

            var pagelink = "<br/><br/> Подробнее: <a href='" + document.location.href+ "'>"  +document.location.href+ "</a>";
            var copytext = html + ' ' + pagelink;
            var newdiv = document.createElement('div');
            newdiv.style.position = 'absolute';
            newdiv.style.left = '-99999px';
            body_element.appendChild(newdiv);
            newdiv.innerHTML = copytext;
            selection.selectAllChildren(newdiv);
            window.setTimeout(function() {
                body_element.removeChild(newdiv);
            },0);
        }
        document.oncopy = addLink;
    });
})(jQuery);


//preloader
function showLoader() {
    $("#preloader").show();
}

function hideLoader() {
    $("#preloader").hide();
}


// Маска для удобного ввода телефона
function phone_input_mask() {
    try {
        Inputmask({"mask": "(+7)|(8) ( 999 ) 999 - 99 - 99", "positionCaretOnClick": "ignore"}).mask('.form-group.phone input[type=tel]');
    } catch (err) {
        console.log(err);
    }
}


// таблица адаптивная - поведение стрелок
function table_responsive_func() {

    $('.table-responsive').each(function() {
        var $this = $(this),
            $table_overflow = $this.find('.overflow'),
            $table =  $this.find('.overflow table'),
            $table_responsive_arrow_right_flag = false;

        $this.prepend('<div class="table-responsive-arrow arrow-left">' +
            '            <i class="fa fa-chevron-right fa-2x"></i>' +
            '        </div>' +
            '        <div class="table-responsive-arrow arrow-right">' +
            '            <i class="fa fa-chevron-right fa-2x"></i>' +
            '        </div>');

        // если таблица не помещается в контентную область, то активировать флаг
        if( $table.width() > $table_overflow.width() ){
            $table_responsive_arrow_right_flag = true;
        }

        $(window).resize(function () {
            if( $table.width() > $table_overflow.width() ){
                $table_responsive_arrow_right_flag = true;
            }
        });

        // если таблица не помещается в контентную область, показывать стрелку справа
        if( $table_responsive_arrow_right_flag ){
            $this.addClass('table-responsive-arrow-right-on');
        }

        $table_overflow.scroll(function() {

            // показать стрелку слева
            if( $table_overflow.scrollLeft() > 0 ){
                $this.addClass('table-responsive-arrow-left-on');
            }

            // убрать стрелку слева
            if( $table_overflow.scrollLeft() == 0 ){
                $this.removeClass('table-responsive-arrow-left-on');
            }

            // показать стрелку справа
            if( $table_responsive_arrow_right_flag &&
                ($table_overflow.scrollLeft() + $this.width() ) < $table.width() ){
                $this.addClass('table-responsive-arrow-right-on');
            }

            // убрать стрелку справа
            if( $table_responsive_arrow_right_flag &&
                ($table_overflow.scrollLeft() + $this.width() ) >= $table.width()-1 ){ // на мобиле стрелка не убирается, если не добавить -1
                // ($table_overflow.scrollLeft() + $this.width() ) >= $table.width() ){
                $this.removeClass('table-responsive-arrow-right-on');
            }

        });

        //клик на кнопки влево и вправо - гориз.скролл
        $this.find(".table-responsive-arrow.arrow-left").click(function () {
            var leftPos = $table_overflow.scrollLeft();
            $table_overflow.animate({scrollLeft: leftPos - 100}, 150);
        });

        $this.find(".table-responsive-arrow.arrow-right").click(function () {
            var leftPos = $table_overflow.scrollLeft();
            $table_overflow.animate({scrollLeft: leftPos + 100}, 150);
        });

    });
}
// /таблица адаптивная - поведение стрелок


// отложенная загрузка скрипта яндекс карт (из конструктора)
function showYandexMap(yandex_map_src, yandex_map_element_id){
    let script   = document.createElement("script");
    script.src   = yandex_map_src;
    document.getElementById(yandex_map_element_id).appendChild(script);
}
// /отложенная загрузка скрипта яндекс карт (из конструктора)


// ссылка-якорь 2
let anchor_offset, // отступ прилипающего хедера или меню (на десктопе и мобильном разный)
    anchor_offset_small = 0,
    anchor_offset_small_val = 10; // еще небольшой отступ в 10px, чтоб не было впритык (но если у блока фон - то этот оступ игнорируется)

if($('.header__desktop').is(":visible")){
    if($('.nc-navbar.nc--fixed').length){
        anchor_offset = $('.menu-top ul.level1 > li:first-child').outerHeight() + $('.nc-navbar.nc--fixed').outerHeight();
    } else {
        anchor_offset = $('.menu-top ul.level1 > li:first-child').outerHeight();
    }
} else{
    anchor_offset = $('.header__mobile').outerHeight();
}

// прокрутка к якорю при клике на ссылку
$("body").on('click', '[href*="#"]', function () {
    var href = $.attr(this, 'href'),
        href_id_block;

    // если ссылка содержит href="#top", то прокручивать в начало страницы
    if( href == '#top' ){
        $('body,html').animate({scrollTop: 0}, 500);
        return false;
    } else {

        // не обрабатывать сслылки, где href содержит только '#' или '#mmenu'
        // также не обрабатывать ссылки из табов (где помимо href есть id начинающийся на tab - при клике на них не нужно перемещаться до ссылки. Перемещаться нужно только по урлу с id этого таба)
        // также не обрабытывается ссыока из режима редактирования netcat 6
        if (href != '#' && !$(this).filter('[href^="#mm"]').length && !$(this).filter('[id^="tab"]').length && !$(this).closest('.nc6-toolbar').length ) {
            // if (href != '#' && href != '#mmenu' && !$(this).filter('[id^="tab"]').length ) {

            if($(href).hasClass('tpl-anchor')){ // при включенной доп. разметке компонента появляется div class tpl-anchor
                href_id_block = $(href).next().filter('[style*="background"]').length;
            } else {
                href_id_block = $(href).filter('[style*="background"]').length;
            }

            if(href_id_block){
                anchor_offset_small = 0;
            } else {
                anchor_offset_small = anchor_offset_small_val;
            }

            anchor_offset_func($(this)); // индивидуальный отступ

            $('html, body').animate({
                scrollTop: $(href).offset().top - anchor_offset - anchor_offset_small - anchor_offset_more
            }, 500, function () {

                // В лендинге: подсвечивание активного пункта меню при клике на него после скролла до этого блока
                if( $('body.landing').length ) {
                    $menu_top_li = $('.menu-top ul > li');
                    $menu_top_li.removeClass('selected');
                    $menu_top_li.find('> a').filter('[href="' + window.location.hash + '"]').closest('li').addClass('selected');

                    $mmenu_li = $('#mmenu ul > li');
                    $mmenu_li.removeClass('mm-listitem_selected');
                    $mmenu_li.find('> a').filter('[href="' + window.location.hash + '"]').closest('li').addClass('mm-listitem_selected');
                }
            });
            // history.pushState(null,null,href);
            history.pushState(null,null,window.location.pathname + window.location.search + href );
            // window.location.search - это параметры url'а. Нужны для правильного отображения страницы в реж. редактирования,
            // когда нажали на якорь.
            // Возможно в других случаях не нужны или помешают
            return false;
        }
    }
});

// переход к якорю с id из урла (без анимации)
function url_anchor_func() {
    if (window.location.hash.indexOf('#') !== -1) {
        // var location_hash = window.location.hash.replace("#", "");
        var location_hash = window.location.hash;

        if ($(location_hash).offset()) {

            if($(location_hash).filter('[style*="background"]').length){
                anchor_offset_small = 0;
            } else {
                anchor_offset_small = anchor_offset_small_val;
            }

            anchor_offset_func($(location_hash)); // индивидуальный отступ

            setTimeout(function () {
                $('body, html').scrollTop($(location_hash).offset().top - anchor_offset - anchor_offset_small - anchor_offset_more);
            }, 500); // на локальном хостинге подойдет небольшое значение, а на боевом значение побольше, например 500
            // $(window).on('load', function(){
            //     $('body, html').scrollTop($(location_hash).offset().top - anchor_offset - anchor_offset_small - anchor_offset_more);
            // });

            // В лендинге: подсвечивание активного пункта меню при клике на него после скролла до этого блока
            if( $('body.landing').length ) {
                $menu_top_li = $('.menu-top ul > li');
                $menu_top_li.removeClass('selected');
                $menu_top_li.find('> a').filter('[href="' + location_hash + '"]').closest('li').addClass('selected');

                $mmenu_li = $('#mmenu ul > li');
                $mmenu_li.removeClass('mm-listitem_selected');
                $mmenu_li.find('> a').filter('[href="' + location_hash + '"]').closest('li').addClass('mm-listitem_selected');
            }
        }
    }
}

// ф-я определяет, видно ли сейчас данную секцию или нет и в зависимости от этого делает пункт меню активным и ставит хэш
function checkLandingSection(landing_sections, anchor_offset) {
    landing_sections.each(function () {
        var
            $this = $(this),
            topEdge,
            bottomEdge,
            wScroll = $(window).scrollTop();

        anchor_offset_func($this);
        topEdge = $this.offset().top - anchor_offset + anchor_offset_more;
        bottomEdge = topEdge + $this.height();

        if (topEdge < wScroll && bottomEdge > wScroll){
            var currentId;

            if($this[0].hasAttribute('id')){
                currentId = '#' + $this.attr('id');
            }else{
                currentId = '#' + $this.parent().find('.tpl-anchor').attr('id');
            }

            $menu_top_li = $('.menu-top ul > li');
            $menu_top_li.removeClass('selected');
            $menu_top_li.find('> a').filter('[href="' + currentId + '"]').closest('li').addClass('selected');

            $mmenu_li = $('#mmenu ul > li');
            $mmenu_li.removeClass('mm-listitem_selected');
            $mmenu_li.find('> a').filter('[href="' + currentId + '"]').closest('li').addClass('mm-listitem_selected');

            // if(currentId){
            //     window.location.hash = currentId.replace("#", ""); // Обновлять URL ссылки во время прокрутки
            // }
        }
    });
}

//ф-я доп. оступов у блоков с якорем в зависимости от дата-атрибутов и разрешения экрана (breakpoint)
var $window_width = $(window).width(),
    $anchor_offset_breakpoint,
    anchor_offset_more;
function anchor_offset_func(anchor_id) {
    // Первым используется отступ указанный В БЛОКЕ в атрибуте текущего разрешения
    // Если он не указан, то используется отступ указанный В ССЫЛКЕ в атрибуте текущего разрешения
    // Если он не указан, то используется отступ указанный В БЛОКЕ в атрибуте 'data-offset'
    // Если он не указан, то используется отступ указанный В ССЫЛКЕ в атрибуте 'data-offset'
    // Если ничего из этого не указано, то отступ 0

    switch (true) {
        case ($window_width >= 1359):
            $anchor_offset_breakpoint = 'offset-lg';
            break;
        case ($window_width >= 991) :
            $anchor_offset_breakpoint = 'offset-md';
            break;
        case ($window_width >= 767)  :
            $anchor_offset_breakpoint = 'offset-sm';
            break;
        case ($window_width >= 575)  :
            $anchor_offset_breakpoint = 'offset-xs';
            break;
        default:
            $anchor_offset_breakpoint = 'offset';
    }

    if( anchor_id.filter('[data-' + $anchor_offset_breakpoint + ']').length ){
        anchor_offset_more = anchor_id.data($anchor_offset_breakpoint);
    } else{
        anchor_link_id = '#' + anchor_id.attr('id');
        if($('a[href="' + anchor_link_id + '"][data-' + $anchor_offset_breakpoint + ']').length){
            anchor_offset_more = $('a[href="' + anchor_link_id + '"]').data($anchor_offset_breakpoint);
        } else {
            if( anchor_id.filter('[data-offset]').length ){
                anchor_offset_more = anchor_id.data('offset');
            } else{
                anchor_link_id = '#' + anchor_id.attr('id');
                if($('a[href="' + anchor_link_id + '"][data-offset]').length){
                    anchor_offset_more = $('a[href="' + anchor_link_id + '"]').data('offset');
                } else {
                    anchor_offset_more = 0;
                }
            }
        }
    }

    // если указано несколько ссылок с одним и тем же href="#id", но например рахными data-offset,
    // то по условиям выше anchor_offset_more может получиться undefined (напр, при переходе по урлу), тогда приравняем ее к 0
    if(!anchor_offset_more){
        anchor_offset_more = 0;
    }

    return anchor_offset_more;
}
// /ссылка-якорь 2


// Определение номера счетчика Яндекс.Метрики (используется для работы целей яндекс метрики)
window.onload = function () {
// document.addEventListener("DOMContentLoaded", () => { // при этом условии срабатывает через раз, тк метрика не успевает инициализироваться
    if (typeof Ya !== 'undefined') { // счетчик существует
        if (typeof Ya.Metrika !== 'undefined') { // счетчик называется Ya.Metrika
            yaC = Ya.Metrika.counters()[0].id;
        } else {
            if (typeof Ya.Metrika2 !== 'undefined') { // счетчик называется Ya.Metrika2
                yaC = Ya.Metrika2.counters()[0].id;
            }
        }
    }
// });
}


// Поиск по каталогу с подсказками
let ident_search = 0;
$('.nc_search .text').bind("input", function() {
    ident_search = $(this).parent().attr("id");
    if ($(this).val().length > 3) {
        $.ajax({
            url: "/ajax/search/search.php",
            type: "POST",
            data: {'gosearch' : $(this).val()},
            success: function(html){
                if (html != 0) {
                    $("#" + ident_search).parents(".search-wrapper").find(".search-variants").html(html).show();
                    $("#" + ident_search).parents(".search-wrapper").find(".search-variants-option").click(function(e){
                        $("#" + ident_search + " .text").val($(this).text());
                        $("#" + ident_search).submit();
                    });
                }
            },
            dataType: 'text'
        });
    } else {
        $("#" + ident_search).parents(".search-wrapper").find(".search-variants").html('').hide();
    }
});