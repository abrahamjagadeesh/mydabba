define(["jquery", "mainClass", "mainFullScreen"], function ($, Gallery, fs_function) {


    Gallery.prototype.previousScreenfn = function () {
        var base = this;

        base.tracking();
        base.current = base.current - base.options.steps;


        if (base.options.isCycle) {

            if (base.current <= 0) {
                base.$el.addClass('noAnimate');

                base.tracking();
                console.log(base.noOfSlides - base.current)
                base.current = base.noOfSlides - base.current;
                base.scrollscreen();

                /*hack*/
                base.subPlaceholder.css('transition-duration');
                base.previousScreenfn();

            } else {

                base.$el.removeClass('noAnimate');
                base.scrollscreen();
            }

        } else {
            if (base.current < 0) {
                base.tracking();
                base.current = 0;
            }
            base.scrollscreen();
        }
    };

    Gallery.prototype.nextScreenfn = function () {

        var base = this;
        base.tracking();
        base.current = base.current + base.options.steps;

        if (base.options.isCycle) {

            if (base.current + base.options.multipleSlides >= base.noOfSlides) {
                base.$el.addClass('noAnimate');

                base.tracking();
                var remain = base.options.multipleSlides - (base.noOfSlides - ((base.current - base.options.steps) + base.options.multipleSlides));
                base.current = remain
                base.scrollscreen();

                /*hack*/
                base.subPlaceholder.css('transition-duration');
                base.nextScreenfn();

            } else {
                base.$el.removeClass('noAnimate');
                base.scrollscreen();
            }
        } else {
            var remain = base.noOfSlides - base.options.multipleSlides;
            /*checks how many slides remains; and assign the current slide accordingly*/
            if (base.current > remain) {
                base.tracking();
                base.current = remain;
            }
            base.scrollscreen();
        }
    };

    Gallery.prototype.fnExitFullScreen = function () {
        var base = this;
        base.$el.removeClass('fullScreen');
        fs_function.exitFullscreen();
        base.isFullScreen = false;
        base.setDimensions();
    };

    Gallery.prototype.fnopenFullScreen = function () {
        var base = this;
        base.$el.addClass('fullScreen');
        fs_function.launchFullscreen(base.el);
        base.isFullScreen = true;
        base.setDimensions();
    };

    Gallery.prototype.onThumbClick = function (thisEvent, base) {
        var self = thisEvent,
            ancIndex = $(self).index();

        var widthToMove = (base.isFullScreen) ? base.screen.width : base.$el.width();

        base.subPlaceholder.css({
            "left": -(ancIndex * widthToMove) + "px"
        });
        base.setCurrentClass();

        base.tracking();
        base.current = ancIndex;

        return false;
    };


    Gallery.prototype.onMouseDrag = function (event) {
        var base = this,
            drag = event.originalEvent ? event.originalEvent : event;


        switch (event.type) {
        case "mousedown":

            base.isDragging = true;
            base.mouseArray.mousedown = drag.pageX;

        case "mousemove":
            if (base.isDragging && base.currentTranslatePosition < base.totalSliderWidth) {

                base.currentTranslatePosition = -(base.currentTranslatePosition + drag.pageX);
                base.animateScreen(base.currentTranslatePosition);
            }

            break;
        case "mouseup":
            base.isDragging = false;
            break;
        default:
            break;
        }
    };


    Gallery.prototype.touchHandler = function (event) {

        var base = this,
            touch = event.originalEvent.touches ? event.originalEvent.touches[0] : event;

        if (event && typeof event.originalEvent !== "undefined") {
            event.preventDefault();

            switch (event.type) {
            case 'touchstart':
            case 'touchmove':
                base.touchArray[event.type].x = touch.pageX;
                base.touchArray[event.type].y = touch.pageY;
                break;
            case 'touchend':
                base.touchArray[event.type] = true;
                if (base.touchArray.touchstart.x > -1 && base.touchArray.touchmove.x > -1) {
                    base.touchArray.direction = base.touchArray.touchstart.x < base.touchArray.touchmove.x ? "right" : "left";
                }
                if (base.touchArray.direction === "left") {
                    base.nextScreenfn();
                } else if (base.touchArray.direction === "right") {
                    base.previousScreenfn();
                }
            default:
                break;
            }
        }

    };

    return Gallery;

});