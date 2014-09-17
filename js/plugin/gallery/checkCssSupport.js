define(function () {
	//check for 3d translate support
	var checkSupport = {
		tempElem: document.createElement("div"),
		msieversion: function () {
			var self = this;
			var ua = window.navigator.userAgent;
			var msie = ua.indexOf("MSIE ");
			if (msie > 0) // If Internet Explorer, return version number
			{
				alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
			} else // If another browser, return 0
			{
				alert('otherbrowser');
			}
		},
		checkCssProperty: function (prop, format) {
			/*translate3D = "translate3d(0px, 0px, 0px)"*/
			var self = this;
			this.tempElem.style.cssText = "-moz-" + prop + ":" + format + "; -ms-" + prop + ":" + format + "; -o-" + prop + ":" + format + "; -webkit-" + prop + ":" + format + "; " + prop + ":" + format;

			return this.tempElem.style.cssText.length > 0;
		}
	}
	return checkSupport;
});


//var animation = false,
//    animationstring = 'animation',
//    keyframeprefix = '',
//    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
//    pfx  = '';
//
//if( elm.style.animationName !== undefined ) { animation = true; }    
//
//if( animation === false ) {
//  for( var i = 0; i < domPrefixes.length; i++ ) {
//    if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
//      pfx = domPrefixes[ i ];
//      animationstring = pfx + 'Animation';
//      keyframeprefix = '-' + pfx.toLowerCase() + '-';
//      animation = true;
//      break;
//    }
//  }
//}