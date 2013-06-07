define(['jquery', 'underscore'], function($, _) {
    function Template() {
        var scope = this;

        this.file = new Array();
        this.read = new Array();
        this.load = function(templates) {
            if (! _.isArray(templates)) {
                templates = [templates];
            }
            _.each(templates, function(file) {
                // if the file is already loaded, then just return
                if ( ! _.isUndefined(scope.file[file])) {
                    return;
                }
                var url = 'src/templates/' + file + '.tmpl';
                $.ajax({
                    url     : url,
                    async   : false,
                    success : function(data) {
                        var templates = $(data).filter('script');
                        templates.each(function() {
                            var textContent = $(this).html();
                            textContent = textContent.replace('<![CDATA[', '');
                            textContent = textContent.replace(']]>', '');
                            scope.read[this.id] = _.template(textContent);
                        });
                    }
                });
                scope.file[file] = 1;
            });
        };
    }

    return new Template();
});
