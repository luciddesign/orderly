jQuery Orderly
==============

Orderly equalizes the heights for equivalent floated grid columns and/or their
nested children for each optical row.

For example, given a list of products in a responsive Bootstrap layout,
normally you'd wrap each row of products in a row container element. With
Orderly, you'll have just one enclosing "row" for every product, as each
product will have a uniform height.

So you're free to set whatever column count, at whatever breakpoint without
worrying about float alignment issues.


Usage
-----

If all your columns have an equivalent inner markup structure, then you can
simply use Orderly as follows:

    $( '.column' ).orderly( { method: 'children' } );

This will apply Orderly to the container element and each of its direct
children. Otherwise, if your markup structure is more complex (you may wish
to apply Orderly to certain nested elements), you should apply Orderly to each
element in sequence:

    $( '.column > figure img' ).orderly();
    $( '.column > figure figcaption' ).orderly();

    ...

To be especially safe, you might also apply Orderly to the container element,
although this is optional if the sum height of its orderly children will be
equal.

Which is kind of the whole point ...

    $( '.column' ).orderly();


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

When these offset values are equal for each element in the first row, Orderly
can accurately calculate the current number of columns.


[001]: http://www.w3.org/TR/DOM-Level-3-Events/#event-flow


### Multiple selectors

When you want to apply Orderly to a set of elements separately, you must call
Orderly once per selector, as in the usage examples above. You cannot use
multiple selectors, eg.

    $( '.one, .two, .three' )

In this case, Orderly would be applied as if they were one set of elements.
This is probably not what you had intended.


Development
-----------

### Build

Run `npm run build` to compress to `dist/jquery.orderly.min.js`.
