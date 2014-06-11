( function( $ ) {

    var Orderly = function( $elements, options ) {
        this.__init( $elements, options );
    };

    var o = Orderly, p = o.prototype;

    o.counter = 0;

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

        this.$elements.each( function() {
            pos = $( this ).offset().left, count += 1;

            if ( pos <= lastPos && lastPos !== 0 ) {
                count -= 1; return false;
            }

            lastPos = pos;
        });

        return count;
    };

    p._eachRow = function( callback ) {
        var d = this._dimensions();

        for ( var start, $row, i = 0; i < d.r; i++ ) {
            start = d.c * i;
            $row  = this.$elements.slice( start, start + d.c );

            callback( $row, i );
        }
    };

    p._dimensions = function() {
        var columns = this._columnCount(),
            rows    = Math.ceil( this.$elements.length / columns );

        return { c: columns, r: rows };
    };

    p._resizeElements = function( $elements ) {
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

    var g = {};

    g._delegate = function( options ) {
        var method = '_' + ( options && options.method || 'register' ),
            m      = g[method].bind( this );

        m( options );
    };

    // Call for each specific collection of elements to align per row.

    g._register = function( options ) {
        var o = new Orderly( this, options );

        o.attach();
        o.handlers().resize();
    };

    // Call on a collection of parent containers. Each direct child element
    // will be given orderly().

    g._children = function( options ) {
        var length  = this[0].children.length,
            counter = o.counter++; // ensures unique selectors

        g._childrenData.call( this, counter );
        g._registerChildren( length, counter, options );
        g._register.call( this, options );
    };

    g._childrenData = function( counter ) {
        this.each( function( i, element ) {
            $( element.children ).each( function( i, child ) {
                child.dataset.orderly = counter + ':' + i;
            });
        });
    };

    g._registerChildren = function( length, counter, options ) {
        for ( var i = 0; i < length; i++ ) {
            g._register.call( g._find( counter, i ), options );
        }
    };

    g._find = function( counter, i ) {
        return $( '[data-orderly="' + counter + ':' + i + '"]' );
    };

    // ---

    $.fn.orderly = function( options ) {
        if ( this.length > 0 ) {
            g._delegate.call( this, options );
        }

        return this;
    };

})( jQuery );
