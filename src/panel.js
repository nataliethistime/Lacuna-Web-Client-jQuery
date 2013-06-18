define(['jquery', 'underscore', 'jqueryUI', 'template'], function($, _, UI, Template) {

    Template.load('widgets/tabbed_panel');

    function Panel() {
 
        // Helper for jQuery's weird scope management.
        var scope = this;

        // All the fun stuff with Panels.
        scope.newTabbedPanel = function(panel) {
            // Generate tabbed panel, see http://jqueryui.com/tabs/ for details
            var DOMName = panel.name.replace(/\W/g,"_")

            var tab_top = '';
            var tab_bottom = '';
            for (var i=0; i < panel.tabs.length; i++) {
                var tab = panel.tabs[i];
                tab_top += Template.read.widget_tabbed_panel_tab_top({
                    dom_name    : DOMName,
                    tab_id      : i+1,
                    tab_name    : tab.name
                });
                tab_bottom += Template.read.widget_tabbed_panel_tab_bottom({
                    dom_name    : DOMName,
                    tab_id      : i+1,
                    tab_content : tab.content
                });
            }
            var content = Template.read.widget_tabbed_panel({
                pre_tab_content : panel.preTabContent || '',
                tab_top         : tab_top,
                tab_bottom      : tab_bottom,
                dom_name        : DOMName,
                panel_name      : panel.name
            });
            $('#page').append(content);

            // Do this here to get a current version of the DOM Object.
            var $dialogEl = $('#' + DOMName + '_Panel'),
                $tabEl    = $('#' + DOMName + '_Tab');

            // Do some fancy Buttons!
            $('#' + DOMName + '_Panel' + ' :button').button();

            // .. and then the Dialog that everything sits in.
            $dialogEl.dialog({
                resizable   : true,
                draggable   : panel.draggable   || false,
                width       : panel.width || scope.panelWidth,
                show: {
                    effect      : 'fade',
                    duration    : 500
                },
                hide: {
                    effect      : 'fade',
                    duration    : 500
                },
                open: function() {
                    // Initialize Tabs when the Dialog opens.
                    $tabEl.tabs({
                        active      : 0, // Default, open the first tab.
                        activate    : function(event, ui) {
                            var tab = panel.tabs[ui.newTab.index()];
                            // Generate the Tab object then pass it through.
                            if (typeof(tab.select) === 'function') {
                                var tabObject = {
                                    el      : ui.newTab,
                                    index   : ui.newTab.index(),
                                    add     : function(html) {
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
                dialogEl    : $dialogEl,
                tabEl       : $tabEl,
                close       : function(callback) {
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
