( function ( $ ) {

    if ( window.__orderly ) { return; } window.__orderly = true;

    var $w = $( window );

    $w.on( 'resize', function ( e ) {
        $w.trigger( 'orderly' );
    });

    // ---

    var proto = {};

    proto.init = function ( $els ) {
        this.$els = $els;

        return this;
    };

    proto.find = function () {
        return this.$els.filter( function ( i, el ) {
            return el.offsetHeight > 0; // filters out undisplayed elements
        });
    };

    /*    Event Handlers
       ~~~~~~~~~~~~~~~~~~~~ */

    proto.attach = function () {
        if ( this.attached === undefined ) {
            this.attached = true;

            $w.on( 'orderly', _debounce( this.handler(), 100 ) );
        }
    };

    proto.handler = function () {
        var that = this;

        return function () {
            var $els = that.find();
            _reset( $els );
            _eachElement( $els );
        }
    };

    /*    Private
       ~~~~~~~~~~~~~ */

    var _eachElement = function ( $els ) {
        for ( var i = 0; i < $els.length; ) {
            i = _currentRow( $els, null, 0, [], i );
        }
    };

    var _currentRow = function ( $els, lastPos, max, row, i ) {
        for ( ; i < $els.length; ) {
            lastPos = _inRow( $els, lastPos, i );

            if ( lastPos === null ) break;

            max = _max( $els, max, i );
            row.push( $els[i] );

            i++;
        }

        max = _maxPx( max );

        _resize( $( row ), max );

        return i;
    };

    var _inRow = function ( $els, lastPos, i ) {
        var $el = $els.eq( i )
          , pos = $el.offset().left;

        if ( lastPos !== null && pos <= lastPos ) {
            return null;
        } else {
            return pos;
        }
    };

    // Returns larger of max and height of element indexed i.
    //
    var _max = function ( $els, max, i ) {
        var box     = $els[i].getBoundingClientRect()
          , current = box.bottom - box.top;

        return Math.max( max, current );
    };

    // Converts n to px value string for CSS.
    //
    var _maxPx = function ( n ) {
        return Math.round( n ).toString() + 'px';
    };

    var _resize = function ( $row, height ) {
        $row.each( function ( i, el ) {
            $( el ).css( { height: height } );

            _emit( el, 'resize', height, i, $row.length );
        });
    };

    var _reset = function ( $els ) {
        $els.each( function ( i, el ) {
            _emit( el, 'reset', '', i, $els.length );

            $( el ).css( { height: '' } );
        });
    };

    var _emit = function ( el, event, h, i, l ) {
        $( el ).trigger( 'orderly.' + event, [ el, h, i, l ] );
    };

    /*    jQuery Plugin
       ~~~~~~~~~~~~~~~~~~~ */

    $.fn.orderly = function ( options ) {
        if ( this.length > 0 ) {
            _delegate( this, options );
        }

        return this;
    };

    // ---

    var _delegate = function ( $els, options ) {
        var m  = options && options.method || 'register'
          , fn = _methods[m];

        fn( $els );
    };

    var _register = function ( $els ) {
        var o = Object.create( proto ).init( $els );

        o.attach();
        o.handler()();
    };

    var _methods = {};

    // Call for each specific collection of elements to align per row.
    //
    _methods['register'] = _register;

    // Call on a collection of parent containers. Each direct child element
    // will be given orderly().
    //
    _methods['children'] = function ( $els ) {
        var c = _indexCounter++;

        _assignData( $els, c );
        _register( $els ); // non-cleared floats flush-left on new row
        _registerChildren( $els, c );
        _register( $els );
    };

    var _registerChildren = function ( $els, c ) {
        var len = $els[0].children.length;

        for ( var i = 0; i < len; i++ ) {
            _register( _find( c, i ) );
        }
    };

    // Assign data-orderly for all children of each element.
    //
    var _assignData = function ( $els, c ) {
        $els.each( function ( i, el ) {
            $( el.children ).each( function ( i, ch ) {
                $( ch ).attr( 'data-orderly', c + ':' + i );
            });
        });
    };

    // Return collection of elements matching counter c and index i.
    //
    var _find = function ( c, i ) {
        return $( '[data-orderly="' + c + ':' + i + '"]' );
    };

    /*    Util
       ~~~~~~~~~~ */

    var _debounce = function ( fn, ms ) {
        var timeout;

        return function () {
            clearTimeout( timeout );

            timeout = setTimeout( function () {
                timeout = null;
                fn.apply( this, arguments );
            }, ms );
        };
    };

    /*    State
       ~~~~~~~~~~~ */

    var _indexCounter = 0;

})( jQuery );
