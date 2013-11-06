$(function() {   

	var $palette_container = $('#palette_container'),
			$color_holders,
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

	function init() {
		// build placeholders the max amount of colors possible
		for (var i = 0; i<maxPalettes*5; i++) {
			$palette_container.append('<div class="color"></div>');
		};
		$color_holders = $palette_container.find('div.color');
		
		getLoverData(lover);
		randomizePalettes();
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
		$color_holders.css('width', '0');

		$.each(data, function(i, palette){

			var colors = palette.colors;
			var widths = palette.colorWidths;

			for (var j = 0; j < colors.length; j++) {
				$color_holders.eq(currently).css({
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


	window.setInterval(randomizePalettes, duration);


});
