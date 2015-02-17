define(["jquery", "mainClass", "mainFullScreen"], function ($, Gallery, fs_function) {


    Gallery.prototype.previousScreenfn = function () {
        var base = this;

        base.tracking();
        base.current = base.current - base.options.steps;


        if (base.options.isCycle) {

            if (((base.current + base.options.steps) - base.options.multipleSlides) < 0) {

                base.$el.addClass('noAnimate');

                base.tracking();
                base.current = base.current + base.orgNoOfSlides + base.options.steps;

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

        base.tracking();
        base.current = base.options.multipleSlides + (ancIndex * base.options.steps);

        base.currentDot = base.current;

        base.scrollscreen();

        return false;
    };



    return Gallery;

});