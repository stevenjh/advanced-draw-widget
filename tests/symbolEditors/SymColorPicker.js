define ( [
             'intern!object',
             'intern/chai!assert',
             'dojo/_base/Color',
             'adw/widget/SymColorPicker',
             'dijit/form/DropDownButton',
             'dijit/TooltipDialog',
             'dojox/widget/ColorPicker',
         ],
         function ( registerSuite, assert, Color, Widget ) {

             var widget, expected, actual;

             registerSuite ( {
                                 name: 'SymColorPicker module test',

                                 setup: function () {

                                 },

                                 // before each test executes
                                 beforeEach: function() {
                                     // do nothing
                                 },

                                 afterEach: function () {

                                     console.log( 'expected/actual', expected, actual );

                                     expected = null;
                                     actual = null;

                                     if ( widget ) {
                                         widget.destroy();
                                     };

                                 },

                                 // after the suite is done (all tests)
                                 teardown: function() {

                                     if ( widget ) {
                                         widget.destroy();
                                     };

                                 },

                                 'constructorOptionsTest': function () {

                                     var color = [ 255, 0, 0, 128 ];
                                     widget = new Widget( { color: color } );
                                     widget.startup();

                                     expected = [ 255,0,0,128 ];
                                     actual = widget.get( 'color' );

                                     assert.deepEqual ( actual,
                                                          expected,
                                                          '.get( color ) should return same color as passed into constructor.'
                                     );
                                 },

                                 'setColorTest': function () {

                                     var color = [ 255, 0, 0, 128 ];
                                     widget = new Widget();
                                     widget.startup();
                                     widget.set( 'color', color );

                                     expected = [ 255, 0, 0, 128 ] ;
                                     actual = widget.get( 'color' );

                                     assert.deepEqual ( actual,
                                                          expected,
                                                          '.get( color ) should return same color as passed into .set( color, value ).'
                                     );
                                 },

                                 'alphaSliderChangeTest': function () {

                                     var color = [ 255, 0, 0, 128 ];
                                     widget = new Widget( { color: color } );
                                     widget.startup();

                                     widget._onAlphaSliderChange( 0.5 );

                                     expected = [ 255,0,0,128 ];
                                     actual = widget.get( 'color' );

                                     assert.deepEqual ( actual,
                                                        expected,
                                                        '.get( color ) should return color with alpha value modified by new slider value.'
                                     );
                                 },

                                 colorPickerChangeTest: function () {

                                     var color = Color.fromHex( '#FF0000' ).toRgb();
                                     color.push( 255 );
                                     widget = new Widget( { color: color } );
                                     widget.startup();

                                     widget._onColorPickerChange( '#0000FF' );

                                     expected = Color.fromHex( '#0000FF' ).toRgb();
                                     expected.push( 255 );
                                     actual = widget.get( 'color' );

                                     assert.deepEqual ( actual,
                                                        expected,
                                                        '.get( color ) should return new value of color picker.'
                                     );
                                 }

                             }
             );

         }
);
