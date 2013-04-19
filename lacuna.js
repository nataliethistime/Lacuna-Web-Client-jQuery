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
				NewTabbedPanel: function(name, options, draggable) {
					// This method uses some tricks to generate the HTML that jQuery accepts for tabs.
					// Check out http://jqueryui.com/tabs/ to see what I mean exactly.
					//
					// If you're only just starting in this codebase, please don't worry about how this code works,
					// it's there and I've made it work for you. :)
					
					var tabHeaders = ['<ul>'],
						tabContent = [],
						finalContent = [],
						DOMName = name.replace(' ', '_');
						
					for (var i = 0; i < options.length; i++) {
						var tab = options[i];
							
						tabHeaders[tabHeaders.length] = '<li><a href="#' + DOMName + '_Tab-' + (i + 1) + '">' + tab.name + '</a></li>';
						tabContent[tabContent.length] = '<div id="' + DOMName + '_Tab-' + (i + 1) + '">' + tab.content + '</div>';
					}
						
					// Finish it all off.
					tabHeaders[tabHeaders.length] = '</ul>';
					finalContent = [
						'<div id="', DOMName, '_Tab" title="', name, '">',
							tabHeaders.join(''),
							tabContent.join(''),
						'</div>'
					];
						
					$('#lacuna').append(finalContent.join(''));
						
					var el = $('#' + DOMName + '_Tab');
			
					// Initialize Tabs and fancy Buttons.
					el.tabs();
					$('#' + DOMName + '_Tab' + ' :button').button();
			
					// .. and then the Dialog that everything sits in.
					el.dialog({
						resizable: false,
						draggable: draggable || false,
						show: {
							effect: 'fade',
							duration: 500
						},
						hide: {
							effect: 'fade',
							duration: 500
						}
					});
						
					// Create my custom Panel object.
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