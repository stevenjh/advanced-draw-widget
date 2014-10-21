define ( [
    'intern!object',
    'intern/chai!assert',
    'dojo/_base/lang',
    'dojo/_base/Color',
    'adw/widget/SLSEditor',
    'adw/advancedDrawConfig'
], function (
             registerSuite,
             assert,
             lang,
             Color,
             Widget,
             defaultConfig
) {

    var widget;

    registerSuite ( {

        name: 'SLSEditor module test',

        setup: function () {
            // do nothing
        },

        // before each test executes
        beforeEach: function() {

            widget = new Widget( { symbol: lang.clone( defaultConfig.defaultPolylineSymbol ) } );
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

            var expected = lang.clone( defaultConfig.defaultPolylineSymbol );
            var actual = widget.get( 'symbol' );

            console.log( 'expected/actual: ', expected, actual );

            assert.deepEqual (
                actual,
                expected,
                '.get( symbol ) should return same symbol as passed into constructor.'
            );

        },

        'setSymbolStyleTest': function () {

            var expected = lang.clone( defaultConfig.defaultPolylineSymbol );
            expected.style = 'esriSLSDashDotDot';

            widget.outlineStylePicker.set( 'style', 'esriSLSDashDotDot' );

            var actual = widget.get( 'symbol' );

            console.log( 'expected/actual: ', expected, actual );

            assert.deepEqual (
                actual,
                expected,
                '.get( symbol ) should return default symbol with the same symbol style as the test value ( esriSLSDashDotDot ).'
            );

        },

        'setOutlineWidthTest': function () {

            var width = 6.3;
            var expected = lang.clone( defaultConfig.defaultPolylineSymbol );
            expected.width = width;

            widget.outlineWidthSlider.set( 'value', width );

            var actual = widget.get( 'symbol' );

            console.log( 'expected/actual: ', expected, actual );

            assert.deepEqual (
                actual,
                expected,
                '.get( symbol ) should return default symbol with the outline width updated to the test value ( ' + width + ' ).'
            );

        },

        'alphaSliderChangeTest': function () {

            var expected = lang.clone( defaultConfig.defaultPolylineSymbol );
            expected.color = [ 255, 0, 0, 191 ];

            widget.outlineColorPicker._onAlphaSliderChange( 0.75 );

            var actual = widget.get( 'symbol' );

            console.log( 'expected/actual: ', expected, actual );

            assert.deepEqual (
                actual,
                expected,
                '.get( symbol ) should return symbol with color alpha value modified by new slider value.'
            );

        },

        'colorPickerChangeTest': function () {

            var expected = lang.clone( defaultConfig.defaultPolylineSymbol );
            expected.color = [ 0, 0, 0, 255 ];

            widget.outlineColorPicker._onColorPickerChange( '#000000' );

            var actual = widget.get( 'symbol' );

            console.log( 'expected/actual: ', expected, actual );

            assert.deepEqual (
                actual,
                expected,
                '.get( symbol ) should return symbol with color value modified by new color picker color value.'
            );
        }

    } );

} );
