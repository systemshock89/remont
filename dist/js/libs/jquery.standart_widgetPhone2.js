/**
 * @author Serega K.
 * @description Виджет сбора номера телефона и URL страницы, на которой находится клиент
 * version: 2.0.3
 *
 */
jQuery.fn.standart_widgetPhone = function(options){

    var options = jQuery.extend({
        popupTimer: 45000, // таймер ,по истечении которого автоматически вызовется попап
        widgetTimer: 4000, // таймер ,по истечении которого появится виджет
        cookieTimer: 1, // таймер действия куки (в сутках)
    },options);

    return this.each(function() {

        var widgetPhone = $(this), //виджет
            widgetPopupOpenFlag = false; // определяет, был ли открыт попап хотя бы 1 раз

        //показываем виджет через 5 сек после загрузки страницы
        setTimeout(function(){
            // widgetPhone.stop().fadeIn(450);
            widgetPhone.stop()
                .css("display", "flex")
                .hide()
                .fadeIn(450);
        },options.widgetTimer);

        //клик по виджету
        widgetPhone.click(function() {
            clickWidgetPhonePopup(widgetPhone); //вызываем функцию
        });

        // Если попап еще ни разу не был открыт (нет куки widget_phone_popup_show)
        if( !Cookies.get('widget_phone_popup_show') ){
            setTimeout(function(){
                // И если попап не открывали вручную и в данный момент не открыто никакого другого попапа
                if (!widgetPopupOpenFlag && $('.fancybox-is-open').length == 0){
                    // то смотри функцию
                    clickWidgetPhonePopup(widgetPhone, 1);
                }
            },options.popupTimer);
        }

        //ф-я при вызове попапа виджета
        function clickWidgetPhonePopup(widgetPhone, no_click_to_btn){
            widgetPopupOpenFlag = true;

            // То открываем этот попап (спустя 45 сек нахождения на странице)
            // (опять же, если нет куки widget_phone_popup_show)
            // Проверяем куку для того, чтобы попап не открывался на каждой странице сайта, если было открыто несколько вкладок.
            if( !Cookies.get('widget_phone_popup_show') ){
                if(no_click_to_btn){ // если попап вызывается автоматически, а не кликом по кнопке, то скриптом кликаем по кнопке
                    widgetPhone.click(); //вызываем попап
                }
            }
            widgetPhone.stop().fadeOut(250);

            // и стаим куку на сутки, показывающую что попап был открыт
            Cookies.set('widget_phone_popup_show', 'true', { expires: options.cookieTimer });
        }
    });
};