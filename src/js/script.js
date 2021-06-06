whenDOMReady(() => {
	// burger mobile menu
	const burger = document.querySelector('.burger')
	const menu = document.querySelector('.menu-mobile')
	burger.addEventListener('click', (event) => {
		event.preventDefault();
		burger.classList.toggle('close')
		menu.classList.toggle('show')
	})

	// // Replace all SVG images with inline SVG
	// 		jQuery('img.svg').each(function(){
	// 				var $img = jQuery(this);
	// 				var imgID = $img.attr('id');
	// 				var imgClass = $img.attr('class');
	// 				var imgURL = $img.attr('src');

	// 				jQuery.get(imgURL, function(data) {
	// 						// Get the SVG tag, ignore the rest
	// 						var $svg = jQuery(data).find('svg');

	// 						// Add replaced image's ID to the new SVG
	// 						if(typeof imgID !== 'undefined') {
	// 								$svg = $svg.attr('id', imgID);
	// 						}
	// 						// Add replaced image's classes to the new SVG
	// 						if(typeof imgClass !== 'undefined') {
	// 								$svg = $svg.attr('class', imgClass+' replaced-svg');
	// 						}

	// 						// Remove any invalid XML tags as per http://validator.w3.org
	// 						$svg = $svg.removeAttr('xmlns:a');

	// 						// Replace image with new SVG
	// 						$img.replaceWith($svg);

	// 				}, 'xml');

	// 		});


	// Smooth scroll to anchor

		 // $('a[href*=#]').bind("click", function(e){
			// 	var anchor = $(this);
			// 	$('html, body').stop().animate({
			// 		 scrollTop: $(anchor.attr('href')).offset().top
			// 	}, 1000);
			// 	e.preventDefault();
			// 	return false;
		 // });

	// // fancybox
	// 	$("a#single_image").fancybox();
	// 	/* Using custom settings */
	// 	$("a#inline").fancybox({
	// 		'hideOnContentClick': true
	// 	});
	// 	/* Apply fancybox to multiple items */
	// 	$(".gal a").fancybox({
	// 		'transitionIn'	:	'elastic',
	// 		'transitionOut'	:	'elastic',
	// 		'speedIn'		:	600,
	// 		'speedOut'		:	200,
	// 		'overlayShow'	:	false
	// 	});
	// 	$("a[href$='.jpg'],a[href$='.png'],a[href$='.gif']").attr('rel', 'gallery').fancybox();

	// // wisija form label fix
	// 	$('#form-wysija-2 .wysija-input').attr('placeholder', 'Электронная почта');

})

function whenDOMReady(func) {
	if (document.readyState !== 'loading')
	  func()
	else
	  document.addEventListener('DOMContentLoaded', func)
}
