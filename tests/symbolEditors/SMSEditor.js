define ( [
    'intern!object',
    'intern/chai!assert',
    'dojo/_base/lang',
    'dojo/_base/Color',
    'adw/widget/SMSEditor',
    'adw/advancedDrawConfig'
], function (
    registerSuite,
    assert,
    lang,
    Color,
    Widget,
    defaultConfig
) {

    var widget, expected, actual;

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
            console.log( 'end of tests' );

        },

        'constructorOptionsTest': function () {

            expected = lang.clone( defaultConfig.defaultPointSymbol );
            actual = widget.get( 'symbol' );

            assert.deepEqual (
                actual,
                expected,
                '.get( symbol ) should return same symbol as passed into constructor.'
            );

        },

        'setSymbolStyleTest': function () {

            expected = lang.clone( defaultConfig.defaultPointSymbol );
            expected.style = 'esriSMSSquare';

            widget.symbolStylePicker._onSelectDijitChange( 3 );

            actual = widget.get( 'symbol' );

            assert.strictEqual (
                actual.outline.width,
                expected.outline.width,
                '.get( symbol ) should return default symbol with the same symbol style as the test value ( esriSMSSquare ).'
            );
        },

        'setOutlineWidthTest': function () {

            var width = 6.3;
            expected = lang.clone( defaultConfig.defaultPointSymbol );
            expected.outline.width = width;

            widget.outlineWidthSlider.set( 'value', width );

            actual = widget.get( 'symbol' );

            assert.strictEqual (
                actual.outline.width,
                expected.outline.width,
                '.get( symbol ) should return default symbol with the outline width updated to the test value ( ' + width + ' ).'
            );

        },

        'alphaSliderChangeTest': function () {

            expected = lang.clone( defaultConfig.defaultPointSymbol );
            expected.color = [ 255, 0, 0, 191 ];

            widget.symbolColorPicker._onAlphaSliderChange( 0.75 );

            actual = widget.get( 'symbol' );

            assert.deepEqual (
                actual,
                expected,
                '.get( symbol ) should return symbol with color alpha value modified by new slider value.'
            );

        },

        'colorPickerChangeTest': function () {

            expected = lang.clone( defaultConfig.defaultPointSymbol );
            expected.color = [ 0, 0, 0, 200 ];

            widget.symbolColorPicker._onColorPickerChange( '#000000' );

            actual = widget.get( 'symbol' );

            assert.deepEqual (
                actual,
                expected,
                '.get( symbol ) should return symbol with color value modified by new color picker color value.'
            );
        }

    } );

} );
