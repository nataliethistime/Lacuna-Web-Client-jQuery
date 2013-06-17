// CIRCULAR DEPENDENCIES
// Do not assign dependencies 'empire', 'body', 'login' to function arguments
// Always access these objects via require("class")
// e.g. require("login").start()
// Do not use asynchronous require([]) form
//
define(['jquery', 'underscore', 'require', 'jqueryUI', 'empire', 'body', 'login'], function($, _, require) {
    function Lacuna() {
 
        // Helper for jQuery's weird scope management.
        var scope = this;
        this.status;
        var sessionId = 0;

        // Helper function for the below confirm() and alert().
        scope.dialog = function(args) {
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
 
        scope.alert = function(text, title) {
            scope.dialog({
                text: text,
                title: title
            });
        };
 
        scope.confirm = function(text, title, callback) {
            scope.dialog({
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
        scope.debugMode = (window.debug || window.location.toString().search('debug') > 0);
        scope.debug = function(message) {
            // Check if debug mode is on.
            if (scope.debugMode) {
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
        //     success  : function(receivedData){},
        //     error    : function(receivedError){}, // Optional
        //     complete : function(receivedStatus){} // Optional
        //
        // }
        scope.send = function(args) {
            // Show the Blue "loading" animation.
            scope.showPulser();
            var data = JSON.stringify({
                'jsonrpc'   : '2.0',
                'id'        : 1,
                'method'    : args.method,
                'params'    : args.params
            });

            scope.debug('Sending to server: ' + data);
            var url = window.url;
            url = url.substring(0, url.length - 1) + args.module;

            var deferred = $.ajax({
                data        : data,
                dataType    : 'json',
                type        : 'POST',
                url         : url
            });

            deferred.done(function(data, status, xhr) {
                // Cache the status block and empire for later use
                if (data.result.status) {
                    scope.status = data.result.status;
                        
                    require("empire").update(scope.status.empire);

                    if (scope.status.body) {
                        require("body").update(scope.status.body);
                    }

                    // Now that all the data from the status is safely put away
                    // delete it from the server response.
                    delete data.result.status;
                }
                else {
                    scope.status = {};
                }
                    
                // the following can come from a direct call to get a body status
                if (data.result.body) {
                    require("body").update(data.result.body);
                    // stash it under {status} for consistency
                    scope.status.body = data.result.body;
                }
                    
                if (data.result.empire) {
                    require("empire").update(data.result.empire);
                    // stash it under {status} for consistency
                    scope.status.empire = data.result.empire;
                }
                    
                scope.debug('Called ' + args.method + ' with a response of ' + JSON.stringify(data));
                    
                if (data.result) {
                    // ONWARD!
                    args.success.call(args.scope || scope || this, data);
                }

                // And finally, hide the "loading" animation.
                scope.hidePulser();
            });

            deferred.fail(function(jqXHR, textStatus, errorThrown) {
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
                        require("login").start();
                        scope.alert('Session expired. :(');
                    //});
                }
                else {
                    // Call the error function, or alert the human readable error message.
                    if (typeof(args.error) === 'function') {
                        args.error(error);
                    }
                    else {
                        scope.alert(error.message);
                    }
                }
            });
            deferred.always(function(jqXHR, textStatus, errorThrown) {
                if (typeof(args.complete) === 'function') {
                    args.complete(textStatus);
                }
            });
            return deferred;
        };

        // Utility functions/helpers.
        scope.getSession = function() {
            return sessionId || '';
        };
        scope.setSession = function(session) {
            sessionId = session;
        };
        scope.getCurrentPlanet = function() {
            return require("body").get.id || '';
        };

        scope.showPulser = function() {
            $('#pulser').css('visibility', 'visible');
        };
        scope.hidePulser = function() {
            $('#pulser').css('visibility', 'hidden');
        };

        // Resources
        scope.getBuildingDesc = function(url) {
            return [
                scope.Resources.buildings[url].description || '',
                '<br />',
                '<a href="', scope.Resources.buildings[url].wiki, '" target="_blank">',
                ' More information on the Wiki.',
                '</a>'
            ].join('');
        };
    }
    
    return new Lacuna();
});
