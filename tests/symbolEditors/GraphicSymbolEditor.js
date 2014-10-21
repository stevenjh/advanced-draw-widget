define ( [
    'intern!object',
    'intern/chai!assert',
    'dojo/_base/lang',
    'adw/widget/GraphicSymbolEditor',
    'adw/widget/SMSEditor',
    'esri/graphic',
    'adw/advancedDrawConfig',
    'esri/symbols/jsonUtils'
], function (
    registerSuite,
    assert,
    lang,
    Widget,
    SMSEditor,
    Graphic,
    defaultConfig,
    symUtil
) {

    var widget, testGraphic, expected, actual;

    var getTestGraphic = function () {

        var graphic = new Graphic(
            null,
            symUtil.fromJson( lang.clone ( defaultConfig.defaultPointSymbol ) ),
            { draw_type: 'point' }
        );

        return graphic;
    };

    registerSuite ( {
        name: 'GraphicSymbolEditor module tests',

        setup: function () {

        },

        // before each test executes
        beforeEach: function() {
            widget = new Widget( { graphic: getTestGraphic() } );
            widget.show();
        },

        afterEach: function() {

            console.log( 'expected/actual: ', expected, actual );

            actual = null;
            expected = null;

            if ( widget ) {
                widget.destroy();
            }

        },

        // after the suite is done (all tests)
        teardown: function() {

            if ( widget ){
                widget.destroy();
            }

        },

        'Test editor type': function () {

            assert.instanceOf (
                widget.editor,
                SMSEditor,
                'Widget.editor should be an instance of SMSEditor when graphic.attributes.draw_type = point.'
            );

        },

        'Test updating symbol': function () {

            expected = getTestGraphic();

            var updatedSymbol = getTestGraphic().symbol.toJson();
            updatedSymbol.color = [ 1,2,3,128 ];

            expected.symbol = symUtil.fromJson( updatedSymbol );

            widget.editor.set( 'symbol', updatedSymbol );

            actual = widget.get( 'graphic' );

            assert.deepEqual(
                actual.symbol,
                expected.symbol,
                'Graphic symbol should be updated when editor symbol changes'
            );

        },

        'Test cancelling updates': function () {

            expected = symUtil.fromJson( lang.clone( defaultConfig.defaultPointSymbol ) );

            var updatedSymbol = getTestGraphic().symbol.toJson();
            updatedSymbol.style = 'esriSMSCross';

            widget.editor.set( 'symbol', updatedSymbol );
            widget._rollBackSymbolUpdates();

            actual = widget.get( 'graphic' ).symbol;

            assert.deepEqual(
                actual.style,
                expected.style,
                'Graphic symbol updates should be rolled back.'
            );

        }
    } );

} );
