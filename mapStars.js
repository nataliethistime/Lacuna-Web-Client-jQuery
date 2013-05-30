define(['jquery', 'lacuna', 'template'], function($, Lacuna, Template) {

    Template.load(['mapStars']);

    function MapStars() {
        // Use scope to reduce confusion about this.
        var scope = this;

        // A 'tile' is a block of the starmap 100 units wide by 30 units high
        // Each of these tiles can be populated by a single call to get_star_map
        // Nine of these tiles arranged in a 3x3 grid form the starmap
        // the 'view-port' is a window onto this grid
        // As the map is dragged, some tiles will go out of scope and tiles on
        // the other side will be created (by calls to get_star_map).
        // Since the view-port is generally smaller than a tile (especially at high zoom)
        // then tiles will generally be created outside of the viewport and it will
        // give the appearance of continuous smooth scrolling.

        var defaults = {
            parentContainer     : '#starmap',   // The parent div to contain the starmap
            zoomLevel           : 1,            // Default zoom level
            viewX               : 0,            // The start X unit in the starmap
            viewY               : 0,            // The start Y unit in the starmap
            boundLeft           : -1500,        // Bounds of the starmap
            boundRight          : 1499,         // +1500 has no bodies, so we can ignore it
            boundTop            : 1499,         // Likewise on the Y axis
            boundBottom         : -1500,        // Lower bound
        };
        var options;
        // tiles are an array of 9 tiles arranged by index
        //
        //  0  1  2
        //  3  4  5
        //  6  7  8
        //
        this.tiles = new Array();

        // convert a zoom level into pixels per starmap 'unit'
        var zoomToPixels = {
            6   : 150,
            5   : 100,
            4   : 75,
            3   : 50,
            2   : 35,
            1   : 20
        };

        // We should only need to 'renderStars' when we first display
        // the starmap, when we zoom in/out, or make a big change to
        // our x,y position such that all current tiles go out of range.
        this.renderStars = function(o) {
            if (typeof o == 'object') {
                options = $.extend(defaults, o);
            }
            else {
                options = defaults;
            }

            // First just position the nine tiles, they will be empty until
            // they are rendered by calls to 'get_star_map'.
            $("#starsParent").html('').draggable();
            for (var x=0; x<9; x++) {
                var bounds = scope.getTileBounds(x, options.viewX, options.viewY);

                var absLeft = bounds.left * scope.unitWidthPx();
                var absTop  = bounds.top * scope.unitHeightPx();
                scope.tiles[x] = Template.read.mapStar_tile({
                    absLeft     : absLeft,
                    absTop      : absTop,
                    tileId      : x,
                    widthPx     : 100 * scope.unitWidthPx(),
                    heightPx    : 30 * scope.unitHeightPx(),
                });
                $("#starsParent").append(scope.tiles[x]);
            }

            // Render all 9 tiles
            // Render the centre tile first
            scope.renderTile(4,0, options.viewX, options.viewY);
            for (var x=0; x < 9; x++) {
                if (x != 4) {
                    scope.renderTile(x, options.viewX, options.viewY);
                }
            }
        };

        // Make another tile the centre tile
        this.centreTile = function(tileId) {
            
        };


        // The expanse is tiled in fixed size tiles 100 units wide by 30 units high.
        // We can break the starmap into 30 tiles wide (ignoring x=1500 since it
        // does not contain any bodies) and 100 tiles high (again ignoring y=1500)
        // Taking advantage of this makes the code a bit easier.
        //
        // We can position the tile in an area equivalent to the size of the expanse
        // (in pixels, depending on zoom level) and then position the stars and planets
        // absolutely within the tile.
        //
        this.unitWidthPx = function() {
            return zoomToPixels[options.zoomLevel];
        };
        this.unitHeightPx = function() {
            return zoomToPixels[options.zoomLevel];
        };

        // xUnit,yUnit is the star unit in the centre of the view
        this.getTileBounds = function(tileId, xUnit, yUnit) {
            // xDelta and yDelta are the tile offsets to the centre tile
            var yDelta = Math.floor((8 - tileId)/3) - 1;
            var xDelta = tileId % 3 - 1;
            // Calculate the bounds of the centre tile (in starmap units)
            var boundLeft = Math.floor((xUnit - options.boundLeft) / 100) * 100 + options.boundLeft;
            var boundBottom = Math.floor((yUnit - options.boundBottom) / 30) * 30 + options.boundBottom;
            // Convert to bounds for the specified tileId (in starmap units)
            boundLeft       = boundLeft + xDelta * 100;
            boundBottom     = boundBottom + yDelta * 30;
            var boundRight  = boundLeft + 99;
            var boundTop    = boundBottom + 29;

            return {
                left    : boundLeft,
                right   : boundRight,
                top     : boundTop,
                bottom  : boundBottom
            };
        };

        // given x,y (current map location in units) and the tile ID
        // then render that tile
        this.renderTile = function(tileId, xUnit, yUnit) {
            // xDelta and yDelta are the offsets from the centre tile (tile 4) to the required tile
//            var yDelta = Math.floor((8 - tileId)/3) - 1;
//            var xDelta = tileId % 3 - 1;
            // calculate the bounds of the centre tile
//            var boundLeft   = Math.floor((xUnit - options.boundLeft) / 100) * 100 + options.boundLeft;
//            var boundBottom = Math.floor((yUnit - options.boundBottom) / 30) * 30 + options.boundBottom;
            // Convert to bounds for the specified tile ID
//            boundLeft       = boundLeft + xDelta * 100;
//            boundBottom     = boundBottom + yDelta * 30;
//            var boundRight  = boundLeft + 99;
//            var boundTop    = boundBottom + 29;

            var bounds = scope.getTileBounds(tileId, xUnit, yUnit);
//            Lacuna.alert("boundLeft = ["+boundLeft+"] boundRight = ["+boundRight+"] boundTop = ["+boundTop+"] boundBottom = ["+boundBottom+"] tileId = ["+tileId+"]");
            if (    bounds.left   >= options.boundLeft 
                &&  bounds.right  <= options.boundRight
                &&  bounds.bottom >= options.boundBottom
                &&  bounds.top    <= options.boundTop) {
                // Then we are within the bounds of the starmap
                Lacuna.send({
                    module: '/map',
                    method: 'get_star_map',
                    params: [{
                        session_id  : Lacuna.getSession(),
                        left        : bounds.left,
                        top         : bounds.top,
                        right       : bounds.right,
                        bottom      : bounds.bottom
                    }],
                    success : function(o) {
                     //   Lacuna.alert("add tile "+tileId);
                        // Now populate the tile with the planets and stars


                        // Now populate the tile with the ships
                    }
                });
            }
            else {
                // Then we are outside the bounds, just render a starfield
                // (we may not need to render anything if we have a tiled background image)
                Lacuna.alert('Outside bounds');
            }
        };




//        scope.draggable;
//        var $draggable_options;
//        var $tile_options;
//
//        var $draggable = $(draggable);
//        var $viewport = $draggable.parent();
//        $draggable.css({
//            position: "relative",
//            cursor: "move"
//        });
//        
//        // Draggable options
//        var _do = (draggable_options) ? draggable_options : {};
//
//        // Tile options (DEFAULT)
//        var _to = {
//            class_name: "_tile",
//            width: 100,
//            height: 100,
//            start_col: 0,
//            start_row: 0,
//            range_col: [-1000000, 1000000],
//            range_row: [-1000000, 1000000],
//            oncreate: function($element, i, j) {
//                $element.text(i + "," + j);
//            }
//        };
//        // Override tile options.
//        for (var i in tile_options) {
//            if (tile_options[i] !== undefined) {
//                _to[i] = tile_options[i];
//            }
//        }
//        
//        // Override tile options based on draggable options.
//        if (_do.axis == "x") {
//            _to.range_row = [_to.start_row, _to.start_row];
 //       } else if (_do.axis == "y") {
//            _to.range_col = [_to.start_col, _to.start_col];
//        }
//        
//        // Creates the tile at (i, j).
//        function create_tile(i, j) {
//            if (i < _to.range_col[0] || _to.range_col[1] < i) {
//                return;
//            } else if (j < _to.range_row[0] || _to.range_row[1] < j) {
//                return;
//            }
//            
//            grid[i][j] = true;
//            var x = i * _to.width;
//            var y = j * _to.height;
//            var $e = $draggable.append('<div></div>');
//
//            var $new_tile = $e.children(":last");
//            $new_tile.attr({
//                "class": _to.class_name,
//                col: i,
//                row: j
//            }).css({
//                position: "absolute",
//                left: x,
//                top: y,
//                width: _to.width,
//                height: _to.height
//            });
//
//            _to.oncreate($new_tile, i, j);
//        };
//        
//        // Updates the containment box wherein the draggable can be dragged.
//        var update_containment = function() {
//            // Update viewport info.
//            viewport_width = $viewport.width(),
//            viewport_height = $viewport.height(),
//            viewport_cols = Math.ceil(viewport_width / _to.width),
//            viewport_rows = Math.ceil(viewport_height / _to.height);
//            
//            // Create containment box.
//            var half_width = _to.width / 2,
//                half_height = _to.height / 2,
//                viewport_offset = $viewport.offset(),
//                viewport_draggable_width = viewport_width - _to.width,
//                viewport_draggable_height = viewport_height - _to.height;
//            
//            var containment = [
//                (-_to.range_col[1] * _to.width) + viewport_offset.left + viewport_draggable_width,
//                (-_to.range_row[1] * _to.height) + viewport_offset.top + viewport_draggable_height,
//                (-_to.range_col[0] * _to.width) + viewport_offset.left,
//                (-_to.range_row[0] * _to.height) + viewport_offset.top,
//            ];
//            
//            $draggable.draggable("option", "containment", containment);
//        };
//        
//        var update_tiles = function() {
//            var $this = $draggable;
//            var $parent = $this.parent();
//
//            // Problem with .position() in Chrome/WebKit:
//            //      var pos = $(this).position();
//            // So, we compute it ourselves.
//            var pos = {
//                left: $this.offset().left - $parent.offset().left,
//                top: $this.offset().top - $parent.offset().top
//            }
//
//            var visible_left_col = Math.ceil(-pos.left / _to.width) - 1,
//                visible_top_row = Math.ceil(-pos.top / _to.height) - 1;
//
//            for (var i = visible_left_col; i <= visible_left_col + viewport_cols; i++) {
//                for (var j = visible_top_row; j <= visible_top_row + viewport_rows; j++) {
//                    if (grid[i] === undefined) {
 //                       grid[i] = {};
//                    } else if (grid[i][j] === undefined) {
//                        create_tile(i, j);
//                    }
//                }
//            }
//        };
//        
//        
//        // Public Methods
//        //-----------------
//        
//        scope.draggable = function() {
//            return $draggable;
//        };
//        
//        scope.disabled = function(value) {
//            if (value === undefined) {
//                return $draggable;
//            }
//            
//            $draggable.draggable("option", "disabled", value);
//            
//            $draggable.css({ cursor: (value) ? "default" : "move" });
//        };
//        
//        scope.center = function(col, row) {
//            var x = _to.width * col,
//                y = _to.height * row,
//                half_width = _to.width / 2,
//                half_height = _to.height / 2,
//                half_vw_width = $viewport.width() / 2,
//                half_vw_height = $viewport.height() / 2,
//                offset = $draggable.offset();
//                
//            var new_offset = { 
//                left: -x - (half_width - half_vw_width), 
//                top: -y - (half_height - half_vw_height)
//            };
//            
//            if (_do.axis == "x") {
//                new_offset.top = offset.top;
//            } else if (_do.axis == "y") {
//                new_offset.left = offset.left;
//            }
//            
//            $draggable.offset(new_offset);
//            
//            update_tiles();
//        };

//        // Setup
//        //--------
//        
//        var viewport_width = $viewport.width(),
//            viewport_height = $viewport.height(),
//            viewport_cols = Math.ceil(viewport_width / _to.width),
//            viewport_rows = Math.ceil(viewport_height / _to.height);
//
//        $draggable.offset({
//            left: $viewport.offset().left - (_to.start_col * _to.width),
//            top: $viewport.offset().top - (_to.start_row * _to.height)
//        });
//
//        var grid = {};
//        for (var i = _to.start_col, m = _to.start_col + viewport_cols; i < m && (_to.range_col[0] <= i && i <= _to.range_col[1]); i++) {
//            grid[i] = {}
//            for (var j = _to.start_row, n = _to.start_row + viewport_rows; j < n && (_to.range_row[0] <= j && j <= _to.range_row[1]); j++) {
//                create_tile(i, j);
//            }
//        }
//        
//        // Handle resize of window.
//        $(window).resize(function() {
//            // HACK:
//            // Update the containment when the window is resized
//            // because the containment boundaries depend on the offset of the viewport.
//            update_containment();
//        });
//        
//        // The drag event handler.
//        _do.drag = function(e, ui) {
//            update_tiles();
//        };
//        
//        $draggable.draggable(_do);
//        
//        update_containment();
    };

    return new MapStars();
});


