define(['jquery', 'underscore', 'body', 'jqueryUI'], function($, _, body) {
    function Lacuna() {
 
        // Helper for jQuery's weird scope management.
        var scope = this;
        var status;
        var sessionId = 0;

        // Helper function for the below confirm() and alert().
        this.dialog = function(args) {
            $(document.createElement('div')).dialog({
                title: args.title || 'Woopsie!',
                modal: args.modal || true, // Make the background dark.
                show: {
                    effect: 'fade',
                    duration: 500
                },
                hide: {
                    effect: 'fade',
                    duration: 500
                },
                open: function(event, ui) {
                    $(this).html(args.text);
                },
                close: function() {
                    $(this).dialog('destroy');
                },
                buttons: args.buttons || [{
                    text: 'Okay',
                    click: function() {
                        $(this).dialog('close');
                    }
                }],
                resizable: false
            });
        };
 
        this.alert = function(text, title) {
            this.dialog({
                text: text,
                title: title
            });
        };
 
        this.confirm = function(text, title, callback) {
            this.dialog({
                text: text,
                title: title,
                buttons: [{
                    text: 'Yes!',
                    click: function() {
                        $(this).dialog('close');
                        callback(true);
                    }
                }, {
                    text: 'No!',
                    click: function() {
                        $(this).dialog('close');
                        callback(false);
                    }
                }]
            });
        };
 
        // Posts a debug message if debug mode is switched on,
        // either via the URL parameter or window.debug
        // declared in index.html.
        this.debug = function(message) {
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
        };
 
        // Function for sending data to the server. An
        // object is passed in which looks like the
        // following:
        //
        //{
        // method: 'login',
        // module: '/empire',
        // params: [
        // '$stuff'
        // ],
        // success: function(receivedData){},
        // failure: function(receivedError){}
        //}
        this.send = function(args) {
            // Show the Blue "loading" animation.
            this.showPulser();
            var data = JSON.stringify({
                'jsonrpc'   : '2.0',
                'id'        : 1,
                'method'    : args.method,
                'params'    : args.params
            });

            this.debug('Sending to server: ' + data);

            $.ajax({
                data        : data,
                dataType    : 'json',
                type        : 'POST',
                url         : window.url + args.module,

                // Callbacks
                success: function(data, status, xhr) {
                    // Cache the status block and empire for later use
                    if (data.result.status) {
                        status = data.result.status;
                        // Another circular dependency
                        require(['empire'], function(Empire) {
                            Empire.update(status.empire);
                        });
                        if (status.body) {
                            body.update(status.body);
                        }
                    }
                    // the following can come from a direct call to get a body status
                    if (data.result.body) {
                        body.update(data.result.body);
                    }
                    if (data.result.empire) {
                        require(['empire'], function(Empire) {
                            Empire.update(data.result.empire);
                        });
                    }
                    scope.debug('Called ' + args.method + ' with a response of ' + JSON.stringify(data));
                    if (data.result) {
                        // ONWARD!
                        args.success.call(args.scope || scope || this, data);
                    }

                    // And finally, hide the "loading" animation.
                    scope.hidePulser();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // Hide the "loading" animation.
                    scope.hidePulser();

                    // Log the returned data for debugging.
                    scope.debug(jqXHR.responseText);

                    // Get the error block the server returned.
                    var response = $.parseJSON(jqXHR.responseText || ''),
                        error = response.error || {
                            message: 'Response content type is not JSON.'
                        };
                    if (error.code == 1006) {
                        // Clear all the panels.
                        $('#lacuna').fadeOut(500, function() {
                            $('#lacuna').html('');
                            Login.build();
                            scope.alert('Session expired. :(');
                        });
                    }
                    else {
                        // Call the failure function, or alert the human readable error message.
                        if (typeof(args.failure) === 'function') {
                            args.failure(error);
                        }
                        else {
                            scope.alert(error.message);
                        }
                    }
                }
            });
        };

        // Utility functions/helpers.
        this.getSession = function() {
            return sessionId || '';
        };
        this.setSession = function(session) {
            sessionId = session;
        };
        this.getCurrentPlanet = function() {
            return body.get.id || '';
        };

        this.showPulser = function() {
            $('#pulser').css('visibility', 'visible');
        };
        this.hidePulser = function() {
            $('#pulser').css('visibility', 'hidden');
        };

        // Resources
        this.getBuildingDesc = function(url) {
            return [
                this.Resources.buildings[url].description || '',
                '<br />',
                '<a href="', this.Resources.buildings[url].wiki, '" target="_blank">',
                ' More information on the Wiki.',
                '</a>'
            ].join('');
        };

        // HTML templates to simplify the code.
        this.Templates = {};

        // All the fun stuff with Panels.
        this.Panel = {
            newTabbedPanel: function(panel) {
                // This method uses some tricks to generate the HTML that jQuery accepts for tabs.
                // Check out http://jqueryui.com/tabs/ to see what I mean exactly.
                //
                // If you're only just starting in this codebase, please don't worry about how this code works,
                // it's there and I've made it work for you. :)
                var tabHeaders = ['<ul>'],
                    tabContent = [],
                    finalContent = [],
                    DOMName = panel.name.replace(/ |\(|\)/g, '_'); // So the DOM doesn't get confused.

                for (var i = 0; i < panel.tabs.length; i++) {
                    var tab = panel.tabs[i];
                    tabHeaders[tabHeaders.length] = '<li><a href="#' + DOMName + '_Tab-' + (i + 1) + '">' + tab.name + '</a></li>';
                    tabContent[tabContent.length] = '<div id="' + DOMName + '_Tab-' + (i + 1) + '">' + tab.content + '</div>';
                }

                // Finish it all off.
                tabHeaders[tabHeaders.length] = '</ul>';
                finalContent = [
                    '<div id="', DOMName, '_Panel" title="', panel.name, '" style="z-index:1001;">',
                        // Place stuff above the tabs.
                        panel.preTabContent ? panel.preTabContent : '',
                        // Then the Tabs themselves.
                        '<div id="', DOMName, '_Tab">',
                            tabHeaders.join(''),
                            tabContent.join(''),
                        '</div>',
                    '</div>'
                ];

                $('#page').append(finalContent.join(''));

                // Do this here to get a current version of the DOM Object.
                var dialogEl = $('#' + DOMName + '_Panel'),
                    tabEl = $('#' + DOMName + '_Tab');

                // Do some fancy Buttons!
                $('#' + DOMName + '_Panel' + ' :button').button();

                // .. and then the Dialog that everything sits in.
                dialogEl.dialog({
                    resizable: false,
                    draggable: panel.draggable || false,
                    width: panel.width || scope.Panel.panelWidth,
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
                        tabEl.tabs({
                            active: 0, // Set the default tab open to the first one.
                            heightStyle: 'auto',
                            activate: function(event, ui) {
                                var tab = panel.tabs[ui.newTab.index()];
                                // Generate the Tab object then pass it through.
                                if (typeof(tab.select) === 'function') {
                                    var tabObject = {
                                        el: ui.newTab,
                                        index: ui.newTab.index(),
                                        add: function(html) {
                                            $(ui.newTab.context.hash).append(html);
                                        }
                                    };
                                    tab.select(tabObject);
                                }
                            }
                        });
                    },
                    close: function() { // Called when the Dialog is closed with the 'X'.
                        // Clear the DOM element.
                        $(this).dialog('destroy').remove();
                    }
                });
 
                // Return a fancy Panel object.
                return {
                    dialogEl: $('#' + DOMName + '_Panel'), // Get newest version of the jQuery object.
                    tabEl: $('#' + DOMName + '_Tab'),
                    close: function(callback) {
                        $('#' + DOMName + '_Panel').dialog('close');
                        // Run the callback, if there is one.
                        if (typeof(callback) != 'undefined') {
                            setTimeout(callback, 500);
                        }
                    },
                    gotoTab: function(index) {
                        this.tabEl.tabs('option', 'active', index);
                    }
                };
            }
        };
    }
    
    return new Lacuna();
});
