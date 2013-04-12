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
		
		console.log('Sending to server: ' + data); // debug
		
		$.ajax({
			data: data,
			dataType: 'json',
			type: 'POST',
			url: window.location.protocol + '//' + window.server + '.lacunaexpanse.com' + args.module,
			
			// Callbacks
			success: function (data, status, xhr) {
				console.log('Called ' + args.method + ' with a response of ' + JSON.stringify(data)); // debug
				args.success(data);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR.responseText); //debug
				
				var error = $.parseJSON(jqXHR.responseText).error;
				
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