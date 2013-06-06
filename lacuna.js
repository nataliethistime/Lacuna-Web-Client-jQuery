define(['jquery', 'underscore', 'body', 'require', 'jqueryUI'], function($, _, Body, require) {
    function Lacuna() {
 
        // Helper for jQuery's weird scope management.
        var scope = this;
        this.status;
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
        this.debugMode = (window.debug || window.location.toString().search('debug') > 0);
        this.debug = function(message) {
            // Check if debug mode is on.
            if (this.debugMode) {
                console.log('DEBUG: ' + message);
            }
        };
 
        // Function for sending data to the server. An
        // object is passed in which looks like the
        // following:
        //
        // {
        //     method: 'login',
        //     module: '/empire',
        //     params: [
        //         '$stuff'
        //     ],
        //     success: function(receivedData){},
        //     failure: function(receivedError){}
        // }
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
                        scope.status = data.result.status;
                        
                        // Another circular dependency
                        require(['empire'], function(Empire) {
                            Empire.update(scope.status.empire);
                        });

                        if (scope.status.body) {
                            Body.update(scope.status.body);
                        }

                        // Now that all the data from the status is safely put away
                        // delete it from the server response.
                        delete data.result.status;
                    }
                    
                    // the following can come from a direct call to get a body status
                    if (data.result.body) {
                        Body.update(data.result.body);
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
                        //$('#lacuna').fadeOut(500, function() {
                            $('#lacuna').html('');
                            require(['login'], function(Login) {
                                Login.build();
                            });
                            scope.alert('Session expired. :(');
                        //});
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
            return Body.get.id || '';
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
    }
    
    return new Lacuna();
});
