// CIRCULAR DEPENDENCIES
// This module is a dependency for most others. Don't add direct dependencies
// to (for example Empire) in here, instead rewrite it to use a callback.
//
define(['jquery', 'underscore', 'jqueryUI'], function($, _) {
    function Lacuna() {
        // Helper for jQuery's weird scope management.
        var scope = this;
        scope.sessionId = 0;

        // Callbacks that want to extract data (such as status, body, empire) from
        // each and every API call.
        scope.callbacks = $.Callbacks();

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
        
        // standard alert box 
        scope.alert = function(text, title) {
            scope.dialog({
                text: text,
                title: title
            });
        };

        // Standard confirm dialog box
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
        
        // Check if we need to enable 'debug mode'
        scope.debugMode = (window.debug || window.location.toString().search('debug') > 0);
        
        // Posts a debug message if debug mode is switched on,
        // either via the URL parameter or window.debug
        // declared in index.html.
        scope.debug = function(message) {
            // Check if debug mode is on.
            if (scope.debugMode) {
                console.log('DEBUG: ' + message);
            }
        };

        // Method to make a call to the Server API.
        // call it like so:
        //
        // var deferredLogin = Lacuna.send({
        //      method  : 'login',
        //      module  : '/empire',
        //      params  : [{
        //          session_id : session_id
        //      }]
        // });
        //
        // Returns a 'deferred' object. see http://api.jquery.com/category/deferred-object/
        // for more details.
        //
        // }
        scope.send = function(args) {
            // Show the Blue "loading" animation.
            scope.showPulser();

            // Generate the data.
            var data = JSON.stringify({
                'jsonrpc'   : '2.0',
                'id'        : 1,
                'method'    : args.method,
                'params'    : args.params
            });

            scope.debug('Sending to server: ' + data);
            var url = window.url.substring(0, window.url.length - 1) + args.module;

            var deferred = $.ajax({
                data        : data,
                dataType    : 'json',
                type        : 'POST',
                url         : url
            });

            deferred.done(function(data, status, xhr) {
                // Inform everyone who is interested in a change in the data.

                // The surface image of a planet is returned in a special body
                // block in a get_buildings request. Get over it. In other cases,
                // the status block is at the 'root' of the object. Both cases can
                // be handled in the same manner.
                if (args.method === 'get_status' || args.method === 'get_buildings') {
                    scope.callbacks.fire(data.result);    
                }
                else if (data.result.status) {
                    scope.callbacks.fire(data.result.status);
                }
            });

            deferred.fail(function(jqXHR, textStatus, errorThrown) {
                // Log the returned data for debugging.
                scope.debug(jqXHR.responseText);

                // Get the error block the server returned.
                var response = $.parseJSON(jqXHR.responseText || ''),
                    error = response.error || {message: 'Cannot read response.'};
                
                if (error.code === 1006) {

                    // Clear all the data that the client might be keeping
                    // track of at the time the session expires.
                    scope.clearData();

                    // Show the login panel first so that the 'Session Expired'
                    // alert is rendered on top of the panel.
                    require('login').buildPanel();
                    scope.alert('Session expired. :(');
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
                scope.hidePulser();
                if (typeof(args.complete) === 'function') {
                    args.complete(textStatus);
                }
            });
            
            return deferred;
        };

        // Utility functions/helpers.
        scope.getSession = function() {
            return scope.sessionId || '';
        };

        scope.setSession = function(session) {
            scope.sessionId = session;

            // Add the session Id to a cookie.
            $.cookie.write('lacuna-expanse-session', session, 60 * 60 * 2); // 2 hours
        };

        scope.showPulser = function() {
            $('#pulser').css('visibility', 'visible');
        };
        scope.hidePulser = function() {
            $('#pulser').css('visibility', 'hidden');
        };

        // TODO: Not sure this belongs in here...
        scope.getBuildingDesc = function(url) {
            return [
                scope.resources.buildings[url].description || '',
                '<br />',
                '<a href="', scope.resources.buildings[url].wiki, '" target="_blank">',
                ' More information on the Wiki.',
                '</a>'
            ].join('');
        };

        scope.getResources = function() {
            var url = window.location.href;

            // Remove any tailing 'index.html' or similar.
            url = url.substring(0, url.lastIndexOf('/') + 1) + 'resources.json';
            
            $.getJSON(url, function(json) {
                scope.resources = json;
            });
        };

        scope.clearData = function() {

            // Remove the session cookie.
            $.cookie.destroy('lacuna-expanse-session');

            // Delete all the status data to avoid "confusion."            
            require('empire').destroy();
            require('body').destroy(); 

            // Kill everything in the queue.
            require('queue').killall();

            // Hide everything.
            $('#gameHeader, #gameFooter, #buildingsParent, #menu_to_starmap, #menu_to_planetmap, #starsParent')
                .css('visibility', 'hidden');

            // I think it feels nice to use the last planet surface
            // as the login background instead of the star field. :)
            // If you disagree, uncomment this line, last I cared,
            // it worked as it should.
            //require('body').backgroundCallbacks.fire('');
        };
    }
    
    return new Lacuna();
});
