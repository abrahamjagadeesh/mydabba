define(["jquery", "checkCssSupport"], function (jQuery, checkCssSupport) {


    function Gallery(el, options) {


        var defaultOptions = {
            multipleSlides: 3, // default is 1	
            steps: 1,
            transition: "",
            autoHeight: true,
            maxHeight: 900,
            bgAsSource: true, //background as source			
            showThumbs: false, // show thumb navigation
            showDots: false, // show dots navigation
            isCycle: true // cyclic slider
        };

        var base = this;
        base.wWindow = $(window); // browser window
        base.dDocument = $(document); // browser document
        base.screen = screen; // screen: DOM object
        base.$el = $(el); // wrap elem with jquery
        base.el = el; // plain javascript object
        base.$el.data("gallery", base); // store data value
        base.options = $.extend({}, defaultOptions, options); // extending gallery options


        base.isFullScreen = false; // on init - fullscreen is false
        base.isTranslate3d = checkCssSupport.checkCssProperty("transform", "translate3d(0,0,0)");
        base.isTranslate2d = checkCssSupport.checkCssProperty("transform", "translate(0,0)");
        base.isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;
        base.isDragging = false;
        base.currentTranslatePosition = 0; // current animated position of slider
        base.noOfSlides = 0;



        /*find elements*/

        /*screenshot nav*/
        base.previousScreen = base.$el.find(".btn-L-left");
        base.nextScreen = base.$el.find(".btn-L-right");

        /*screenshot*/
        base.subPlaceholder = base.$el.find(".level-two");
        base.largePlaceholder = base.$el.find(".level-one");
        base.wrapper = base.subPlaceholder.find(".bucket");

        /*fullscreen controls*/
        base.openFullScreen = base.$el.find(".btn-fs-open");
        base.closeFullScreen = base.$el.find(".btn-fs-close");


        base.touchArray = {
            touchstart: {
                x: -1,
                y: -1
            },
            touchmove: {
                x: -1,
                y: -1
            },
            touchend: !1,
            direction: "undetermined"
        };
        base.mouseArray = {
            mousedown: -1,
            mousemove: -1
        };





        base.init = function () {

            base.current = 0;
            base.old = -10000;
            base.oldest = -10000;


            base.isResponsive = base.fnIsResponsive();

            base.noOfSlides = base.wrapper.length;

            /*check if the user has set multiple slides more than number of slides*/
            if (base.options.multipleSlides > base.noOfSlides) {
                base.options.multipleSlides = base.noOfSlides;
            }
            if (base.options.multipleSlides === 1) {
                base.options.steps = 1;
            }
            if (base.options.multipleSlides < base.options.steps) {
                base.options.steps = base.options.multipleSlides;
            }


            if (base.options.isCycle && (base.options.multipleSlides < base.noOfSlides)) {
                base.createHTMLForCyclic();
            } else {
                /*set dimensions for the containers and other element*/
                base.setDimensions();
            }

            /*set initial helper classes names*/
            base.setClassName();

            base.setCurrentClass();

            /*get img src and make it background-image*/
            if (!base.isFullScreen && base.options.bgAsSource) {
                base.setImages();
                base.$el.addClass("bgAsSource");
            }

            $(base.el).find('img').imagesLoaded().always(function (instance) {
                base.setDimensions();
            });

            /*call events on btns*/
            base.customEvents();


        };

        base.init();


    };


    return Gallery;

});