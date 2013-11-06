$(function() {   

	// Safari looks terrible because of sub-pixel rounding problems.  Appologize for them.
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
		alert('Very sorry, but this demo looks terrible in Safari.  Works best in Chrome or Firefox.');
	}

	var $paletteContainer = $('#palette_container'),
			$colorHolders,
			maxPalettes = 12,
			// lover = 'sinar',
			// lover = 'tvr',	
			// lover = 'mravka',
			// lover = 'sero*',
			// lover = 'GlueStudio',
			// lover = 'ちょわ もさ',
			lover = 'Dimitris',
			// lover = 'yray',
			// lover = 'isotope.151',
			// lover = 'Julee',
			// lover = 'tsukasaokazaki',
			// lover = 'yeunique',
			// lover = 'dammar', //no license
			// lover = 'cstallions', //no license
			// lover = 'LUCIFUGE ROFOCALE', //no license
			duration = 3800,
			loverMaxPalettes = 100;
			loverHash = window.location.hash.substr(1);

	if (loverHash !== '') {
		lover = loverHash;
	}

	function init() {
		// build placeholders the max amount of colors possible
		for (var i = 0; i<maxPalettes*5; i++) {
			$paletteContainer.append('<div class="color"></div>');
		};
		$colorHolders = $paletteContainer.find('div.color');
		
		getLoverData(lover);
		randomizePalettes();
		console.log(loverHash);
	};
	init();

	// calls the CL API, and sets the loverMaxPalettes variable higher in the scope. Only runs once.
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

		$.each(data, function(i, palette){

			var colors = palette.colors;
			var widths = palette.colorWidths;

			for (var j = 0; j < colors.length; j++) {
				$colorHolders.eq(currently).css({
					'background': '#'+colors[j],
					'width': widths[j] * (100/currentRandomNumber)+'%'
				});
				currently++;
			};

		});
	}

	function getRandomInteger (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function randomizePalettes() {
		// create a random number between 1 and the maximum number of palettes. This will be used to determine the number of palettes shown on this request.
		var currentRandomNumber = getRandomInteger(1,maxPalettes);

		// determine the maximum offset we can have based on the total number of palettes the lover has made. This will be used to set a random number for the offset on this request.
		var maxOffset = Math.floor(loverMaxPalettes / currentRandomNumber) - 1;

		// make the API request
		getPalettes('http://www.colourlovers.com/api/palettes/new/?format=json&lover='+lover+'&showPaletteWidths=1&resultOffset='+getRandomInteger(0,maxOffset)+'&numResults='+currentRandomNumber+'&jsonCallback=?', currentRandomNumber);
	}

	// randomize the palettes per the duration
	window.setInterval(randomizePalettes, duration);





	// UI stuff
	$('#lover').append(lover).attr('href', 'http://www.colourlovers.com/lover/'+lover+'/');
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
	  } else {  
		if (document.cancelFullScreen) {  
			document.cancelFullScreen();  
		} else if (document.mozCancelFullScreen) {  
			document.mozCancelFullScreen();  
		} else if (document.webkitCancelFullScreen) {  
			document.webkitCancelFullScreen();  
		}  
	  }  
	} 

});
