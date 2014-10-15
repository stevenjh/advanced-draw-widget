define ( [
             'intern!object',
             'intern/chai!assert',
             'dojo/_base/lang',
             'dojo/_base/Color',
             'adw/widget/SMSEditor',
             'adw/advancedDrawConfig'
         ],
         function ( registerSuite, assert, lang, Color, Widget, defaultConfig ) {

             var widget;
             
             registerSuite ( {
                                 name: 'SMSEditor module test',

                                 setup: function () {
                                    // do nothing
                                 },

                                 // before each test executes
                                 beforeEach: function() {
                                     
                                     widget = new Widget( { symbol: lang.clone( defaultConfig.defaultPointSymbol ) } );
                                     widget.startup();

                                 },

                                 afterEach: function () {

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

                                     
                                     var expected = lang.clone( defaultConfig.defaultPointSymbol );
                                     var actual = widget.get( 'symbol' );

                                     console.log( 'expected/actual: ', expected, actual );

                                     assert.deepEqual ( actual,
                                                          expected,
                                                          '.get( symbol ) should return same symbol as passed into constructor.'
                                     );
                                 },

                                 'setSymbolStyleTest': function () {

                                     var expected = lang.clone( defaultConfig.defaultPointSymbol );
                                     expected.style = 'esriSMSSquare';

                                     widget.symbolStylePicker._onSelectDijitChange( 3 );

                                     var actual = widget.get( 'symbol' );

                                     assert.strictEqual ( actual.outline.width,
                                                          expected.outline.width,
                                                          '.get( symbol ) should return default symbol with the same symbol style as the test value ( esriSMSSquare ).'
                                     );
                                 },

                                 'setOutlineWidthTest': function () {

                                     var width = 6.3;
                                     var expected = lang.clone( defaultConfig.defaultPointSymbol );
                                     expected.outline.width = width;

                                     widget.outlineWidthSlider._onSliderDijitChange( width );

                                     var actual = widget.get( 'symbol' );

                                     assert.strictEqual ( actual.outline.width,
                                                        expected.outline.width,
                                                          '.get( symbol ) should return default symbol with the outline width updated to the test value ( ' + width + ' ).'
                                     );
                                 },

                                 'alphaSliderChangeTest': function () {

                                     var expected = lang.clone( defaultConfig.defaultPointSymbol );
                                     expected.color = [ 255, 0, 0, 191 ];

                                     widget.symbolColorPicker._onAlphaSliderChange( 0.75 );

                                     var actual = widget.get( 'symbol' );

                                     console.log( 'expected/actual: ', expected, actual );

                                     assert.deepEqual ( actual,
                                                        expected,
                                                        '.get( symbol ) should return symbol with color alpha value modified by new slider value.'
                                     );
                                 },

                                 'colorPickerChangeTest': function () {

                                     var expected = lang.clone( defaultConfig.defaultPointSymbol );
                                     expected.color = [ 0, 0, 0, 200 ];

                                     widget.symbolColorPicker._onColorPickerChange( '#000000' );

                                     var actual = widget.get( 'symbol' );

                                     console.log( 'expected/actual: ', expected, actual );

                                     assert.deepEqual ( actual,
                                                        expected,
                                                        '.get( symbol ) should return symbol with color value modified by new color picker color value.'
                                     );
                                 }

                             }
             );

         }
);
