var panelOpen = false;
var menuOpen = false;
(function (window) {

    'use strict';
  
    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function each(collection, callback) {
        for (var i = 0; i < collection.length; i++) {
            var item = collection[i];
            callback(item);
        }
    }

    function Menu(options) {
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    Menu.prototype.options = {
        wrapper: '#o-wrapper',          // The content wrapper
        type: 'push-left',             // The menu type
        menuOpenerClass: '.c-button',   // The menu opener class names (i.e. the buttons)
        maskId: '#c-mask'               // The ID of the mask
    };

    Menu.prototype._init = function () {
        this.body = document.body;
        this.wrapper = $(this.options.wrapper);
        this.mask = $(this.options.maskId);
        this.menu = $('#c-menu--' + this.options.type);
        this.closeBtn = $('.c-menu__close');
        this.menuOpeners = document.querySelectorAll(this.options.menuOpenerClass);
        // this._initEvents();
    };

    Menu.prototype._initEvents = function () {

        // this.closeBtn.addEventListener('click', function(e) {
        //     e.preventDefault();
        //     this.close();
        // }.bind(this));

        // Event for clicks on the mask.
        // this.closeBtn.on('click', function (e) {
        //     if (panelOpen) {
        //
        //         e.preventDefault();
        //         this.close();
        //     }else{
        //     //do nothing
        //     }
        //
        // }.bind(this));
    };

    Menu.prototype.open = function () {
        $('body').addClass('has-active-menu');
        this.wrapper.addClass('has-' + this.options.type);
        this.menu.addClass('is-active');
        // this.mask.addClass('is-active');
       
        // this.disableMenuOpeners();
    };

    Menu.prototype.close = function () {
       $('body').removeClass('has-active-menu');

        this.wrapper.removeClass('has-' + this.options.type);
        this.menu.removeClass('is-active');
      
    };

    Menu.prototype.disableMenuOpeners = function () {
        each(this.menuOpeners, function (item) {
            item.disabled = true;
        });
    };

//     $('#c-button--slide-right').on('click', function(){
//
//         if($('#c-menu--slide-right').classList.indexOf('is-active') < 0) {
// //            $('body').removeClass('has-active-menu');
// //            $('#c-menu--slide-right').removeClass('is-active');
// //            $('#o-wrapper').removeClass('has-slide-right');
// //            $('#c-mask').removeClass('is-active');
//
//             Menu.prototype.close();
//         }
//     })

    Menu.prototype.enableMenuOpeners = function () {
        each(this.menuOpeners, function (item) {
            item.disabled = false;
        });
    };
    window.Menu = Menu;

})(window);