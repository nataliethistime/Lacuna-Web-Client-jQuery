define(['jquery', 'underscore'], function($, _) {
    function Template() {
        var scope = this;

        scope.file = [];
        scope.read = [];
        
        // Use loadStrings so we can replace the previous 'sync' call
        // 
        scope.loadStrings = function(strings) {
            if (! _.isArray(strings)) {
                strings = [strings];
            }

            _.each(strings, function(string) {
                var filename = $(string).filter('body').first().id;
                if ( ! _.isUndefined(scope.file[filename])) {
                    return;
                }
                var templates = $(string).filter('script');
                templates.each(function() {
                    var textContent = $(this).html();
                    textContent = textContent.replace('<![CDATA[', '');
                    textContent = textContent.replace(']]>', '');
                    scope.read[this.id] = _.template(textContent);
                });
            });
        };
    }

    return new Template();
});
