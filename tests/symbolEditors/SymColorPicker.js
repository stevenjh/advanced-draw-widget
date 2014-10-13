define ( [
             'intern!object',
             'intern/chai!assert',
             'dojo/_base/Color',
             'adw/widget/SymColorPicker'
         ],
         function ( registerSuite, assert, Color, Widget ) {

             registerSuite ( {
                                 name: 'SymColorPicker module test',

                                 setup: function () {

                                 },

                                 // before each test executes
                                 beforeEach: function() {
                                     // do nothing
                                 },

                                 afterEach: function () {

                                     if ( this.widget ) {
                                         this.widget.destroy();
                                     };

                                 },

                                 // after the suite is done (all tests)
                                 teardown: function() {

                                     if ( this.widget ) {
                                         this.widget.destroy();
                                     };
                                 },

                                 'constructorOptionsTest': function () {

                                     var color = Color.fromArray( [ 255, 0, 0, 0.5 ] );
                                     this.widget = new Widget( { color: color } );
                                     this.widget.startup();

                                     var expected = color;
                                     var actual = this.widget.get( 'color' );

                                     assert.deepEqual ( actual,
                                                          expected,
                                                          '.get( color ) should return same color as passed into constructor.'
                                     );
                                 },

                                 'setColorTest': function () {

                                     var color = Color.fromArray( [ 255, 0, 0, 0.5 ] );this.widget = new Widget();
                                     this.widget.startup();
                                     this.widget.set( 'color', color );

                                     var expected = color;
                                     var actual = this.widget.get( 'color' );

                                     assert.strictEqual ( actual,
                                                          expected,
                                                          '.get( color ) should return same color as passed into .set( color, value ).'
                                     );
                                 },

                                 'alphaSliderChangeTest': function () {

                                     var color = Color.fromArray( [ 255, 0, 0, 0.5 ] );
                                     this.widget = new Widget( { color: color } );
                                     this.widget.startup();

                                     this.widget._onAlphaSliderChange( 0.75 );

                                     var expected = Color.fromArray( [ 255, 0, 0, 0.75 ] );
                                     var actual = this.widget.get( 'color' );

                                     assert.deepEqual ( actual,
                                                        expected,
                                                        '.get( color ) should return color with alpha value modified by new slider value.'
                                     );
                                 },

                                 'colorPickerChangeTest': function () {

                                     var color = Color.fromHex( '#FF0000' );
                                     this.widget = new Widget( { color: color } );
                                     this.widget.startup();

                                     this.widget._onColorPickerChange( '#0000FF' );

                                     var expected = Color.fromHex( '#0000FF' );
                                     var actual = this.widget.get( 'color' );

                                     assert.deepEqual ( actual,
                                                        expected,
                                                        '.get( color ) should return new value of color picker.'
                                     );
                                 }

                             }
             );

         }
);
