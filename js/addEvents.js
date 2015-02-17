define(["jquery", "mainClass", "imagesLoaded", "touchevents"], function($, Gallery, imagesLoaded, touchevents) {
    Gallery.prototype.customEvents = function() {
        var base = this;
        base.dDocument.on({
            /*on keyboard navigation*/
            "keydown": function(e) {
                if (e.keyCode === 39 || e.keyCode === 40) {
                    base.nextScreenfn();
                } else if (e.keyCode === 37 || e.keyCode === 38) {
                    base.previousScreenfn();
                }
            },
            /*on exiting from fullscreen*/
            "fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange": function() {
                var onFullScreen =
                    document.fullscreenElement ||
                    document.mozFullScreenElement ||
                    document.webkitFullscreenElement ||
                    document.msFullscreenElement;
                if (!onFullScreen) {
                    base.fnExitFullScreen();
                }
            }
        });
        base.wWindow.on({
            "orientationchange resize": function() {
                clearTimeout(base.setTime);
                base.setTime = setTimeout(function() {
                    base.init();
                }, 250);
                //              base.setDimensions();
                //              base.scrollscreen();
            }
        });
        base.previousScreen.on("click", function() {
            base.previousScreenfn();
        });
        base.nextScreen.on("click", function() {
            base.nextScreenfn();
        });
        base.openFullScreen.on("click", function(e) {
            base.fnopenFullScreen();
        });
        base.closeFullScreen.on("click", function(e) {
            base.fnExitFullScreen();
        });
        base.largePlaceholder.on('touchstart mousedown', {
            action: 'start',
            referenceGallery: base
        }, base.swipeHandler);
        base.largePlaceholder.on('touchmove mousemove', {
            action: 'move',
            referenceGallery: base
        }, base.swipeHandler);
        base.largePlaceholder.on('touchend mouseup touchcancel', {
            action: 'end',
            referenceGallery: base
        }, base.swipeHandler);
        base.largePlaceholder.on('touchcancel mouseleave', {
            action: 'end',
            referenceGallery: base
        }, base.swipeHandler);
    };
    return Gallery;
});
