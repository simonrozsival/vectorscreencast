
var AudioPlayer = (function() {

	var playing, reachedEnd;
	var audio;
	var initSuccessful;

	function AudioPlayer(sources, events) {

		// create audio element
		audio = HTML.createElement("audio", {
			preload: "auto"
		});

		// default value - if something fails, it will remain set to 'false'
		initSuccessful = false;

		if(audio.canPlayType == undefined) {
			console.log("ERROR: browser does not support HTML5 audio");
			return;
		}

		// the audio is stopped when the page is loaded
		audio.autoplay = false;
		playing = false;
		reachedEnd = false;

		// add sources
		var canPlaySound = false;
		for (var source in sources) {
			var contentType = "audio/" + sources[source].type;

			if(!!audio.canPlayType(contentType)) {	
				// can play type returned "probably" or "maybe"
				// it would return "" if this browser does not support this type (-> I use "!!" to convert string to boolean (empty string -> false))
				var source = HTML.createElement("source", {
					type: contentType,
					src: sources[source].file
				});
				audio.appendChild($source);
				canPlaySound = true;
			}
		}

		// check if at least one source is probably acceptable
		if(canPlaySound == true) {
			// init was successful
			initSuccessful = true;

			// default system events
			attachPrivateEvents.call(this);

			// user can pass his events for the audio element
			attachEvents.call(this, events);

			// attach the player to the document
			$("body").append($audio);
			console.log("Audio is available.");
		} else {
			console.log("Can't play any provided audio sources.");
		}

	}

	AudioPlayer.prototype.isReady = function() {
		return initSuccessful;
	};

	//
	// private functions section:
	// 
	
	var attachPrivateEvents = function() {
		audio.onended = function() {
			playing = false;
			reachedEnd = true;
			console.log("(audio reached end)");
		};

		audio.onpause = function() {
			if(playing) {
				VideoEvents.trigger("pause");
			}
		};

		audio.ontimeupdate = function(e) {
			reportCurrentTime();			
		};
		
		VideoEvents.on("start", function() {
			play();
		});

		VideoEvents.on("pause", function() {
			pause();
		});

		VideoEvents.on("reached-end", function() {
			reachedEnd = true;
			pause();
		});

		VideoEvents.on("replay", function() {
			rewind();
			play();
		});

		VideoEvents.on("skip-to", function(e, progress) {
			reachedEnd = false; // if I was at the end and I changed the position, I am not at the end any more!
			changePosition(audio.duration * progress);
		});

		// Has the browser preloaded something since last time?
		// Change the css styles only if needed.
		var lastEnd = null;
		var checkPreloaded = setInterval(function() {
			if(audio.canPlayThrough) {
				clearInterval(checkPreloaded);
			} else {
				var end = audio.buffered.end(audio.buffered.length - 1); 
				if(end !== lastEnd) {
					VideoEvents.trigger("buffered-until", end);
					lastEnd = end;
				}
			}
		}, 1000); // every second check, how much is preloaded
	};
	

	var attachEvents = function(events) {
		events = events || [];
		for (var eventName in events) {
			$audio.on(eventName, events[eventName]);
		}
	};

	var play = function() {
		if(initSuccessful) {
			if(reachedEnd == true) {
				rewind();
			}

			audio.play();
		}
	};

	var pause = function() {
		if(initSuccessful) {
			audio.pause();
		}
	};

	var rewind = function() {
		if(initSuccessful) {
			audio.pause();
			audio.currentTime = 0;
			reachedEnd = false;
		}
	};

	var changePosition = function(seconds, callback) {
		console.log("audio - change position to " + seconds + "s");
		audio.currentTime = seconds;
		$audio.on("canplay", callback);
	};

	var reportCurrentTime = function() {
		VideoEvents.trigger("current-time", $audio[0].currentTime);
	};

	return AudioPlayer;

})();