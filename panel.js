define(['jquery', 'underscore', 'jqueryUI'], function($, _) {
    function Panel() {
 
        // Helper for jQuery's weird scope management.
        var scope = this;

        // All the fun stuff with Panels.
        this.newTabbedPanel = function(panel) {
            // This method uses some tricks to generate the HTML that jQuery accepts for tabs.
            // Check out http://jqueryui.com/tabs/ to see what I mean exactly.
            //
            // If you're only just starting in this codebase, please don't worry about how this code works,
            // it's there and I've made it work for you. :)
            var tabHeaders = ['<ul>'],
                tabContent = [],
                finalContent = [],

                // So the DOM doesn't get confused.
                DOMName = panel.name.replace(/ |\(|\)/g, '_')
            ;

            for (var i = 0; i < panel.tabs.length; i++) {
                var tab = panel.tabs[i];
                tabHeaders[tabHeaders.length] = '<li><a href="#' + DOMName + '_Tab-' + (i + 1) + '">' + tab.name + '</a></li>';
                tabContent[tabContent.length] = '<div id="' + DOMName + '_Tab-' + (i + 1) + '">' + (tab.content || '') + '</div>';
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
                tabEl    = $('#' + DOMName + '_Tab');

            // Do some fancy Buttons!
            $('#' + DOMName + '_Panel' + ' :button').button();

            // .. and then the Dialog that everything sits in.
            dialogEl.dialog({
                resizable: false,
                draggable: panel.draggable || false,
                width: panel.width || scope.panelWidth,
                show: {
                    effect: 'fade',
                    duration: 500
                },
                hide: {
                    effect: 'fade',
                    duration: 500
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
        };
    }
    
    return new Panel();
});
