define(["jquery", "mainClass"], function ($, Gallery) {


	Gallery.prototype.swipeStart = function (event) {

		var base = this,
			touches;

		base.$el.addClass('noAnimate dragging');

		if (base.touchObject.fingerCount !== 1) {
			base.touchObject = {};
			return false;
		}

		if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
			touches = event.originalEvent.touches[0];
		}

		base.touchObject.startX = base.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
		base.touchObject.startY = base.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

		base.dragging = true;

		console.log('start');

	};

	Gallery.prototype.swipeMove = function (event) {

		var base = this,
			curLeft, swipeDirection, positionOffset, touches, currentinDecimal;

		touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

		curLeft = base.currentTranslatePosition;

		if (!base.dragging || touches && touches.length !== 1) {
			return false;
		}

		base.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
		base.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

		base.touchObject.swipeLength = Math.round(Math.sqrt(
			Math.pow(base.touchObject.curX - base.touchObject.startX, 2)));


		swipeDirection = base.swipeDirection();

		if (swipeDirection === 'vertical') {
			return;
		}

		if (event.originalEvent !== undefined && base.touchObject.swipeLength > 4) {
			event.preventDefault();
		}

		positionOffset = base.touchObject.curX > base.touchObject.startX ? 1 : -1;

		base.swipeLeft = curLeft + base.touchObject.swipeLength * positionOffset;

		if (base.options.touchMove === false) {
			return false;
		}

		var changeCase = base.swipeLeft < 0 ? (-1 * base.swipeLeft) : (1 * base.swipeLeft);


		base.tracking();
		currentinDecimal = changeCase / base.xSize;
		base.current = Math.floor(currentinDecimal);

		//console.log(currentinDecimal + base.options.multipleSlides, base.noOfSlides)

		if (currentinDecimal + base.options.multipleSlides >= base.noOfSlides - 1) {

			var pointsToMove = -1 * ((base.swipeLeft) + (base.current * base.xSize) + ((base.current - base.orgNoOfSlides) * base.xSize));
			base.current = base.current - base.orgNoOfSlides;
			base.swipeLeft = pointsToMove;

			//base.scrollscreenWA(pointsToMove);
			//base.animateScreen(base.swipeLeft);
			base.subPlaceholder.css({
				"transform": "translate3d(" + base.swipeLeft + "px,0,0)"
			});
			base.currentTranslatePosition = base.swipeLeft;
			//            base.flag = true;
			//            console.log('on target' + base.swipeLeft, base.touchObject);
			base.touchObject.startX = base.touchObject.curX
			//debugger
		} else {

			base.animateScreen(base.swipeLeft);
			//            if (base.flag) {
			//                console.log('on usual' + base.swipeLeft, base.touchObject);
			//                base.flag = false;
			//            }
		}




		//		console.log(currentinDecimal);
		//
		//		if (swipeDirection === 'right') {
		//			base.current = Math.floor(currentinDecimal);
		//		} else {
		//			base.current = Math.ceil(currentinDecimal);
		//		}

		//        base.current = Math.floor(currentinDecimal);
		//
		//        if (base.current > base.orgNoOfSlides) {
		//            base.current = 0;
		//            base.scrollscreenWA(base.swipeLeft + ((base.orgNoOfSlides + 1) * base.xSize));
		//            debugger
		//        } else {
		//            base.animateScreen(base.swipeLeft);
		//        }


		//		base.tracking();
		//
		//		if (base.current < base.options.multipleSlides) {
		//			base.current = base.current + base.orgNoOfSlides;
		//			base.scrollscreenWA(-((currentinDecimal + base.orgNoOfSlides) * base.xSize));
		//			console.log(base.current, "1");
		//			return false;
		//		} else if (base.current >= base.noOfSlides - base.options.multipleSlides) {
		//			base.current = base.current - base.orgNoOfSlides;
		//			base.scrollscreenWA(base.swipeLeft + (base.orgNoOfSlides * base.xSize));
		//			// debugger
		//			console.log(base.current, "2");
		//			return false;
		//		} else {
		//			base.animateScreen(base.swipeLeft);
		//		}



		//console.log(base.current);
		//console.log('move');
	};

	Gallery.prototype.swipeEnd = function (event) {

		//debugger
		var base = this;

		//base.currentTranslatePosition = base.swipeLeft;
		base.$el.removeClass('noAnimate dragging');
		base.dragging = false;


		if (base.touchObject.curX === undefined) {
			return false;
		}

		//if (base.touchObject.swipeLength >= base.touchObject.minSwipe) {
		//        $(event.target).on('click.slick', function (event) {
		//            event.stopImmediatePropagation();
		//            event.stopPropagation();
		//            event.preventDefault();
		//            $(event.target).off('click.slick');
		//        });

		switch (base.swipeDirection()) {
		case 'left':
			base.current = base.current + 1;
			break;

		case 'right':
			base.current = base.current - 1;
			break;
		}
		base.scrollscreen();
		//}


		//console.log('end');

	};

	Gallery.prototype.swipeDirection = function () {

		var xDist, yDist, r, swipeAngle, base = this;

		xDist = base.touchObject.startX - base.touchObject.curX;
		yDist = base.touchObject.startY - base.touchObject.curY;
		r = Math.atan2(yDist, xDist);

		swipeAngle = Math.round(r * 180 / Math.PI);
		if (swipeAngle < 0) {
			swipeAngle = 360 - Math.abs(swipeAngle);
		}

		if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
			return 'left';
		}
		if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
			return 'left';
		}
		if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
			return 'right';
		}

		return 'vertical';

	};

	Gallery.prototype.swipeHandler = function (event) {

		var base = event.data.referenceGallery;


		base.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;

		base.touchObject.minSwipe = 10;

		switch (event.data.action) {

		case 'start':
			base.swipeStart(event);
			break;

		case 'move':
			base.swipeMove(event);
			break;

		case 'end':
			base.swipeEnd(event);
			break;

		}

	};

	return Gallery;

})
