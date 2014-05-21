( function( $ ) {

    var Orderly = function( $elements, options ) {
        this.__init( $elements, options );
    };

    var p = Orderly.prototype;

    // -- Constructor --

    p.__init = function( $elements, options ) {
        this.$elements = $elements;
        this.options   = $.extend( {}, this.defaults, options );
    };

    p.defaults = {
        resetHeight: '' // eg. 'auto', '36px' ...
    };

    // -- Event Handlers --

    p.attach = function() {
        if ( this.attached === undefined ) {
            $( window ).on( 'resize', this.handlers().resize );

            this.attached = true;
        }
    };

    p.handlers = function() {
        var that = this;

        return { resize: function( e ) {
            that._eachRow( that._resizeElements.bind( that ) );
        }};
    };

    // -- Private(-ish) --

    p._columnCount = function() {
        var lastPos = 0, pos = 0, count = 0;

        this.$elements.each( function( i ) {
            pos = $( this ).offset().top, count = i;

            if ( pos !== lastPos && lastPos !== 0 ) {
                return false;
            }

            lastPos = pos;
        });

        return count;
    };

    p._eachRow = function( callback ) {
        var d = this._dimensions();

        for ( var start, end, row, i = 0; i < d.r; i++ ) {
            start = d.c * i;
            $row   = this.$elements.slice( start, start + d.c );

            callback( $row, i );
        }
    };

    p._dimensions = function() {
        var columns = this._columnCount(),
            rows    = Math.ceil( this.$elements.length / columns );

        return { c: columns, r: rows };
    };

    p._resizeElements = function( $elements, height ) {
        var height = this._maxHeight( $elements );

        $elements.each( function( i, element ) {
            $( element ).height( height );
        });
    };

    p._maxHeight = function( $elements ) {
        var current, max = 0, reset = this.options.resetHeight;

        $elements.each( function( i, element ) {
            current = $( element ).height( reset ).height();

            if ( current > max ) {
                max = current;
            }
        });

        return max += 'px';
    };

    // -- jQuery Plugin --

    // Call for each specific collection of elements to align per row.

    $.fn.orderly = function( options ) {
        var orderly = new Orderly( this, options );

        orderly.attach();
        orderly.handlers().resize();

        return this;
    };

    // Call on a collection of parent containers. Each direct child element
    // will be given orderly().

    $.fn.orderly.children = function( options ) {
    };

})( jQuery );
