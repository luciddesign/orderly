Orderly jQuery Plugin
=====================

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

    $( '.column' ).orderly( { children: true } );

This will apply Orderly to the container element and each of its direct
children. Otherwise, if your markup structure is more complex (you may wish
to apply Orderly to certain nested elements), you should apply Orderly to each
element in sequence:

    $( '.column figure img' ).orderly();
    $( '.column figure figcaption' ).orderly();

    ...

To be especially safe, you might also apply Orderly to the container element,
although this is optional if the sum height of its orderly children will be
equal.

Which is kind of the whole point ...

    $( '.column' ).orderly();


### Order of registration

Event listeners are [triggered sequentially][wc3] in the order they were
registered. Considering this, it is crucial that you register any nested
elements with `orderly()` in a top to bottom order. eg.

    $( '.product h3' ).orderly();
    $( '.product p' ).orderly();

    ...

Orderly depends on this order due to the way column counts are calculated.
Processing the topmost element should leave the next sibling at a uniform Y
offset across the row.

When these offset values are equal for each element in the first row, Orderly
can accurately calculate the current number of columns.


[w3c]: http://www.w3.org/TR/DOM-Level-3-Events/#event-flow