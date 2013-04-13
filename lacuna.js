var Lacuna = {
	alert: function(text) {
		$('#dialog').dialog({
			dialogClass: 'no-close',
			title: 'Alert!',
			modal: true, // Make the back ground black.
			show: 500, // Show animation duration.
			hide: 500, // Hide animation duration.
			open: function(event, ui) {
				$('#dialogText').text(text);
			},
			close: function(event, ui) {
				$('#dialogText').text('');
			},
			buttons: [{
				text: 'Okay',
				click: function() {
					$(this).dialog('close');
				}
			}]
		});
	},
	
	// Posts a debug message if debug mode is switched on,
	// either via the URL parameter or window.debug
	// decalred in index.html.
	debug: function(message) {
		// Check if debug mode is on.
		if (window.debug || window.location.toString().search('debug') > 0) {
			// I work on Firefox with Firebug, it's the best! XD
			if (window.console && (window.console.firebug || window.console.exception)) {
				console.info(message);
			}
			else {
				console.log('DEBUG: ' + message);
			}
		}
	},
	showPulsar: function() {
		$('#pulsar').css({'visibility': 'visible'});
	},
	
	hidePulsar: function() {
		$('#pulsar').css({'visibility': 'hidden'});
	},
	send: function(args) {
		var data = JSON.stringify({
			'jsonrpc': '2.0',
			'id': 1,
			'method': args.method,
			'params': args.params
		});
		
		Lacuna.debug('Sending to server: ' + data);
		
		$.ajax({
			data: data,
			dataType: 'json',
			type: 'POST',
			url: window.url || window.location.protocol + '//' + window.server + '.lacunaexpanse.com' + args.module,
			
			// Callbacks
			success: function (data, status, xhr) {
				Lacuna.debug('Called ' + args.method + ' with a response of ' + data);
				args.success(data);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				var error = $.parseJSON(jqXHR.responseText).error;
				
				// Call the failure function, or alert popup the human readable error message.
				if (typeof(args.failure) === 'function') {
					args.failure(error);
				}
				else {
					Lacuna.alert(error.message);
				}
			}
		});
	},
	
	GameData: {
		// This is the game cache. For storing things like the: session Id, E balance, etc, etc.
	}
};