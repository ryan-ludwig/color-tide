$(function() {

	// Safari looks terrible because of sub-pixel rounding problems.  Apologize for them.
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
		alert('Very sorry, but this demo looks terrible in Safari.  Works best in Chrome or Firefox.');
	}

	var	$paletteContainer = $('#palette_container'),
			$colorHolders,
			minPalettes = 1,
			maxPalettes = 16, // the max number of palettes on screen at once
			duration = 3800,
			lover = 'steph6',
			loverMaxPalettes = 1000; // the max number of offsets available to query. This will update when you receive a result from getLoverData.
			loverHash = window.location.hash.substr(1);

	if (loverHash !== '') {
		lover = loverHash;
	}

	$(window).on('hashchange',function(){
		lover = window.location.hash.substr(1);
		getLoverData(lover);
		buildInfoWindow();
	});

	// call the CL API, sets the loverMaxPalettes variable.
	function getLoverData(lover) {
		$.ajax({
			url: 'http://www.colourlovers.com/api/lover/'+lover+'/?format=json&jsonCallback=?',
			dataType: 'jsonp',
			success: function(loverdata){
				console.log(loverdata);
				loverMaxPalettes = loverdata[0].numPalettes;
			}
		});
	}

	function getPalettes(requestUrl, currentRandomNumber) {
		$.ajax({
			url: requestUrl,
			dataType: 'jsonp',
			success: function(data){
				console.log(data, currentRandomNumber);
				drawPalettes(data, currentRandomNumber);
			}
		});
	}

	function drawPalettes(data, currentRandomNumber) {
		// a little counter
		var currently = 0;
		$colorHolders.css('width', '0');

		// reverse the order of the results object, because of the order people do blend palettes on CL.
		// $(data).toArray().reverse();

		$.each(data, function(i, palette){

			var colors = palette.colors;

			//reverse the order of the colors, because of the order people do blend palettes on CL.
			// colors.reverse();

			var widths = palette.colorWidths;

			for (var j = 0; j < colors.length; j++) {
				$colorHolders.eq(currently).css({
					'background': '#'+colors[j],
					'width': widths[j] * (100/currentRandomNumber)+'%'
				});
				currently++;
			}

		});
	}

	function getRandomInteger (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function randomizePalettes() {
		// create a random number between 1 and the maximum number of palettes. This will be used to determine the number of palettes shown on this request.
		var currentRandomNumber = getRandomInteger(minPalettes,maxPalettes);

		// determine the maximum offset we can have based on the total number of palettes the lover has made. This will be used to set a random number for the offset on this request.
		var maxOffset = Math.floor(loverMaxPalettes / currentRandomNumber) - 1;

		// make the API request
		getPalettes('http://www.colourlovers.com/api/palettes/new/?format=json&lover='+lover+'&showPaletteWidths=1&resultOffset='+getRandomInteger(0,maxOffset)+'&numResults='+currentRandomNumber+'&jsonCallback=?', currentRandomNumber);
	}


	// UI stuff
	function buildInfoWindow() {
		$('#lover').html(lover).attr('href', 'http://www.colourlovers.com/lover/'+lover+'/');
	}

	$('#info-link').on('click', function(e) {
		$('#config').toggleClass('is-open');
		e.preventDefault();
	});

	$('#full-screen-toggle').on('click', function() {
		toggleFullScreen();
	});

	function toggleFullScreen() {
		if ((document.fullScreenElement && document.fullScreenElement !== null) ||
			(!document.mozFullScreen && !document.webkitIsFullScreen)) {
			if (document.documentElement.requestFullScreen) {
				document.documentElement.requestFullScreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullScreen) {
				document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			}
	}	else {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}
	}


	function init() {
		// build placeholders for the max amount of colors possible
		for (var i = 0; i<maxPalettes*5; i++) {
			$paletteContainer.append('<div class="color"></div>');
		}
		$colorHolders = $paletteContainer.find('div.color');


		getLoverData(lover);
		buildInfoWindow();
		randomizePalettes();
	}
	init();

  // keep bringing in random the palettes per the duration
  window.setInterval(randomizePalettes, duration);

});
