require.config({
	paths: {
		baseUrl: 'js/',

		jquery: 'vendor/jquery.min',
		init: 'plugin/gallery/init',
		mainClass: 'plugin/gallery/mainClass',
		helpers: 'plugin/gallery/helpers',
		addEvents: 'plugin/gallery/addEvents',
		addHandlers: 'plugin/gallery/addHandlers',
		mainFullScreen: 'plugin/gallery/fullscreen',
		checkCssSupport: 'plugin/gallery/checkCssSupport',
		imagesLoaded: 'plugin/gallery/vendor/imagesloaded.pkgd'
	}
});




require(["jquery", "mainClass", "helpers", "addHandlers", "addEvents"], function ($, _gallery) {

	(function ($) {
		"use strict";
		$.fn.gallery = function (options) {
			return this.each(function (i, v) {
				if (window.newGallery === undefined) {
					window.newGallery = [];
				}
				newGallery[i] = new _gallery(this, options);
				return newGallery;
			});
		};

	}($));


	$(function () {
		"use strict";
		$("#plot").gallery({
		  transition:"fadeInRight"
		});
	});

});
