define ( [
             'intern!object',
             'intern/chai!assert',
             'dojo/_base/Color',
             'adw/widget/SMSEditor',
             'adw/modules/_defaultConfig'
         ],
         function ( registerSuite, assert, Color, Widget, defaultConfig ) {

             registerSuite ( {
                                 name: 'SMSEditor module test',

                                 setup: function () {
                                    // do nothing
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
                                     this.widget = new Widget( { symbol: defaultConfig.defaultPointSymbol } );
                                     this.widget.startup();

                                     var expected = defaultConfig.defaultPointSymbol;
                                     var actual = this.widget.get( 'symbol' );

                                     assert.deepEqual ( actual,
                                                          expected,
                                                          '.get( symbol ) should return same symbol as passed into constructor.'
                                     );
                                 },

                                 'setOutliineWidthTest': function () {

                                     var width = 5;
                                     this.widget = new Widget();
                                     this.widget.startup();
                                     this.widget.outlineWidthSlider._onSliderDijitChange( width );

                                     var expected = defaultConfig.defaultPointSymbol;
                                     expected.outline.width = width;
                                     console.log( 'expected: ', expected );

                                     var actual = this.widget.get( 'symbol' );
                                     console.log( 'actual: ', actual );

                                     console.log( this.widget );

                                     assert.deepEqual ( actual,
                                                          expected,
                                                          '.get( symbol ) should return default symbol with the outline width updated to the test value ( ' + width + ' ).'
                                     );
                                 }/*,

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
                                 }*/

                             }
             );

         }
);
