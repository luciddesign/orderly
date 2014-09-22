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
            that._eachRow( function( $elements ) {
                that._resizeElements( $elements );
            });
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
        var columns = this._columnCount()
          , rows    = Math.ceil( this.$elements.length / columns );

        return { c: columns, r: rows };
    };

    p._resizeElements = function( $elements ) {
        var height  = this._maxHeight( $elements )
          , options = this.options;

        $elements.each( function( i, element ) {
            $( element ).css( 'height', height );
            $( element ).trigger( 'orderly.resize', [
                element
              , height
              , i
              , $elements.length
              , options
            ]);
        });
    };

    p._maxHeight = function( $elements ) {
        var value, current, max = 0, options = this.options, box;

        $elements.each( function( i, element ) {
            $( element ).trigger( 'orderly.reset', [
                element
              , options.resetHeight
              , i
              , $elements.length
              , options
            ]);

            $( element ).css( 'height', options.resetHeight );
            box     = element.getBoundingClientRect();
            current = box.bottom - box.top;

            if ( current > max ) {
                max = current;
            }
        });

        value = Math.round( max ).toString(); // browser consistent rounding

        return value += 'px';
    };

    // -- jQuery Plugin --

    var g = {};

    g._delegate = function( options ) {
        var method = '_' + ( options && options.method || 'register' )
          , m      = g[method];

        m.call( this, options );
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
        var length  = this[0].children.length
          , counter = o.counter++; // ensures unique selectors

        g._childrenData.call( this, counter );
        g._registerChildren( length, counter, options );
        g._register.call( this, options );
    };

    g._childrenData = function( counter ) {
        this.each( function( i, element ) {
            $( element.children ).each( function( i, child ) {
                $( child ).attr( 'data-orderly', counter + ':' + i );
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
