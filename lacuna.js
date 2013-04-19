(function() {

if (!$.Lacuna || typeof($.Lacuna) === 'undefined') {

		$.Lacuna = {
			alert: function(text) {
				$('#dialog').dialog({
					dialogClass: 'no-close',
					title: 'Alert!',
					modal: true, // Make the background dark.
					show: {
						effect: 'fade',
						duration: 500
					},
					open: function(event, ui) {
						$('#dialogText').html(text);
					},
					close: function(event, ui) {
						$('#dialogText').text('');
					},
					buttons: [{
						text: 'Okay',
						click: function() {
							$(this).parent().fadeOut(500, function() {
								$(this).dialog('destroy').empty().remove();
							});
						}
					}],
					resizable: false
				});
			},
			
			GetSession: function() {
				return this.GameData.ClientData.SessionId || '';
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
			showPulser: function() {
				$('#pulsar').css({'visibility': 'visible'});
			},
	
			hidePulser: function() {
				$('#pulsar').css({'visibility': 'hidden'});
			},
			send: function(args) {
				var data = JSON.stringify({
					'jsonrpc': '2.0',
					'id': 1,
					'method': args.method,
					'params': args.params
				});
		
				this.debug('Sending to server: ' + data);
		
				$.ajax({
					data: data,
					dataType: 'json',
					type: 'POST',
					url: window.url || window.location.protocol + '//' + window.server + '.lacunaexpanse.com' + args.module,
			
					// Callbacks
					success: function (data, status, xhr) {
						
						// Cache the status block for later use.
						if (data.result.status) {
							$.Lacuna.GameData.Status = data.result.status;
							
							// Then delete it from data to avoid duplication of data.
							delete data.result.status;
						}
						
						// 'this' isn't the Lacuna object.
						$.Lacuna.debug('Called ' + args.method + ' with a response of ' + JSON.stringify(data));
						
						if (data.result) {
							// ONWARD!
							args.success(data);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						var error = $.parseJSON(jqXHR.responseText).error;
						
						if (error.code == 1006) {
							$('#lacuna').html('');
							$.Lacuna.Login.build();
								
							$.Lacuna.alert('Session expired. :(');
						}
						else {
							// Call the failure function, or alert popup the human readable error message.
							if (typeof(args.failure) === 'function') {
								args.failure(error);
							}
							else {
								// Same deal as above.
								$.Lacuna.alert(error.message);
							}
						}
					}
				});
			},
	
			GameData: {
				// This is the game cache. For storing things like the: Session Id, E balance, etc, etc.
				ClientData: {},
				Empire: {},
				Status: {}
			},
	
			Panel: {
				NewTabbedPanel: function(tabTitle, tabName, draggable, content) {
					$('#lacuna').append([
						'<div id="', tabName, '" title="', tabTitle, '" style="display:none;">',
						content.join(''),
						'</div>'
					].join(''));
			
					var el = $('#' + tabName);
			
					// Initialize Tabs and fancy Buttons.
					el.tabs();
					$('#' + tabName + ' :button').button();
			
					// .. and then the Dialog that everything sits in.
					el.dialog({
						resizable: false,
						draggable: draggable || false,
						show: {
							effect: 'fade',
							duration: 500
						}
					});
			
					var tabbedPanel = {
						el: el,
						close: function(callback) {
							el.parent().fadeOut(500, function() {
								
								// Clear the DOM element.
								el.dialog('destroy').empty().remove();
								
								// Do the callback.
								if (typeof(callback) != 'undefined') {
									callback();
								}
							});
						}
					};
			
					return tabbedPanel;
				}
			}
		};
	}
})();