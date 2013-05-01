(function() {

if (!$.Lacuna || typeof($.Lacuna) === 'undefined') {

		$.Lacuna = {
			// Simple dialog in replacement of Javascript's
			// alert() function. This one allows the title
			// bar text to be specified. Also, it's got
			// fades and fancy styles that allow it to fit
			// in with the rest of the client. :)
			alert: function(text, title) {
				$(document.createElement('div')).dialog({
					title: title || 'Woopsie!',
					modal: true, // Make the background dark.
					show: {
						effect: 'fade',
						duration: 500
					},
					hide: {
						effect: 'fade',
						duration: 500
					},
					open: function(event, ui) {
						$(this).html(text);
					},
					close: function() {
						$(this).dialog('destroy');
					},
					buttons: [{
						text: 'Okay',
						click: function() {
							$(this).dialog('close');
						}
					}],
					resizable: false
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

			// Function for sending data to the server. An
			// object is passed in which looks like the 
			// following:
			//
			//{
			//	method: 'login',
			//	module: '/empire',
			//	params: [
			//		'$stuff'
			//	],
			//	success: function(receivedData){},
			//	failure: function(receivedError){}
			//}
			send: function(args) {
				// Show the Blue "loading" animation.
				$.Lacuna.showPulser();
				
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

						// And finally, hide the "loading" animation.
						$.Lacuna.hidePulser();
					},
					error: function (jqXHR, textStatus, errorThrown) {
						// Hide the "loading" animation.
						$.Lacuna.hidePulser();

						// Get the error block the server returned.
						var error = $.parseJSON(jqXHR.responseText).error;
						
						if (error.code == 1006) {
							// Clear all the panels.
							$('#lacuna').fadeOut(500, function() {
								$('#lacuna').html('');
								$.Lacuna.Login.build();
								
								$.Lacuna.alert('Session expired. :(');
							});
						}
						else {
							// Call the failure function, or alert the human readable error message.
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

			// Utility functions/helpers.
			getSession: function() {
				return this.GameData.ClientData.SessionId || '';
			},
			getCurrentPlanet: function() {
				return this.GameData.Status.body.id || '';
			},
			showPulser: function() {
				$('#pulser').css('visibility', 'visible');
			},
	
			hidePulser: function() {
				$('#pulser').css('visibility', 'hidden');
			},
			
			// This is the game cache. For storing things like the: Session Id, Status, etc etc...
			GameData: {
				ClientData: {},
				Empire: {},
				Status: {}
			},
			
			// All the fun stuff with Panels.
			Panel: {
				newTabbedPanel: function(/*name, options, draggable*/ panel) {
					// This method uses some tricks to generate the HTML that jQuery accepts for tabs.
					// Check out http://jqueryui.com/tabs/ to see what I mean exactly.
					//
					// If you're only just starting in this codebase, please don't worry about how this code works,
					// it's there and I've made it work for you. :)
					
					var tabHeaders   = ['<ul>'],
						tabContent   = [],
						finalContent = [],
						DOMName      = panel.name.replace(' ', '_'); // So the DOM doesn't get confused.
						
					for (var i = 0; i < panel.tabs.length; i++) {
						var tab = panel.tabs[i];
							
						tabHeaders[tabHeaders.length] = '<li><a href="#' + DOMName + '_Tab-' + (i + 1) + '">' + tab.name + '</a></li>';
						tabContent[tabContent.length] = '<div id="' + DOMName + '_Tab-' + (i + 1) + '">' + tab.content + '</div>';
					}
						
					// Finish it all off.
					tabHeaders[tabHeaders.length] = '</ul>';
					finalContent = [
						'<div id="', DOMName, '_Tab" title="', panel.name, '">',
							// Place stuff above the tabs.
							panel.preTabContent ? panel.preTabContent : '',
							
							// Then the Tabs themselves.
							tabHeaders.join(''),
							tabContent.join(''),
						'</div>'
					];
						
					$('#lacuna').append(finalContent.join(''));

					// Do this here to get a current version of the DOM Object.
					var el = $('#' + DOMName + '_Tab');

					// Create my custom Panel object.
					// Do this up here so that it can be used in .tabs().
					var tabbedPanel = {
						el: el,
						close: function(callback) {
							el.parent().fadeOut(500, function() {
								
								// Clear the DOM element.
								el.dialog('destroy').empty().remove();
								
								// Run the callback, if there is one.
								if (typeof(callback) != 'undefined') {
										callback();
								}
							});
						},
						gotoTab: function(index) {
							el.tabs('option', 'selected', index);
						}
					};

					// Do some fancy Buttons!
					$('#' + DOMName + '_Tab' + ' :button').button();
			
					// .. and then the Dialog that everything sits in.
					el.dialog({
						resizable: false,
						draggable: panel.draggable || false,
						width: panel.width || $.Lacuna.Panel.panelWidth,
						show: {
							effect: 'fade',
							duration: 500
						},
						hide: {
							effect: 'fade',
							duration: 500,
						},
						open: function() {
							// Initialize Tabs when the Dialog opens.
							el.tabs({
								active: 0, // Set the defualt tab open to the first one.
								heightStyle: 'auto',
								select: function(event, ui) {
									var tab = panel.tabs[ui.index];

									if (typeof(tab.select) === 'function') {
										tab.select(tabbedPanel);
									}
								}
							});
						},
						close: function() { // Called when the Dialog is closed with the 'X'.
							// Clear the DOM element.
							el.dialog('destroy').empty().remove();
						}
					});
					
					return tabbedPanel;
				}
			}
		};
	}
})();