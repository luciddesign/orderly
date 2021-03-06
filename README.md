  jQuery Orderly
================

  Orderly equalizes the heights for equivalent floated grid columns and/or
  their nested children for each optical row.

  For example, given a list of products in a responsive Bootstrap layout,
  normally you'd wrap each row of products in a row container element. With
  Orderly, you'll have just one enclosing "row" for every product, as each
  product will have a uniform height.

  So you're free to set whatever column count, at whatever breakpoint without
  worrying about float alignment issues.


##  Usage  ##

  If all your columns have an equivalent inner markup structure, then you can
  simply use Orderly as follows:

    $( '.column' ).orderly( { method: 'children' } );

  This will apply Orderly to the container element and each of its direct
  children. Otherwise, if your markup structure is more complex (you may wish
  to apply Orderly to certain nested elements), you should apply Orderly to
  each element in sequence:

    $( '.column > figure img' ).orderly();
    $( '.column > figure figcaption' ).orderly();

    ...

  To be especially safe, you might also apply Orderly to the container
  element, although this is optional if the sum height of its orderly children
  will be equal.

  Which is kind of the whole point ...

    $( '.column' ).orderly();

### Events

  You can hook into the Orderly process by binding event handlers to
  `'orderly.reset'` and `'orderly.resize'`. An `'orderly.reset'` takes place
  immediately before element dimensions are reset on a resize event, while an
  `'orderly.resize'` occurs after the new dimensions have been calculated and
  applied.

  The event handlers are called as follows:

    resetHandler(
        element
      , height
      , collectionIndex
      , collectionLength
    );

    resizeHandler(
        element
      , height
      , rowIndex
      , rowLength
    );

  eg.

    var handler = function( e, el, h ) { $( el ).css( 'line-height', h ) };

    $.each( [ 'orderly.reset', 'orderly.resize' ], function( i, event ) {
        $( '.product > figure' ).on( event, handler );
    });

  Note that if your initial page state relies on these functions, you may have
  to trigger them manually. You might achieve this by triggering an
  `'orderly'` resize event on page load:

    $( window ).trigger( 'orderly' );


##  Considerations  ##

### Order of registration

  Event listeners are [triggered sequentially][001] in the order they were
  registered. Considering this, it is crucial that you register any nested
  elements with `orderly()` in a top to bottom order. eg.

    $( '.product > h3' ).orderly();
    $( '.product > p' ).orderly();

    ...

  Orderly depends on this order due to the way column counts are calculated.
  Processing the topmost element should leave the next sibling at a uniform Y
  offset across the row.

  When these offset values are equal for each element in the first row,
  Orderly can accurately calculate the current number of columns.

  [001]: http://www.w3.org/TR/DOM-Level-3-Events/#event-flow

### Multiple selectors

  When you want to apply Orderly to a set of elements separately, you must
  call Orderly once per selector, as in the usage examples above. You cannot
  use multiple selectors, eg.

    $( '.one, .two, .three' )

  In this case, Orderly would be applied as if they were one set of elements.
  This is probably not what you had intended.

### Webfonts

  Be aware that using Orderly with elements using custom webfonts can result
  in a race condition in some browsers where Orderly may be triggered before
  the webfonts have loaded and rendered.

  Some webfont services emit events during the font loading process.

  You may use these to manually trigger a window resize.


##  Development  ##

### Build

  Run `npm run build` to compress to `dist/jquery.orderly.min.js`.
