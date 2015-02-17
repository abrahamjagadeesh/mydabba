define(["jquery", "mainClass", "checkCssSupport"], function ($, Gallery, checkCssSupport) {

    Gallery.prototype.rebuild = function () {
        var base = this;
        //base.$el.removeClass();
        base.$el.find('.level-three').remove();
        base.cloneFirst && base.cloneFirst.remove();
        base.clonelast && base.clonelast.remove();
    };

    Gallery.prototype.createHTMLForCyclic = function () {

        var base = this;

        base.cloneFirst = base.wrapper.filter(":lt(" + base.options.multipleSlides + ")").clone(true);
        base.clonelast = base.wrapper.filter(":gt(" + (base.noOfSlides - base.options.multipleSlides - 1) + ")").clone(true);

        base.subPlaceholder.append(base.cloneFirst).prepend(base.clonelast);
        base.tracking();
        base.current = base.options.multipleSlides;

        // reassign the wrapper variable
        base.wrapper = base.subPlaceholder.find(".bucket");
        base.orgNoOfSlides = base.noOfSlides;
        base.noOfSlides = base.wrapper.length;
        base.setDimensions();
        base.scrollscreen();

    };


    Gallery.prototype.tracking = function () {
        var base = this;
        base.oldest = base.old;
        base.old = base.current;
    };


    Gallery.prototype.fnIsResponsive = function () {
        var base = this;
        return (base.wWindow.width() < base.$el.width()) || base.isFullScreen ? true : false;
    };

    Gallery.prototype.setDimensions = function () {
        var base = this;
        base.isResponsive = base.fnIsResponsive();

        /*calculate*/
        base.xSize = (base.isResponsive ? base.wWindow.width() : base.$el.width()) / base.options.multipleSlides;

        //        if (base.options.maxHeight > 0) {
        //            base.ySize = (base.options.maxHeight * base.xSize) / base.options.maxHeight;
        //        }

        if (base.isFullScreen) {
            base.xSize = base.screen.width;
            base.ySize = base.screen.height;
        }

        /*set*/
        base.wrapper.width(base.xSize);

        //base.totalSliderWidth = base.xSize * base.noOfSlides * base.options.multipleSlides;
        base.totalSliderWidth = base.xSize * base.noOfSlides;
        base.subPlaceholder.width(base.totalSliderWidth);

        base.setLayout();

    };

    Gallery.prototype.setLayout = function () {
        var base = this;

        var slide = 0;
        for (slide; slide < base.noOfSlides; slide++) {
            //var pointsToMove = (base.options.multipleSlides > 1) ? (slide * base.xSize) : 0;
            var pointsToMove = slide * base.xSize;

            if (base.isTranslate3d) {
                base.wrapper.eq(slide).css({
                    "transform": "translate3d(" + pointsToMove + "px,0,0)"
                });
            } else if (base.isTranslate2d) {
                base.wrapper.eq(slide).css({
                    "transform": "translate(" + pointsToMove + "px,0)"
                });
            } else {
                base.wrapper.eq(slide).css({
                    "left": pointsToMove + "px"
                });
            }


        }
    };


    Gallery.prototype.setImages = function () {
        var base = this;
        base.wrapper.find('.lid').each(function () {
            var imgSrc = $(this).find("img");
            $(this).css("backgroundImage", "url(" + imgSrc.attr("src") + ")").height(base.options.maxHeight);
            imgSrc.remove();
        });
    };

    Gallery.prototype.setClassName = function () {

        var base = this;
        base.$el.addClass(base.options.transition);

    };

    Gallery.prototype.scrollscreen = function () {
        var base = this,
            pointsToMove = -(base.current * base.xSize);


        base.currentTranslatePosition = pointsToMove;
        base.animateScreen(pointsToMove);
    };

    Gallery.prototype.scrollscreenWA = function (pointsToMove) {
        var base = this;
        base.currentTranslatePosition = pointsToMove;
        base.animateScreen(pointsToMove);
    };



    Gallery.prototype.animateScreen = function (pointsToMove) {
        var base = this;

        base.setCurrentClass();

        //		var newCurrent = base.wrapper.eq(base.current);
        //		var newHeight = newCurrent.height();
        //
        //		if (newHeight > base.ySize) {
        //			newHeight = base.ySize;
        //			newCurrent.addClass("controlHeight").height(newHeight);
        //
        //		}



        //if (base.options.multipleSlides > 1) {
        if (base.isTranslate3d) {
            base.subPlaceholder.css({
                "transform": "translate3d(" + pointsToMove + "px,0,0)"
            });
        } else if (base.isTranslate2d) {
            base.subPlaceholder.css({
                "transform": "translate(" + pointsToMove + "px,0)"
            });
        } else {
            base.subPlaceholder.css({
                "left": pointsToMove + "px"
            });
        }
        //}


    };


    Gallery.prototype.setCurrentClass = function () {

        var base = this;

        base.$el[base.current < base.old ? "addClass" : "removeClass"]("reverse");

        base.wrapper.removeClass("oldSlide activeSlider currentSlider");


        //base.wrapper.eq(base.old).addClass("oldSlide");
        //base.wrapper.eq(base.current).addClass("currentSlider");

        //console.time("a")
        //base.wrapper.eq(base.current).nextUntil(base.wrapper.eq(base.current + 3)).addClass('activeSlider');
        //console.timeEnd("a")


        //		if (base.old !== -10000) {
        //			var old = base.old;
        //			var allOld = old + 2;
        //			for (old; old < allOld; old++) {
        //				console.log(old, allOld);
        //				base.wrapper.eq(old).addClass('oldSlide');
        //			}
        //		}


        var current = base.current;
        var allActive = current + base.options.multipleSlides;
        var tallSlide = 0;

        for (current; current < allActive; current++) {
            var slide = base.wrapper.eq(current);
            var slideHeight = slide.height();

            if (slideHeight > tallSlide) {
                tallSlide = slideHeight;
            }
            if (base.current === current) {
                slide.addClass('currentSlider');
            }
            slide.addClass('activeSlider');
        }

        base.dots.removeClass('currentDot');
        //base.dots.eq(base.options.steps - (Math.ceil((base.current + 1) / base.options.steps))).addClass('currentDot');
        base.dots.eq(Math.floor(base.current / base.options.steps) - 1).addClass('currentDot');
        // console.log(base.current, base.options.steps, base.options.multipleSlides);


        base.subPlaceholder.height(tallSlide);
    };


    Gallery.prototype.createDotsNavigation = function () {
        var base = this,
            slides = 0,
            per = Math.ceil(base.noOfSlides / base.options.steps),
            _div = $('<div>').attr({
                'class': 'dotNavigation'
            });

        for (slides; slides < per; slides += 1) {
            var _figure = $('<figure class="dotMenu">'),
                _span = $('<span>');
            _span.appendTo(_figure);
            _figure.appendTo(_div).on('click', function () {
                base.onThumbClick(this, base);
            });
        }
        var level_three = $("<div>").attr({
            'class': 'level-three'
        });
        level_three.appendTo(base.$el);
        //console.log(_div.find(".dotMenu").length)
        level_three.html(_div);

        base.dots = level_three.find('.dotMenu');

    };



    //
    //
    //    Gallery.prototype.createDotsNavigation = function () {
    //        var base = this,
    //            slides = 0,
    //            _div = $('<div>').attr({
    //                'class': 'dotNavigation'
    //            });
    //
    //
    //        for (slides; slides < base.noOfSlides; slides += 1) {
    //            var _figure = $('<figure class="dotMenu">'),
    //                _span = $('<span>');
    //            _span.appendTo(_figure);
    //            _figure.appendTo(_div).on('click', function () {
    //                base.onThumbClick(this, base);
    //            });
    //        }
    //
    //        _div.appendTo(base.$el);
    //
    //
    //    };//
    //
    //

    //
    //    Gallery.prototype.moveThumbs = function () {
    //        var base = this;
    //
    //        base.number = Math.floor(base.current / base.visibleThumbs);
    //        base.srollthumb();
    //        base.setCurrentClass(base.current);
    //    };
    //
    //    Gallery.prototype.moveScreens = function () {
    //        var base = this;
    //
    //        base.current = base.number * base.visibleThumbs;
    //        base.scrollscreen(false, false);
    //        base.setCurrentClass(base.current);
    //    };
    //






    Gallery.prototype.destroy = function () {
        var base = this;

        base.subPlaceholder.removeAttr("style");
        //base.thumbCover.removeAttr("style");
        base.wrapper.removeAttr("style");
        base.setCurrentClass();
        base.$el.removeAttr('class').addClass('slider');
        if (base.isFullScreen) {
            base.$el.addClass('fullScreen');
        }
        base.$el.find('.dotNavigation').remove();
    };


    return Gallery;
});