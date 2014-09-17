define(["jquery", "mainClass", "imagesLoaded"], function ($, Gallery, imagesLoaded) {

	Gallery.prototype.customEvents = function () {

		var base = this;

		base.dDocument.on({
			/*on keyboard navigation*/
			"keydown": function (e) {
				if (e.keyCode === 39 || e.keyCode === 40) {
					base.nextScreenfn();
				} else if (e.keyCode === 37 || e.keyCode === 38) {
					base.previousScreenfn();
				}
			},
			/*on exiting from fullscreen*/
			"fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange": function () {
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
			"orientationchange resize": function () {
				base.setDimensions();
				base.scrollscreen();
			}
		});

		base.previousScreen.on("click", function () {
			base.previousScreenfn();
		});

		base.nextScreen.on("click", function () {
			base.nextScreenfn();
		});

		base.openFullScreen.on("click", function (e) {
			base.fnopenFullScreen();
		});

		base.closeFullScreen.on("click", function (e) {
			base.fnExitFullScreen();
		});

		base.subPlaceholder.on('touchstart touchmove touchend', function (event) {
			base.touchHandler(event, base.subPlaceholder);
		});

		//		base.subPlaceholder.on({
		//			"mousedown mousemove mouseup": function (e) {
		//				base.onMouseDrag(e);
		//			}
		//		});


	};
	return Gallery;

});